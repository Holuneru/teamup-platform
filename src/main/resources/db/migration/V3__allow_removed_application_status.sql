ALTER TABLE project_applications
    DROP CONSTRAINT IF EXISTS project_applications_status_check;

ALTER TABLE project_applications
    ADD CONSTRAINT project_applications_status_check
    CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'REMOVED'));
