# /deploy
Deploy the website to production.

## Pipeline
1. Run pre-build validation: node hooks/pre-build.mjs
2. Build: npm run build
3. Validate: npm run validate (must pass with 0 errors)
4. Deploy to Cloudflare Pages or Netlify
5. Run canary smoke test on deployed URL
6. Report deployment status + URL

## Agent
Uses deployment-patterns skill for guidance, canary-watch for verification.
