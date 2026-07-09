# Security Report

**Generated:** 2026-07-08T06:22:06.780Z

## Secrets present in build
Status: PASS | Score: 10/10
- PASS: No secrets found in dist

## Dependency vulnerabilities
Status: PASS | Score: 10/10
- PASS: No high/critical vulnerabilities

## CSRF protection (forms)
Status: FAIL | Score: 0/10
- INFO: os\contact\index.html: no visible CSRF token
- INFO: os\demo-booking\index.html: no visible CSRF token
- INFO: os\newsletter\index.html: no visible CSRF token
- FAIL: CSRF tokens missing

## Content Security Policy
Status: PASS | Score: 10/10
- PASS: CSP header configured in nginx.conf

## CORS configuration
Status: PASS | Score: 5/10
- WARN: CORS headers not in nginx.conf
- PARTIAL (50%): should be configured for API backend
