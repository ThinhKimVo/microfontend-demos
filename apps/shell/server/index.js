const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.API_PORT || 3150;

// Simple password hashing (for demo - use bcrypt in production)
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password + 'shell_salt').digest('hex');
};

const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

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

// Serve screenshots from both dist and public directories
// Priority: dist (production uploads) > public (bundled assets)
const distScreenshotsDir = path.join(__dirname, '..', 'dist', 'screenshots');
const publicScreenshotsDir = path.join(__dirname, '..', 'public', 'screenshots');

// Ensure screenshots directories exist
[distScreenshotsDir, publicScreenshotsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`[Server] Created screenshots directory: ${dir}`);
  }
});

// Serve screenshots - check dist first, then public
app.use('/screenshots', (req, res, next) => {
  const filename = req.path.replace(/^\//, '');
  const distPath = path.join(distScreenshotsDir, filename);
  const publicPath = path.join(publicScreenshotsDir, filename);

  // Prevent directory traversal
  if (filename.includes('..')) {
    return res.status(400).send('Invalid path');
  }

  // Check dist first (uploaded files), then public (bundled files)
  if (fs.existsSync(distPath)) {
    return res.sendFile(distPath);
  } else if (fs.existsSync(publicPath)) {
    return res.sendFile(publicPath);
  }

  res.status(404).send('Screenshot not found');
});

app.use(express.static(path.join(__dirname, '..', 'public')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============ AUTH ENDPOINTS ============

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const userResult = await pool.query(
      'SELECT id, email, password_hash, name, role FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = userResult.rows[0];
    const passwordHash = hashPassword(password);

    // Check password
    if (user.password_hash !== passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create session
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await pool.query(
      'INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, token, expiresAt]
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Logout
app.post('/api/auth/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (token) {
      await pool.query('DELETE FROM sessions WHERE token = $1', [token]);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Get current user
app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const sessionResult = await pool.query(
      `SELECT s.user_id, s.expires_at, u.email, u.name, u.role
       FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.token = $1`,
      [token]
    );

    if (sessionResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    const session = sessionResult.rows[0];

    if (new Date(session.expires_at) < new Date()) {
      await pool.query('DELETE FROM sessions WHERE token = $1', [token]);
      return res.status(401).json({ error: 'Session expired' });
    }

    res.json({
      user: {
        id: session.user_id,
        email: session.email,
        name: session.name,
        role: session.role,
      },
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Register (for demo purposes)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create user
    const passwordHash = hashPassword(password);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
      [email.toLowerCase(), passwordHash, name, 'user']
    );

    const user = result.rows[0];

    // Create session
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await pool.query(
      'INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, token, expiresAt]
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ============ END AUTH ENDPOINTS ============

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

// Helper function to delete screenshot file
function deleteScreenshotFile(url) {
  if (!url || !url.startsWith('/screenshots/')) return;

  const filename = url.replace('/screenshots/', '');
  // Prevent directory traversal
  if (filename.includes('..')) return;

  const distPath = path.join(distScreenshotsDir, filename);
  const publicPath = path.join(publicScreenshotsDir, filename);

  // Delete from both locations
  [distPath, publicPath].forEach(filepath => {
    if (fs.existsSync(filepath)) {
      try {
        fs.unlinkSync(filepath);
        console.log(`[Screenshot] Deleted: ${filepath}`);
      } catch (err) {
        console.error(`[Screenshot] Failed to delete ${filepath}:`, err.message);
      }
    }
  });
}

// Update app
app.put('/api/apps/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const app = req.body;

    // Get old screenshots before updating
    const oldScreenshotsResult = await pool.query(
      'SELECT url FROM screenshots WHERE app_id = $1',
      [id]
    );
    const oldUrls = oldScreenshotsResult.rows.map(r => r.url);
    const newUrls = (app.screenshots || []).map(s => s.url);

    // Find screenshots that were removed
    const removedUrls = oldUrls.filter(url => !newUrls.includes(url));

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

    // Delete removed screenshot files from disk
    removedUrls.forEach(url => deleteScreenshotFile(url));

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

    // Get screenshots before deleting app
    const screenshotsResult = await pool.query(
      'SELECT url FROM screenshots WHERE app_id = $1',
      [id]
    );

    // Delete app (screenshots cascade due to foreign key)
    await pool.query('DELETE FROM apps WHERE id = $1', [id]);

    // Delete screenshot files from disk
    screenshotsResult.rows.forEach(row => deleteScreenshotFile(row.url));

    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting app:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete screenshot file endpoint
app.delete('/api/screenshot', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'Missing url' });
    }

    deleteScreenshotFile(url);
    res.json({ success: true });
  } catch (err) {
    console.error('[Screenshot] Delete error:', err);
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
