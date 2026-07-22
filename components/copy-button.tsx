"use client"

import { useState, type ComponentProps } from "react"
import { Check, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"

interface CopyButtonProps {
  // `text` is a plain string, safe to pass from Server Components.
  // `getText` is for Client Components that need the latest value at click time.
  text?: string
  getText?: () => string
  label?: string
  variant?: ComponentProps<typeof Button>["variant"]
  size?: ComponentProps<typeof Button>["size"]
}

export function CopyButton({
  text,
  getText,
  label = "Copy component",
  variant = "default",
  size,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const value = getText ? getText() : (text ?? "")
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button onClick={handleCopy} variant={variant} size={size}>
      {copied ? (
        <>
          <Check className="size-4" /> Copied!
        </>
      ) : (
        <>
          <Copy className="size-4" /> {label}
        </>
      )}
    </Button>
  )
}
