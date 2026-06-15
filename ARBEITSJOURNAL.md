# Arbeitsjournal – SecurePass

Zurück zur [Projektdokumentation (README.md)](README.md)

| Datum | Zeit (min) | Erledigt | Schwierigkeiten |
| --- | --- | --- | --- |
| 08.06.2026 | 200 | <ul><li>Einführung in den Unterricht gehabt und Videos von Mitschülern geschaut</li><li>Projektplanung und Details im README.md festgelegt</li><li>Projekt Techstack geplant und aufgesetzt</li><li>Datenbank aufgesetzt</li><li>WSL aufgesetzt</li></ul> | <ul>Ich hatte Anfangs Schwierigkeiten meine Projektziele zu definieren.</ul> |
| 12.06.2026 | 185 | <ul><li>Implementierung begonnen</li><li>Zeitplan überarbeitet</li><li>Branching-Strategie festgelegt (Feature-Branches mit PRs)</li><li>Backend aufgesetzt (Express mit helmet, CORS, Rate Limiting, Health-Check)</li><li>Datenbank mit Docker und PostgreSQL aufgesetzt und Schema erstellt (users, vault_entries, refresh_tokens, audit_log)</li></ul> | <ul>-</ul> |
| 14.06.2026 | 130 | <ul><li>User Entity und Repository erstellt (DB-Zugriff für Benutzer)</li><li>Registrierung im Backend implementiert (Argon2-Hashing, Input-Validierung, Audit-Log)</li></ul> | <ul>Ich musste mich herausfinden wie Argon2 in Node.js korrekt eingebunden und als argon2id konfiguriert wird</ul> |
| 15.06.2026 | 40 | <ul><li>Login im Backend implementiert (Argon2-Verifizierung, JWT Access-Token <li> Refresh-Token als HttpOnly-Cookie) Login im Backend implementiert (Argon2-Verifizierung, JWT Access-Token, Refresh-Token als HttpOnly-Cookie)</li></li></ul> | <ul>-</ul> |
