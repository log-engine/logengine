"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { Github, Moon, Sun, Terminal } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function Navbar() {
  const { theme, setTheme } = useTheme()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
          <Terminal className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
          <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">LogEngine</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9 hover:bg-primary/10 hover:text-primary"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary" asChild>
            <Link href="https://github.com/log-engine/logengine/blob/main/QUICKSTART.md" target="_blank">
              Docs
            </Link>
          </Button>

          <Button variant="outline" className="border-primary/30 hover:border-primary hover:bg-primary/5" asChild>
            <Link href="https://github.com/log-engine/logengine" target="_blank">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Link>
          </Button>

          <Button asChild className="hidden sm:inline-flex bg-primary hover:bg-primary/90">
            <Link href="#pricing">
              Get Started
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
