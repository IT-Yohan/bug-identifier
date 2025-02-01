# 3. Legal Pages Implementation

## Status
Accepted

## Context
Production requirements mandate:
- Terms of Service page
- Privacy Policy page
- Cookie Policy page
Missing from current implementation

## Decision
Implement legal pages with:
1. Secure content management:
   - Markdown stored in protected /content/legal directory
   - Served through authenticated API routes
2. Version control system:
   - legal-versions.json tracking effective dates
   - Semantic versioning (major.minor.patch)
3. Automated PDF generation:
   - Serverless function using Puppeteer
   - Cached PDFs updated on content changes
4. i18n integrity checks:
   - Content hash verification across locales
   - Missing translation alerts
5. Audit trail:
   - Change logging to dedicated database table
   - Admin interface for version rollbacks

## Consequences
- Requires legal content review process
- Adds content update deployment dependency
- Increases translation management overhead