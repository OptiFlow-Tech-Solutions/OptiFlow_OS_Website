# Design: Build & Deployment Pipeline

## Decisions

### D1: GitHub Actions over other CI platforms
GitHub Actions is free for public repos, has native Node.js support, and requires zero external accounts. No additional dependencies needed.

### D2: Single CI workflow file
One `.github/workflows/ci.yml` covering PR checks (build, validate, lint, test). Avoids multi-file complexity. Add deployment workflow only when actual continuous deployment is needed.

### D3: Deploy scripts as npm run commands
`npm run deploy:netlify` and `npm run deploy:cloudflare` call the respective CLIs. Keep assemble.mjs focused on build, not deploy. Separating deploy from build avoids coupling build logic to deployment targets.

### D4: Event-bus fix — bind emit to bus instance
`const { emit } = bus` destructures the method off its object, losing `this` binding. Fix: export `emit` as a bound function.

### D5: build.yaml deploy step uses npm run deploy
Replace `echo "Deploy ready"` with actual `npm run deploy` command. Pipeline engine invokes the full deploy sequence.
