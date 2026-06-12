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
Mein Projekt SecurePass ist eine web basierte Passwort Manager-Applikation, bei der Benutzer ihre Zugangsdaten (Website, Benutzername, Passwort) sicher verschlüsselt speichern können.

Folgendes sind meine Schwerpunkte für das Projekt:
**1. Authentifizierung & Session-Management**
- Sicheres Passwort Hashing mit Argon2
- JWT mit Refresh Token Rotation
- TOTP-basierte Zwei-Faktor-Authentifizierung

Zusatzätzliche:
- Rate Limiting
- Account Lockout nach fehlgeschlagenen Versuchen

**2. Verschlüsselung & Datenschutz**
- AES-256-GCM für alle Vault-Einträge
- PBKDF2-Schlüsselableitung aus dem Master-Passwort
- HTTPS only und keine Secrets in Logs oder URLs

**Zusätzliche Ziele**
- Audit-Log für alle sicherheitsrelevanten Ereignisse
- sichere HTTP-Header mit helmet.js
- automatische Dependency-Überprüfung per npm audit in der CI-Pipeline
- gutes Secrets-Management über .env.


### Projektstruktur

### Setup
