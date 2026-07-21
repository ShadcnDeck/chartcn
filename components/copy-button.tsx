"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"

interface CopyButtonProps {
  getText: () => string
}

export function CopyButton({ getText }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(getText())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button onClick={handleCopy} variant="default">
      {copied ? (
        <>
          <Check className="size-4" /> Copied!
        </>
      ) : (
        <>
          <Copy className="size-4" /> Copy component
        </>
      )}
    </Button>
  )
}
