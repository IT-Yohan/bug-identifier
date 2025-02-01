# 4. Component-Based Styling System

## Status
Accepted

## Context
Current styling implementation has:
- Inconsistent component variants
- No design token management
- Mix of CSS-in-JS and global styles
- Missing dark mode implementation

## Decision
Implement atomic design system with:

1. Token architecture:
   - Core tokens (colors, spacing, typography)
   - Semantic tokens (theme-aware variables)
   - Component tokens (component-specific overrides)
   
2. Theme management:
   - ThemeProvider with React context
   - TypeScript type generation from token JSON
   - Figma sync via style dictionary

3. Performance:
   - Lightning CSS for minification
   - Critical CSS extraction for SSR
   - 50kb CSS budget per route

4. Accessibility:
   - Axe-core integration in Storybook
   - Forced color mode compliance
   - Reduced motion variants

5. Development:
   - CSS Modules with :where() selectivity
   - Dev-only style inspector
   - Visual regression testing

## Consequences
- Token changes require design system versioning
- Theming system adds runtime client-side JS
- CSS compression requires Node 18+
- Strict token types enable compile-time checks