# 1. Internationalization Strategy

## Status
Accepted (Simplified for POC)

## Context
The application supports English/French with next-intl.

## Decision
Implement a simplified i18n approach appropriate for a POC:

1. Basic multilingual support:
   - Support for English and French
   - JSON-based translation files
   - Simple message formatting

2. Straightforward routing:
   - Locale prefix in URL
   - Default locale fallback

## Consequences
- Simplified translation management
- Reduced complexity in language handling
- Appropriate for POC but would need extension for production