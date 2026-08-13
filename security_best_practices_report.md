# New Media Website Security Review

Date: 2026-08-13
Scope: public website, project application form and uploads, employee authentication/session, employee API, team chat uploads, and static delivery headers.

## Executive summary

The employee passwords are not stored or compared as plaintext. They are verified server-side with PBKDF2-SHA-256, a unique salt, a server-held pepper, at least 100,000 iterations, and a constant-time comparison. Session cookies are signed and configured `HttpOnly`, `Secure`, and `SameSite=Strict`.

This review also closed the material authorization, upload-validation, cross-site-request, and response-header gaps identified in the current code. No critical unresolved vulnerability was found in the reviewed scope. Two defense-in-depth items remain documented below because removing them safely requires a broader front-end migration, not a quick security patch.

## Resolved findings

### [High] Sensitive employee actions did not consistently enforce roles on the server — resolved

- Affected area: employee API authorization.
- Risk: hiding a control in the UI is not authorization; an authenticated lower-role user could have called a sensitive endpoint directly.
- Resolution: server-side role checks now protect application updates/deletion, client creation/deletion, task deletion, lead-category assignment, lead deletion, and lead-to-client conversion. Application deletion is restricted to `super_admin`; other sensitive mutations require at least `manager`.
- Evidence: `worker/index.js:329-390`, with the centralized role ordering at `worker/index.js:1180-1189`.

### [Medium] Uploaded file extensions and MIME labels could be spoofed — resolved

- Affected area: public project application attachments and employee chat PDFs.
- Risk: a renamed executable or malformed file could be stored as an allowed document type.
- Resolution: uploads now have count and byte limits and are checked against their actual file signatures before object storage. Chat uploads accept PDF signatures only.
- Evidence: `worker/index.js:612-620`, `worker/index.js:803-806`, and signature validation at `worker/index.js:1217-1227`.

### [Medium] Security response headers were not guaranteed on every static page — resolved

- Affected area: public HTML, employee HTML, static assets, and the 404 response.
- Risk: weaker protection against framing, content-type confusion, unnecessary browser capabilities, and script/resource injection.
- Resolution: all Worker-served HTML/static responses now pass through one security-header layer. It applies a restrictive Content Security Policy, frame denial, MIME sniffing protection, referrer policy, permissions policy, and cross-origin isolation/resource policies. Existing inline scripts are allowlisted individually by SHA-256 content hash rather than permitting arbitrary inline JavaScript.
- Evidence: `worker/index.js:285-295`, `worker/index.js:1124-1127`, and `worker/index.js:1192-1214`.

### [Medium] Cross-site mutation checks needed additional browser context — resolved

- Affected area: login, public application submission, and authenticated mutation endpoints.
- Risk: a malicious cross-site page could attempt to submit a state-changing request with the victim's browser.
- Resolution: origin validation now also rejects cross-site `Sec-Fetch-Site` contexts. Auth cookies additionally use `SameSite=Strict`.
- Evidence: `worker/index.js:303-390`, `worker/index.js:557-558`, `worker/index.js:1159-1164`, and cookie construction at `worker/index.js:1325-1330`.

## Verified controls

### Employee credentials and login

- Authentication configuration and the password pepper are required server-side; login fails closed if either is absent (`worker/index.js:449-452`).
- Account lookup uses a dummy/comparison account path to reduce obvious username-enumeration timing differences (`worker/index.js:473-489`).
- Failed login attempts are keyed by a hash of username and source IP and lock for 15 minutes after repeated failures (`worker/index.js:462-492`).
- Password verification uses PBKDF2-SHA-256, a per-account salt, a server-held pepper, 100,000 iterations, and constant-time comparison (`worker/index.js:1230-1244`, `worker/index.js:1297-1301`).
- Usernames are identifiers and do not need reversible encryption. They are validated and normalized; passwords themselves are never returned to the browser.

### Sessions and protected data

- Sessions are signed with HMAC-SHA-256, expire after 12 hours, and are rejected if the account no longer exists (`worker/index.js:1247-1277`).
- Cookies use `HttpOnly; Secure; SameSite=Strict` (`worker/index.js:1325-1330`).
- Application and chat file download routes are behind employee-session validation and return downloads with `no-store` and `nosniff` (`worker/index.js:308-327`, `worker/index.js:720-732`, `worker/index.js:844-858`).
- Database operations use prepared D1 statements and bound parameters throughout the reviewed API.
- Public form abuse is constrained with a honeypot, minimum completion time, request-size limit, and source-IP cooldown (`worker/index.js:562-569`, `worker/index.js:622-627`).

## Remaining defense-in-depth items

### [Medium] CSP still permits inline CSS — open, migration required

- Location: `worker/index.js:1201` and legacy inline `<style>` blocks in several HTML pages.
- Current protection: scripts are restricted to same-origin files plus exact SHA-256 hashes for the site's existing inline scripts. Arbitrary inline JavaScript is blocked. Framing, objects, foreign connections, and foreign images are blocked.
- Remaining concern: `style-src` contains `'unsafe-inline'` because the current site still relies on legacy inline styles and dynamically assigned style properties.
- Recommended next step: migrate inline page styles into versioned same-origin stylesheets, then remove `'unsafe-inline'` from `style-src`. This is a hardening task, not evidence of an active compromise.

### [Low] Google Fonts remains a third-party runtime dependency — open

- Location: page font imports and the `fonts.googleapis.com` / `fonts.gstatic.com` CSP allowlist at `worker/index.js:1201`.
- Concern: availability and supply-chain exposure are slightly higher than for self-hosted font files.
- Recommended next step: self-host the licensed Alexandria font files and reduce the CSP font/style allowlist to `'self'`.

## Operational recommendations

1. Rotate `EMPLOYEE_SESSION_SECRET` and `EMPLOYEE_PASSWORD_PEPPER` on a controlled schedule and immediately after any suspected credential exposure.
2. Use unique employee passwords from a password manager; never share one account between employees.
3. Add MFA through a managed identity provider before granting the employee workspace to a larger team or exposing higher-value customer data.
4. Keep the Worker runtime and dependencies updated, and repeat this review after adding a payment flow, third-party analytics, or new upload types.
5. Security is a continuing process: no review can promise that a public site will never be attacked, but the material issues found in this code path are now closed and the remaining hardening work is explicitly tracked.
