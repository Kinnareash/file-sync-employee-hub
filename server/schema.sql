
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'employee',
    user_status VARCHAR(20) DEFAULT 'active',
    department VARCHAR(100),
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    filepath TEXT NOT NULL,
    mimetype VARCHAR(100) NOT NULL,
    size INTEGER,
    user_id INTEGER REFERENCES users(id),
    category VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT now(),
    status TEXT DEFAULT 'pending'
);
