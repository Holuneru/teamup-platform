ALTER TABLE conversations
    ADD COLUMN IF NOT EXISTS participant_one_deleted_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS participant_two_deleted_at TIMESTAMP;