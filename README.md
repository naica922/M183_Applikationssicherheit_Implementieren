# M183_Applikationssicherheit_Implementieren
Als Teil vom Modul 183 Applikationssicherheit an der TBZ werde ich einen Passwort Manager erstellen.

Seit mehreren Jahren habe ich Probleme damit, einen guten kostenlosen Passwort Manager zu finden. Aus diesem Grund habe ich mich entschieden, die Zeit in diesem Modul dafür zu verwenden einen eigenen zu implementieren. So kann ich gleichzeitig ein praktisches, persönlich nützliches Tool bauen und dabei alle relevanten Sicherheitskonzepte aus M183 hands on umsetzen.
Der Passwort Manager heisst SecurePass.

### Projektdetails
**Modul**: M183 Applikationssicherheit implementieren  
**Klasse**: Ap23a  
**Dauer**: 30 Lektionen a 45 Minuten  
**Datum**: Juni 2026

### Projekt Idee SecurePass und Features

Mein Projekt SecurePass ist eine webbasierte Passwort Manager-Applikation, bei der Benutzer ihre Zugangsdaten (Website, Benutzername, Passwort) sicher verschlüsselt speichern können.

Folgendes sind meine Schwerpunkte für das Projekt:

#### 1. Authentifizierung & Session-Management
- Sicheres Passwort Hashing mit Argon2
- JWT mit Refresh Token Rotation
- TOTP-basierte Zwei-Faktor-Authentifizierung
- Rate Limiting
- Account Lockout nach fehlgeschlagenen Versuchen

#### 2. Verschlüsselung & Datenschutz
- AES-256-GCM für alle Vault-Einträge
- PBKDF2-Schlüsselableitung aus dem Master-Passwort
- HTTPS only und keine Secrets in Logs oder URLs

#### 3. Zugriffskontrolle & Eingabevalidierung
- Zugriffskontrolle: jeder User sieht und bearbeitet nur seine eigenen Vault-Einträge (Schutz vor IDOR)
- CSRF-Schutz für die Cookie-basierten Endpunkte
- serverseitige Eingabevalidierung aller Requests

#### Zusätzliche Ziele
- Audit-Log für alle sicherheitsrelevanten Ereignisse
- sichere HTTP-Header mit helmet.js
- automatische Dependency-Überprüfung per npm audit in der CI-Pipeline
- gutes Secrets-Management über .env
- Passwort-Policy bei der Registrierung

#### Erweiterte Ziele (Extended Goals)

Optionale Stretch Ziele, falls die Zeit reicht.

- Zero-Knowledge-Architektur: Verschlüsselung im Browser, der Server speichert nur Ciphertext
- Abgleich gegen geleakte Passwörter via HaveIBeenPwned (k-Anonymity)


### Zeitplan

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

### Sicherheit & OWASP

SecurePass orientiert sich an den OWASP Top 10. Ich achte in meinem Projekt auf folgende wichtige Risiken. Broken Access Control, durch OwnershipcChecks auf allen Vault-Endpunkten, Cryptographic Failures durch Argon2, AES-256-GCM und PBKDF2, sowie Authentication Failures durch 2FA, Rate Limiting und Account Lockout. Ergänzend schützen CSRF-Schutz, serverseitige Eingabevalidierung, sichere HTTP-Header (helmet.js) und ein Audit-Log vor weiteren typischen Angriffen. Über `npm audit` in der CI-Pipeline werden zudem verwundbare Abhängigkeiten frühzeitig erkannt.

### Arbeitsjournal

Das Arbeitsjournal habe ich für mehr Struktur in einer separaten Datei geführt: [ARBEITSJOURNAL.md](ARBEITSJOURNAL.md)

### Projektstruktur

```
.
├── backend/            Express-Backend (API, Auth, Verschlüsselung)
│   └── src/
│       ├── config/     Konfiguration (env, Datenbank)
│       ├── middleware/ Express-Middleware (z.B. Fehler-Handling)
│       └── routes/     API-Routen
├── db/
│   └── init/           SQL-Skripte für das Datenbankschema
└── docker-compose.yml  PostgreSQL-Datenbank
```

### Setup

**Voraussetzungen:** Node.js (>= 20), Docker.

1. Datenbank starten (PostgreSQL via Docker, Schema wird automatisch angelegt):
   ```
   docker-compose up -d
   ```
2. Backend einrichten und starten:
   ```
   cd backend
   cp .env.example .env
   npm install
   npm run dev
   ```
3. Health-Check prüfen: [http://localhost:3000/api/health](http://localhost:3000/api/health)
   gibt `{"status":"ok","db":"up"}` zurück, wenn alles läuft.
