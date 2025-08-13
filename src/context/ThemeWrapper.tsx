import React from 'react'
import { ThemeProvider } from './ThemeContext'

export const ThemeWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <ThemeProvider>
        {children}
    </ThemeProvider>
  )
}
