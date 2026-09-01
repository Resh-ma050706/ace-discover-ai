CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    college VARCHAR(200),
    degree VARCHAR(100),
    department VARCHAR(150),
    study_year INTEGER CHECK (study_year BETWEEN 1 AND 6),
    skills JSONB DEFAULT '[]'::jsonb,
    interests JSONB DEFAULT '[]'::jsonb,
    preferred_locations JSONB DEFAULT '[]'::jsonb,
    preferred_event_types JSONB DEFAULT '[]'::jsonb,
    team_availability VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY,
    title VARCHAR(250) NOT NULL,
    description TEXT,
    event_type VARCHAR(100) NOT NULL,
    domains JSONB DEFAULT '[]'::jsonb,
    location VARCHAR(150),
    mode VARCHAR(30),
    venue TEXT,
    event_start_date DATE NOT NULL,
    event_end_date DATE,
    registration_deadline DATE,
    eligible_degrees JSONB DEFAULT '[]'::jsonb,
    eligible_departments JSONB DEFAULT '[]'::jsonb,
    eligible_years JSONB DEFAULT '[]'::jsonb,
    required_skills JSONB DEFAULT '[]'::jsonb,
    minimum_team_size INTEGER DEFAULT 1,
    maximum_team_size INTEGER DEFAULT 1,
    fee NUMERIC(10,2) DEFAULT 0,
    organizer VARCHAR(200),
    verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(30) DEFAULT 'ACTIVE',
    source_url TEXT,
    last_synced_at TIMESTAMP,
    demo_enriched BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS saved_events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER NOT NULL
        REFERENCES events(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, event_id)
);

CREATE TABLE IF NOT EXISTS user_interactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER
        REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER
        REFERENCES events(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_type
ON events(event_type);

CREATE INDEX IF NOT EXISTS idx_events_location
ON events(location);

CREATE INDEX IF NOT EXISTS idx_events_deadline
ON events(registration_deadline);

CREATE INDEX IF NOT EXISTS idx_events_status
ON events(status);