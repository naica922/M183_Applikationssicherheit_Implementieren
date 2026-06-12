CREATE TABLE vault_entries (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  website         varchar(255) NOT NULL,
  username        varchar(255) NOT NULL,
  password_cipher bytea NOT NULL,
  password_iv     bytea NOT NULL,
  password_tag    bytea NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_vault_entries_user_id ON vault_entries(user_id);

CREATE TRIGGER vault_entries_set_updated_at
  BEFORE UPDATE ON vault_entries
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
