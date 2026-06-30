# Build & Deployment Pipeline

## Why

The build system (assemble.mjs, validate.mjs) and deployment configs (netlify.toml, wrangler.toml) are functioning, but the pipeline lacks continuous integration coverage, proper deploy automation, and post-build verification. The existing pipeline-config deploy step is a placeholder. There is no GitHub Actions CI to gate PRs.

## What Changes

- Add GitHub Actions CI workflow for PR validation (build → validate → lint → test)
- Wire the deploy step in build.yaml to actual deploy commands
- Fix event-bus.mjs `emit` binding (const destructure loses `this`)
- Add `deploy:netlify` and `deploy:cloudflare` npm scripts
- Add post-build verification hook output to CI

## Capabilities

### Modified Capabilities
- `build-pipeline`: Add CI/CD requirement, deploy scripts, event-bus fix

## Impact

- New file: `.github/workflows/ci.yml`
- Modified: `orchestrate/event-bus.mjs` — fix emit binding (1 line)
- Modified: `package.json` — add deploy scripts
- Modified: `orchestrate/pipeline-config/build.yaml` — real deploy step
- Modified: `openspec/specs/build-pipeline/spec.md` — add CI/CD requirement
