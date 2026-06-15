# Zeitplan – SecurePass

Zurück zur [Projektdokumentation (README.md)](README.md)

| Name | Beschreibung | Zeit (h) |
| --- | --- | --- |
| Projektplanung | Architektur planen und Technologien festlegen (Express + React + PostgreSQL). Datenbankstruktur und Sicherheitskonzept skizzieren. | 0.5 |
| Projekt aufsetzen | Express-Backend und React-Frontend erstellen. Ordnerstruktur, Dependencies und .env-Secrets-Management einrichten. | 1 |
| Datenbank aufsetzen | PostgreSQL installieren und konfigurieren. Tabellen für users, vault_entries, refresh_tokens und audit_log erstellen. | 1.5 |
| User Entity & Repository | Datenmodell und Repository für den User erstellen. DB-Zugriff einrichten. | 1 |
| Registrierung Backend | Register-Endpunkt mit Argon2-Hashing des Master-Passworts implementieren. Benutzername und Hash sicher in DB speichern. | 2 |
| Login Backend | Login-Endpunkt implementieren und Master-Passwort mit Argon2 verifizieren. JWT Access- und Refresh-Token zurückgeben. | 2 |
| Refresh Token Rotation | Refresh-Endpunkt mit Token-Rotation und Invalidierung alter Tokens. Sichere Speicherung (HttpOnly Cookie). | 1.5 |
| Zwei-Faktor-Authentifizierung | TOTP-basierte 2FA implementieren. Secret generieren, QR-Code bereitstellen und Code bei Login verifizieren. | 2 |
| Rate Limiting & Account Lockout | Rate Limiting auf Auth-Endpunkten und Account Lockout nach fehlgeschlagenen Login-Versuchen. | 1.5 |
| Verschlüsselung & Key Derivation | AES-256-GCM-Verschlüsselung implementieren. PBKDF2-Schlüsselableitung aus dem Master-Passwort. | 2 |
| Vault Entry & CRUD Backend | Datenmodell für Vault-Einträge (Website, Benutzername, Passwort). Endpunkte zum Erstellen, Abrufen, Bearbeiten und Löschen – nur für eingeloggte User. | 2 |
| Zugriffskontrolle & Eingabevalidierung | Ownership-Checks auf allen Vault-Endpunkten (Schutz vor IDOR). CSRF-Schutz und serverseitige Eingabevalidierung. | 1.5 |
| Audit-Log & sichere HTTP-Header | Audit-Log für sicherheitsrelevante Ereignisse. Sichere HTTP-Header mit helmet.js und HTTPS-only. | 1 |
| API testen | Alle Endpunkte mit Postman testen. Fehler beheben. | 1 |
| Login & Register Frontend | Login- und Registrierungsseite in React bauen. Formulare mit API verbinden. | 2 |
| 2FA Frontend | TOTP-Setup mit QR-Code-Anzeige und Code-Eingabe beim Login implementieren. | 1.5 |
| Navbar & Auth-State Frontend | Navigation erstellen und eingeloggten User anzeigen. Auth-State und Token-Handling im Frontend. | 1 |
| Vault Übersicht Frontend | Liste/Cards aller gespeicherten Einträge auf der Startseite anzeigen. | 1.5 |
| Eintrag erstellen & bearbeiten Frontend | Formular für neue und bestehende Vault-Einträge bauen. Passwort-Generator einbinden. | 2 |
| Styling | Grundlegendes CSS für alle Seiten. Website übersichtlich und sauber gestalten. | 1.5 |
| Security Hardening & CI | npm audit in CI-Pipeline einbinden. Dependency-Überprüfung und Hardening. | 1 |
| Letzter Test & Bugfixing | Gesamte App durchklicken und Fehler beheben. Sicherstellen dass alles funktioniert. | 1 |
| Letzter Commit & Doku | Code aufräumen und kommentieren. README schreiben und auf GitHub pushen. | 1 |
