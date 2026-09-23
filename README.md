# renovate-config

The shared [Renovate](https://docs.renovatebot.com/) preset for the PostGuard fleet. Each repo's
`renovate.json` extends it with:

```json
{ "extends": ["github>encryption4all/renovate-config"] }
```

The preset is `default.json`. Why each rule exists is recorded in
[encryption4all/postguard#254](https://github.com/encryption4all/postguard/issues/254), and every
`packageRules` entry carries a one-line `description`, since JSON has no comments.

This repo is public on purpose: `privacybydesign/postguard-ops` extends it across orgs.
