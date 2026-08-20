"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { flushSync } from "react-dom"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // Reads the class the blocking init script in layout.tsx already applied,
    // so this only ever runs once to sync state after hydration (avoids SSR mismatch).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    setIsDark(document.documentElement.classList.contains("dark"))
  }, [])

  const toggle = useCallback(async () => {
    const next = !isDark

    const applyTheme = () => {
      setIsDark(next)
      document.documentElement.classList.toggle("dark", next)
      localStorage.setItem("theme", next ? "dark" : "light")
    }

    // Same view-transition circle-reveal effect as shadcndeck-landing's toggle,
    // adapted to this repo's plain class + localStorage theming (no next-themes here).
    if (!buttonRef.current || !document.startViewTransition) {
      applyTheme()
      return
    }

    const { top, left, width, height } = buttonRef.current.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const maxRadius = Math.hypot(Math.max(left, window.innerWidth - left), Math.max(top, window.innerHeight - top))

    const transition = document.startViewTransition(() => {
      flushSync(applyTheme)
    })

    await transition.ready

    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`] },
      { duration: 400, easing: "ease-out", pseudoElement: "::view-transition-new(root)" }
    )
  }, [isDark])

  return (
    <Button
      variant="outline"
      size="icon"
      ref={buttonRef}
      onClick={toggle}
      aria-label="Toggle theme"
      className={mounted ? "" : "opacity-0"}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
}
