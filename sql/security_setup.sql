-- Rol app_user: permisos de aplicacion (SELECT, INSERT, UPDATE)
CREATE ROLE app_user WITH LOGIN PASSWORD 'voicefinance_app_2024';
GRANT CONNECT ON DATABASE voicefinance TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE ON TABLES TO app_user;

-- Rol app_readonly: solo lectura para reportes
CREATE ROLE app_readonly WITH LOGIN PASSWORD 'voicefinance_read_2024';
GRANT CONNECT ON DATABASE voicefinance TO app_readonly;
GRANT USAGE ON SCHEMA public TO app_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO app_readonly;

-- Row Level Security (RLS)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_transactions ON transactions FOR ALL USING ("userId" = current_setting('app.current_user_id'));
CREATE POLICY user_categories ON categories FOR ALL USING ("userId" = current_setting('app.current_user_id'));
CREATE POLICY user_monthly ON monthly_summaries FOR ALL USING ("userId" = current_setting('app.current_user_id'));
CREATE POLICY user_alerts ON alerts FOR ALL USING ("userId" = current_setting('app.current_user_id'));
CREATE POLICY user_recommendations ON recommendations FOR ALL USING ("userId" = current_setting('app.current_user_id'));
