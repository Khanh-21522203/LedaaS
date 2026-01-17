-- Webhook endpoints table
CREATE TABLE webhook_endpoints
(
    id         UUID PRIMARY KEY     DEFAULT gen_random_uuid(),
    ledger_id  UUID        NOT NULL REFERENCES ledgers (id) ON DELETE CASCADE,
    url        TEXT        NOT NULL,
    secret     TEXT        NOT NULL,
    is_active  BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_webhook_endpoints_ledger ON webhook_endpoints (ledger_id);

-- Webhook deliveries table
CREATE TABLE webhook_deliveries
(
    id                  UUID PRIMARY KEY     DEFAULT gen_random_uuid(),
    event_id            UUID        NOT NULL REFERENCES events (id) ON DELETE CASCADE,
    webhook_endpoint_id UUID        NOT NULL REFERENCES webhook_endpoints (id) ON DELETE CASCADE,
    status              TEXT        NOT NULL CHECK (status IN ('success', 'retryable_error', 'non_retryable_error')),
    attempt             INT         NOT NULL,
    last_attempt_at     TIMESTAMPTZ,
    http_status         INT,
    error_message       TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_webhook_deliveries_event ON webhook_deliveries (event_id);
CREATE INDEX idx_webhook_deliveries_endpoint ON webhook_deliveries (webhook_endpoint_id);