declare module '@/theme/types' {
  export interface ThemeTokens {
    colors: {
      primary: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900, string>
      surface: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900, string>
    }
    spacing: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', string>
    radius: Record<'sm' | 'md' | 'lg', string>
  }
  
  const tokens: ThemeTokens;
  export default tokens;
}