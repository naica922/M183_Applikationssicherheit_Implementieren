# Wissenssammlung – SecurePass

Zurück zur [Projektdokumentation (README.md)](README.md)

Kurze Erklärungen der wichtigsten Fachbegriffe und Technologien, mit denen ich bisher gearbeitet habe.

## Authentifizierung & Passwörter

| Begriff | Erklärung | Link |
| --- | --- | --- |
| Argon2 / Argon2id | Modernes, "memory-hard" Hashing-Verfahren für Passwörter (Gewinner der Password Hashing Competition 2015). `argon2id` ist die empfohlene Variante und schützt gegen GPU- und Side-Channel-Angriffe. | [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) |
| Passwort-Hashing | Passwörter werden nie im Klartext gespeichert, sondern als nicht umkehrbarer Hash. | [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) |
| Salt | Zufallswert, der vor dem Hashen ans Passwort gehängt wird, damit gleiche Passwörter unterschiedliche Hashes ergeben (Argon2 macht das automatisch). | [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#salting) |

## Session & Tokens

| Begriff | Erklärung | Link |
| --- | --- | --- |
| JWT (JSON Web Token) | Signiertes Token mit Daten (z.B. User-ID), das der Server ohne DB-Abfrage prüfen kann. | [jwt.io](https://jwt.io/introduction) |
| Access Token | Kurzlebiges JWT (bei mir 15 min) für API-Zugriffe. | [Auth0](https://auth0.com/docs/secure/tokens/access-tokens) |
| Refresh Token | Langlebiges, zufälliges Token zum Erneuern des Access Tokens; bei mir nur als Hash in der DB gespeichert. | [Auth0](https://auth0.com/docs/secure/tokens/refresh-tokens) |
| Refresh Token Rotation | Bei jedem Erneuern wird das alte Token ungültig und ein neues ausgegeben → ein Token ist nur einmal nutzbar. | [Auth0](https://auth0.com/docs/secure/tokens/refresh-tokens/refresh-token-rotation) |
| SHA-256 | Kryptografische Hash-Funktion; nutze ich, um Refresh Tokens vor dem Speichern zu hashen. | [Wikipedia](https://de.wikipedia.org/wiki/SHA-2) |

## Web-Sicherheit (Cookies, Header, CORS)

| Begriff | Erklärung | Link |
| --- | --- | --- |
| HttpOnly-Cookie | Cookie, das JavaScript nicht lesen kann → schützt das Token vor Diebstahl per XSS. | [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies) |
| SameSite | Cookie-Attribut, das verhindert, dass das Cookie bei fremden Seiten mitgesendet wird (Schutz gegen CSRF). | [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite) |
| CORS (Cross-Origin Resource Sharing) | Regelt, welche fremden Webseiten meine API aufrufen dürfen. | [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) |
| helmet | Express-Middleware, die sichere HTTP-Header setzt. | [helmetjs](https://helmetjs.github.io/) |
| Rate Limiting | Begrenzt Anfragen pro Zeit/IP → erschwert Brute-Force und DoS. | [express-rate-limit](https://express-rate-limit.mintlify.app/) |

## Datenbank & Injection

| Begriff | Erklärung | Link |
| --- | --- | --- |
| SQL-Injection | Angriff, bei dem über Eingaben fremder SQL-Code eingeschleust wird. | [OWASP](https://owasp.org/www-community/attacks/SQL_Injection) |
| Parametrisierte Queries (Prepared Statements) | Werte werden getrennt vom SQL-Befehl übergeben → verhindert SQL-Injection. | [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) |
| UUID | Zufällige, nicht erratbare ID (statt fortlaufender Zahlen) als Primärschlüssel. | [Wikipedia](https://de.wikipedia.org/wiki/Universally_Unique_Identifier) |

## Logging, Konfiguration & Prozess

| Begriff | Erklärung | Link |
| --- | --- | --- |
| Audit-Log | Protokoll sicherheitsrelevanter Ereignisse (Login, Logout, Fehlversuch) mit Zeit, IP und User-Agent. | [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) |
| User Enumeration | Schwachstelle, bei der man erkennt, ob ein Benutzername existiert; vermeide ich durch eine einheitliche 401-Antwort. | [OWASP](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/03-Identity_Management_Testing/04-Testing_for_Account_Enumeration_and_Guessable_User_Account) |
| Secrets Management / .env | Geheimnisse (DB-Passwort, JWT-Secrets) liegen in einer nicht eingecheckten `.env`-Datei, nicht im Code. | [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) |
| OWASP Top 10 | Liste der häufigsten Web-Sicherheitsrisiken; Leitlinie für mein Projekt. | [owasp.org](https://owasp.org/www-project-top-ten/) |

## Technologien

| Begriff | Erklärung | Link |
| --- | --- | --- |
| Express | Web-Framework für Node.js (Routing, Middleware, REST-API). | [expressjs.com](https://expressjs.com/) |
| REST-API | Schnittstellen-Stil über HTTP-Methoden (GET/POST...) und Statuscodes (z.B. 401, 409). | [MDN](https://developer.mozilla.org/en-US/docs/Glossary/REST) |
| Middleware | Funktionen, die jede Anfrage durchläuft (z.B. helmet, CORS, Fehler-Handling). | [Express](https://expressjs.com/en/guide/using-middleware.html) |
| PostgreSQL | Relationale Datenbank. | [postgresql.org](https://www.postgresql.org/) |
| Docker / docker-compose | Startet die Datenbank reproduzierbar in einem Container. | [docs.docker.com](https://docs.docker.com/compose/) |
