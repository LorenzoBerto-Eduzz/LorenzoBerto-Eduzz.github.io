# Project Instructions

Before committing or pushing in this repo, verify the Git identity guard:

```powershell
Get-Content .git-identity
git config user.email
git config core.hooksPath
```

Contributor protection is email-based. The local Git email must match `.git-identity` exactly. `user.name` may vary by device and is not checked. If the email does not match, stop and fix or ask before committing or pushing.

Current required email:

```text
GIT_ALLOWED_EMAIL="lorenzo.berto@eduzz.com"
```

Required local configuration:

```powershell
git config user.email "lorenzo.berto@eduzz.com"
git config core.hooksPath .githooks
```

On every other clone or computer, after pulling this repo, run once:

```powershell
git config core.hooksPath .githooks
```

The hooks block commits and pushes when the configured Git email differs from `.git-identity`.
