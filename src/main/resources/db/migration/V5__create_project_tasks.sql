CREATE TABLE project_tasks (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL,
    created_by_id BIGINT NOT NULL,
    assignee_id BIGINT,
    title VARCHAR(140) NOT NULL,
    description VARCHAR(2000),
    status VARCHAR(20) NOT NULL DEFAULT 'TODO',
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    due_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT project_tasks_status_check CHECK (status IN ('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE')),
    CONSTRAINT project_tasks_priority_check CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH'))
);

CREATE INDEX idx_project_tasks_project_status
    ON project_tasks (project_id, status);