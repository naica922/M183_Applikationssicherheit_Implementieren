# API-Tests – SecurePass

Zurück zur [Projektdokumentation (README.md)](README.md)

Die gesamte API wird manuell mit **Postman** getestet. Die Sammlung
[`SecurePass.postman_collection.json`](SecurePass.postman_collection.json) deckt
alle Endpunkte ab und kann direkt in Postman importiert werden.

## Vorbereitung

1. Datenbank und Backend starten (siehe README, Abschnitt *Setup*).
2. Collection in Postman importieren.
3. Die Requests von oben nach unten ausführen.

Die Collection speichert Tokens automatisch in Collection-Variablen:

- **Login** speichert den `accessToken` und liest den `csrfToken` aus dem Cookie.
- **Vault – Create entry** speichert die `entryId` für die folgenden Requests.

## Abgedeckte Fälle

| # | Request | Erwartet |
| --- | --- | --- |
| 1 | Health | `200`, `{"status":"ok","db":"up"}` |
| 2 | Register | `201`, neuer User |
| 3 | Login | `200`, Access-Token + Refresh-/CSRF-Cookie |
| 4 | Login (falsches Passwort) | `401`, generische Meldung (keine User-Enumeration) |
| 5–7 | 2FA Setup / Enable / Login mit Code | QR-Code, danach Pflicht-Code beim Login |
| 8–11 | Vault CRUD | Create `201`, List/Get/Update `200` |
| 12 | Audit | `200`, eigene Sicherheits-Events |
| 13 | Refresh | `200`, neues Access-Token (alter Refresh-Token invalidiert) |
| 14 | Vault Delete | `204` |
| 15 | Logout | `204`, Cookies gelöscht |

## Sicherheits-Checks (manuell)

- **IDOR:** Mit dem Token von User A eine `entryId` von User B abrufen → `404`.
- **CSRF:** `Refresh` oder `Logout` ohne `X-CSRF-Token`-Header → `403`.
- **Rate Limiting / Lockout:** Login mehrfach mit falschem Passwort → nach
  `MAX_FAILED_ATTEMPTS` ist der Account für `LOCKOUT_MINUTES` gesperrt (`423`).
- **Auth:** Vault-Endpunkte ohne `Authorization`-Header → `401`.
