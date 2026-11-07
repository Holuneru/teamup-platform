ALTER TABLE user_notifications
    DROP CONSTRAINT IF EXISTS user_notifications_type_check;

ALTER TABLE user_notifications
    ADD CONSTRAINT user_notifications_type_check
    CHECK (type IN (
        'NEW_MESSAGE',
        'PROJECT_INVITATION',
        'INVITATION_ACCEPTED',
        'INVITATION_REJECTED',
        'APPLICATION_RECEIVED',
        'APPLICATION_ACCEPTED',
        'APPLICATION_REJECTED',
        'PROJECT_MENTION',
        'TASK_ASSIGNED',
        'TASK_COMMENT',
        'TASK_STATUS_CHANGED'
    ));
