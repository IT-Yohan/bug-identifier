# 1. Internationalization Strategy

## Status
Accepted

## Context
The application currently supports English/French with next-intl but has:
- Incomplete translation coverage
- No error message localization
- Hardcoded UI text in components

## Decision
Implement enterprise-grade i18n with:

1. Advanced text handling:
   - RTL/LTR detection and styling
   - CLDR pluralization rules
   - Gender-aware translations
   
2. Performance optimizations:
   - CDN-hosted locale bundles
   - Tree-shakable translation modules
   - Brotli compression for locale files

3. Translation infrastructure:
   - Translation Memory (TMX 1.4b)
   - Machine translation fallback (DeepL API)
   - Pseudolocalization testing
   - In-context editing (CMS integration)

4. Quality assurance:
   - Lingui eslint rules
   - Translation coverage reports
   - Glossary term enforcement

## Consequences
- RTL support requires CSS logical properties
- TM system needs 90% match threshold
- CDN caching adds deployment complexity
- Machine translation requires API key management