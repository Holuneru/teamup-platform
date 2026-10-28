DO $$
BEGIN
    IF to_regclass('users') IS NOT NULL THEN
        ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP;
        UPDATE users SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL;
        ALTER TABLE users ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
        ALTER TABLE users ALTER COLUMN created_at SET NOT NULL;
    END IF;
END
$$;