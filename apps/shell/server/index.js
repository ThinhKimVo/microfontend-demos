const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.API_PORT || 3150;

// PostgreSQL connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'shell_apps',
  user: process.env.DB_USER || 'shell',
  password: process.env.DB_PASSWORD || 'shell123',
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Check upload capability
app.get('/api/check-upload', async (req, res) => {
  try {
    let screenshotsDir = path.join(__dirname, '..', 'public', 'screenshots');
    
    if (!fs.existsSync(path.join(__dirname, '..', 'public'))) {
      screenshotsDir = path.join(__dirname, '../../public/screenshots');
    }

    const canWrite = (() => {
      try {
        fs.accessSync(screenshotsDir, fs.constants.W_OK);
        return true;
      } catch {
        return false;
      }
    })();

    res.json({
      status: 'ok',
      uploadDir: screenshotsDir,
      dirExists: fs.existsSync(screenshotsDir),
      canWrite: canWrite,
      dbConnected: !!pool,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all apps with screenshots
app.get('/api/apps', async (req, res) => {
  try {
    const appsResult = await pool.query(`
      SELECT id, name, path, framework, port, gradient, bg_gradient, border_color,
             text_color, description, version, last_updated, detail_content, integrated, ios_app_url, android_app_url
      FROM apps ORDER BY name
    `);

    const screenshotsResult = await pool.query(`
      SELECT app_id, url, alt FROM screenshots ORDER BY app_id, sort_order
    `);

    // Group screenshots by app_id
    const screenshotsByApp = {};
    screenshotsResult.rows.forEach(s => {
      if (!screenshotsByApp[s.app_id]) {
        screenshotsByApp[s.app_id] = [];
      }
      screenshotsByApp[s.app_id].push({ url: s.url, alt: s.alt });
    });

    // Map to frontend format
    const apps = appsResult.rows.map(app => ({
      id: app.id,
      name: app.name,
      path: app.path,
      framework: app.framework,
      port: app.port,
      gradient: app.gradient,
      bgGradient: app.bg_gradient,
      borderColor: app.border_color,
      textColor: app.text_color,
      description: app.description,
      version: app.version,
      lastUpdated: app.last_updated,
      detailContent: app.detail_content || '',
      integrated: app.integrated,
      iosAppUrl: app.ios_app_url || '',
      androidAppUrl: app.android_app_url || '',
      screenshots: screenshotsByApp[app.id] || [],
    }));

    res.json(apps);
  } catch (err) {
    console.error('Error fetching apps:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get single app
app.get('/api/apps/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const appResult = await pool.query('SELECT * FROM apps WHERE id = $1', [id]);
    if (appResult.rows.length === 0) {
      return res.status(404).json({ error: 'App not found' });
    }

    const screenshotsResult = await pool.query(
      'SELECT url, alt FROM screenshots WHERE app_id = $1 ORDER BY sort_order',
      [id]
    );

    const app = appResult.rows[0];
    res.json({
      id: app.id,
      name: app.name,
      path: app.path,
      framework: app.framework,
      port: app.port,
      gradient: app.gradient,
      bgGradient: app.bg_gradient,
      borderColor: app.border_color,
      textColor: app.text_color,
      description: app.description,
      version: app.version,
      lastUpdated: app.last_updated,
      detailContent: app.detail_content || '',
      integrated: app.integrated,
      iosAppUrl: app.ios_app_url || '',
      androidAppUrl: app.android_app_url || '',
      screenshots: screenshotsResult.rows,
    });
  } catch (err) {
    console.error('Error fetching app:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create app
app.post('/api/apps', async (req, res) => {
  try {
    const app = req.body;

    await pool.query(`
      INSERT INTO apps (id, name, path, framework, port, gradient, bg_gradient, border_color,
                       text_color, description, version, last_updated, detail_content, integrated, ios_app_url, android_app_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    `, [
      app.id, app.name, app.path, app.framework, app.port, app.gradient, app.bgGradient,
      app.borderColor, app.textColor, app.description, app.version, app.lastUpdated,
      app.detailContent, app.integrated, app.iosAppUrl || null, app.androidAppUrl || null
    ]);

    // Insert screenshots
    if (app.screenshots && app.screenshots.length > 0) {
      for (let i = 0; i < app.screenshots.length; i++) {
        const s = app.screenshots[i];
        await pool.query(
          'INSERT INTO screenshots (app_id, url, alt, sort_order) VALUES ($1, $2, $3, $4)',
          [app.id, s.url, s.alt, i + 1]
        );
      }
    }

    res.json({ success: true, id: app.id });
  } catch (err) {
    console.error('Error creating app:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update app
app.put('/api/apps/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const app = req.body;

    await pool.query(`
      UPDATE apps SET
        name = $2, path = $3, framework = $4, port = $5, gradient = $6, bg_gradient = $7,
        border_color = $8, text_color = $9, description = $10, version = $11,
        last_updated = $12, detail_content = $13, integrated = $14, ios_app_url = $15, android_app_url = $16,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [
      id, app.name, app.path, app.framework, app.port, app.gradient, app.bgGradient,
      app.borderColor, app.textColor, app.description, app.version, app.lastUpdated,
      app.detailContent, app.integrated, app.iosAppUrl || null, app.androidAppUrl || null
    ]);

    // Update screenshots - delete old and insert new
    await pool.query('DELETE FROM screenshots WHERE app_id = $1', [id]);

    if (app.screenshots && app.screenshots.length > 0) {
      for (let i = 0; i < app.screenshots.length; i++) {
        const s = app.screenshots[i];
        await pool.query(
          'INSERT INTO screenshots (app_id, url, alt, sort_order) VALUES ($1, $2, $3, $4)',
          [id, s.url, s.alt, i + 1]
        );
      }
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error updating app:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete app
app.delete('/api/apps/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM apps WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting app:', err);
    res.status(500).json({ error: err.message });
  }
});

// Upload screenshot (save to dist/screenshots for production serving)
app.post('/api/upload-screenshot', async (req, res) => {
  try {
    const { filename, data } = req.body;
    if (!filename || !data) {
      return res.status(400).json({ error: 'Missing filename or data' });
    }

    // Extract MIME type and remove base64 prefix
    const mimeMatch = data.match(/^data:image\/(\w+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'png';
    const base64Data = data.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Use correct file extension based on MIME type
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    const correctFilename = `${nameWithoutExt}.${mimeType}`;

    // Save to BOTH dist/screenshots (for production serving) and public/screenshots (for future builds)
    const distScreenshotsDir = path.join(__dirname, '..', 'dist', 'screenshots');
    const publicScreenshotsDir = path.join(__dirname, '..', 'public', 'screenshots');

    // Create directories if they don't exist
    for (const dir of [distScreenshotsDir, publicScreenshotsDir]) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`[Screenshot] Created directory: ${dir}`);
      }
    }

    // Ensure filename doesn't contain path traversal attempts
    const distFilepath = path.join(distScreenshotsDir, correctFilename);
    if (path.relative(distScreenshotsDir, distFilepath).startsWith('..')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    // Save to both locations
    fs.writeFileSync(distFilepath, buffer);
    fs.writeFileSync(path.join(publicScreenshotsDir, correctFilename), buffer);

    console.log(`[Screenshot] Saved to dist: ${distFilepath}`);
    console.log(`[Screenshot] Saved to public: ${path.join(publicScreenshotsDir, correctFilename)}`);
    res.json({ success: true, path: `/screenshots/${correctFilename}` });
  } catch (err) {
    console.error('[Screenshot] Error:', err);
    res.status(500).json({ error: `Failed to save screenshot: ${err.message}` });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`[API Server] Running on http://localhost:${PORT}`);
});
