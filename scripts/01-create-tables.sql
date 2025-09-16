-- Create tables for the event management system

-- Users table (extends the existing users_sync table)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'attendee', -- 'admin', 'organizer', 'attendee'
  organization TEXT,
  title TEXT,
  phone TEXT,
  dietary_restrictions TEXT,
  accessibility_needs TEXT,
  networking_interests TEXT[],
  qr_code TEXT UNIQUE,
  checked_in BOOLEAN DEFAULT FALSE,
  check_in_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  location TEXT,
  max_attendees INTEGER,
  registration_deadline TIMESTAMP,
  status TEXT DEFAULT 'draft', -- 'draft', 'published', 'ongoing', 'completed'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  speaker_name TEXT,
  speaker_bio TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  location TEXT,
  max_attendees INTEGER,
  session_type TEXT DEFAULT 'presentation', -- 'presentation', 'workshop', 'panel', 'networking'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Session registrations
CREATE TABLE IF NOT EXISTS session_registrations (
  id TEXT PRIMARY KEY,
  session_id TEXT REFERENCES sessions(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  registered_at TIMESTAMP DEFAULT NOW(),
  attended BOOLEAN DEFAULT FALSE,
  UNIQUE(session_id, user_id)
);

-- Q&A questions
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  session_id TEXT REFERENCES sessions(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  is_answered BOOLEAN DEFAULT FALSE,
  answer TEXT,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Polls
CREATE TABLE IF NOT EXISTS polls (
  id TEXT PRIMARY KEY,
  session_id TEXT REFERENCES sessions(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of poll options
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Poll responses
CREATE TABLE IF NOT EXISTS poll_responses (
  id TEXT PRIMARY KEY,
  poll_id TEXT REFERENCES polls(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  selected_option INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(poll_id, user_id)
);

-- Feedback
CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  session_id TEXT REFERENCES sessions(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comments TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Networking connections
CREATE TABLE IF NOT EXISTS networking_connections (
  id TEXT PRIMARY KEY,
  requester_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  recipient_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'declined'
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(requester_id, recipient_id)
);

-- Announcements
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  target_audience TEXT DEFAULT 'all', -- 'all', 'attendees', 'speakers', 'organizers'
  is_active BOOLEAN DEFAULT TRUE,
  created_by TEXT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_qr_code ON users(qr_code);
CREATE INDEX IF NOT EXISTS idx_sessions_event_id ON sessions(event_id);
CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_session_registrations_session_id ON session_registrations(session_id);
CREATE INDEX IF NOT EXISTS idx_session_registrations_user_id ON session_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_session_id ON questions(session_id);
CREATE INDEX IF NOT EXISTS idx_polls_session_id ON polls(session_id);
CREATE INDEX IF NOT EXISTS idx_poll_responses_poll_id ON poll_responses(poll_id);
CREATE INDEX IF NOT EXISTS idx_feedback_session_id ON feedback(session_id);
CREATE INDEX IF NOT EXISTS idx_networking_connections_requester ON networking_connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_networking_connections_recipient ON networking_connections(recipient_id);
