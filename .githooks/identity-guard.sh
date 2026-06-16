#!/bin/sh

EXPECTED_EMAIL="lorenzo.berto@eduzz.com"
EXPECTED_GITHUB_ACCOUNT="LorenzoBerto-Eduzz"

current_email="$(git config user.email)"

if [ "$current_email" != "$EXPECTED_EMAIL" ]; then
  echo "Blocked: Git user.email is '$current_email', expected '$EXPECTED_EMAIL'."
  echo "Fix with: git config user.email \"$EXPECTED_EMAIL\""
  exit 1
fi

author_ident="$(git var GIT_AUTHOR_IDENT 2>/dev/null || true)"
committer_ident="$(git var GIT_COMMITTER_IDENT 2>/dev/null || true)"

case "$author_ident" in
  *"<$EXPECTED_EMAIL>"*) ;;
  *)
    echo "Blocked: Git author identity must use '$EXPECTED_EMAIL'."
    echo "Current author: $author_ident"
    exit 1
    ;;
esac

case "$committer_ident" in
  *"<$EXPECTED_EMAIL>"*) ;;
  *)
    echo "Blocked: Git committer identity must use '$EXPECTED_EMAIL'."
    echo "Current committer: $committer_ident"
    exit 1
    ;;
esac

if command -v gh >/dev/null 2>&1; then
  if ! gh auth status 2>&1 | grep -q "account $EXPECTED_GITHUB_ACCOUNT"; then
    echo "Blocked: GitHub CLI is not authenticated as '$EXPECTED_GITHUB_ACCOUNT'."
    echo "Fix with: gh auth login"
    exit 1
  fi
fi

exit 0
