-- Apps table
CREATE TABLE IF NOT EXISTS apps (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  path VARCHAR(255) NOT NULL,
  framework VARCHAR(50) DEFAULT 'React',
  port INTEGER NOT NULL,
  gradient VARCHAR(100),
  bg_gradient VARCHAR(100),
  border_color VARCHAR(100),
  text_color VARCHAR(100),
  description TEXT,
  version VARCHAR(20) DEFAULT '1.0.0',
  last_updated DATE DEFAULT CURRENT_DATE,
  detail_content TEXT,
  integrated BOOLEAN DEFAULT true,
  ios_app_url VARCHAR(500),
  android_app_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add ios_app_url and android_app_url columns for existing databases
-- Using ALTER TABLE with IF NOT EXISTS (PostgreSQL 9.6+)
ALTER TABLE apps ADD COLUMN IF NOT EXISTS ios_app_url VARCHAR(500);
ALTER TABLE apps ADD COLUMN IF NOT EXISTS android_app_url VARCHAR(500);

-- Screenshots table
CREATE TABLE IF NOT EXISTS screenshots (
  id SERIAL PRIMARY KEY,
  app_id VARCHAR(100) REFERENCES apps(id) ON DELETE CASCADE,
  url VARCHAR(500) NOT NULL,
  alt VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_screenshots_app_id ON screenshots(app_id);

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table for login tokens
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);

-- Add unique constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'uq_screenshots_app_url'
  ) THEN
    -- Delete duplicate screenshots, keeping only the one with the smallest id
    DELETE FROM screenshots
    WHERE id NOT IN (
      SELECT MIN(id)
      FROM screenshots
      GROUP BY app_id, url
    );
    
    -- Now add the unique constraint
    ALTER TABLE screenshots ADD CONSTRAINT uq_screenshots_app_url UNIQUE (app_id, url);
  END IF;
END $$;

-- Insert initial data from apps.json
INSERT INTO apps (id, name, path, framework, port, gradient, bg_gradient, border_color, text_color, description, version, last_updated, detail_content, integrated)
VALUES
  ('hopefull-admin', 'Hopefull Admin', '/hopefull-admin', 'React', 3101, 'from-sky-500 to-blue-600', 'from-sky-50 to-blue-50', 'border-sky-200', 'text-sky-700', 'Hopefull Admin dashboard', '1.0.0', '2024-01-15', '', true),
  ('assest-management', 'Asset Management', '/assest-management', 'React', 3102, 'from-sky-500 to-blue-600', 'from-sky-50 to-blue-50', 'border-sky-200', 'text-sky-700', 'Enterprise Asset Management Solution', '1.0.0', '2024-01-15', '', true),
  ('cmms', 'CMMS', '/cmms', 'React', 3103, 'from-sky-500 to-blue-600', 'from-sky-50 to-blue-50', 'border-sky-200', 'text-sky-700', 'Computerized Maintenance Management System', '1.0.0', '2024-01-15', '', true),
  ('family-fun', 'FamilyFun', '/family-fun', 'React', 3104, 'from-purple-500 to-indigo-600', 'from-purple-50 to-indigo-50', 'border-purple-200', 'text-purple-700', 'Family events and activities platform', '1.0.0', '2024-01-15', '', true),
  ('booking-guest-portal', 'Booking Guest Portal', '/booking-guest-portal', 'React', 3105, 'from-amber-500 to-orange-600', 'from-amber-50 to-orange-50', 'border-amber-200', 'text-amber-700', 'Guest booking and property search', '1.0.0', '2024-01-15', '', true),
  ('booking-host-portal', 'Booking Host Portal', '/booking-host-portal', 'React', 3106, 'from-teal-500 to-cyan-600', 'from-teal-50 to-cyan-50', 'border-teal-200', 'text-teal-700', 'Host dashboard for property management', '1.0.0', '2024-01-15', '', true),
  ('elearning-admin-portal', 'E-Learning Admin', '/elearning-admin-portal', 'React', 3107, 'from-fuchsia-500 to-pink-600', 'from-fuchsia-50 to-pink-50', 'border-fuchsia-200', 'text-fuchsia-700', 'Teacher and admin course management', '1.0.0', '2024-01-15', '', true),
  ('elearning-student-portal', 'E-Learning Student', '/elearning-student-portal', 'React', 3108, 'from-lime-500 to-green-600', 'from-lime-50 to-green-50', 'border-lime-200', 'text-lime-700', 'Student learning platform', '1.0.0', '2024-01-15', '', true)
ON CONFLICT (id) DO NOTHING;

-- Insert screenshots
INSERT INTO screenshots (app_id, url, alt, sort_order)
VALUES
  ('hopefull-admin', '/screenshots/hopefull-admin-1.png', 'Login', 1),
  ('hopefull-admin', '/screenshots/hopefull-admin-2.png', 'Dashboard overview', 2),
  ('hopefull-admin', '/screenshots/hopefull-admin-3.png', 'User management', 3),
  ('assest-management', '/screenshots/assest-management-1.png', 'Asset Management Dashboard', 1)
ON CONFLICT DO NOTHING;

-- Insert mock admin user (password: admin123)
-- Password hash is SHA256 of 'admin123' + 'shell_salt'
INSERT INTO users (email, password_hash, name, role)
VALUES ('admin@saigontechnology.com', '9fd940f0c1540f8b4e26ec05cde7acebaa943e152bbb91580a93b685077d0524', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;
