'use client'

import { ReactNode, createContext, useContext } from 'react'
import { twMerge } from 'tailwind-merge'
import tokens from './tokens.json'
import type { ThemeTokens } from './types'
import '../../app/globals.css'

const ThemeContext = createContext<ThemeTokens>(tokens)

export function ThemeProvider({ children }: { children: ReactNode }) {
    return (
        <ThemeContext.Provider value={tokens}>
            <div data-theme="light" className={twMerge('min-h-screen')}>
                {children}
            </div>
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}