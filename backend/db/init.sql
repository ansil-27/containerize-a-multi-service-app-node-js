CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(80) NOT NULL DEFAULT 'Ansil',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO posts (title, content, author)
VALUES
  (
    'Welcome to Ansil''s Blog',
    'This is a simple full-stack blog powered by React, Node.js, and PostgreSQL.',
    'Ansil'
  ),
  (
    'First Docker Compose Run',
    'Start the environment, open the frontend, and create your first post from the browser.',
    'Ansil'
  )
ON CONFLICT DO NOTHING;
