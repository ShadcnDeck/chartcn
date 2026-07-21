"use client"

import { useEffect, useState } from "react"
import { codeToHtml } from "shiki"

interface CodeBlockProps {
  code: string
}

export function CodeBlock({ code }: CodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    codeToHtml(code, { lang: "tsx", theme: "github-dark" }).then((result) => {
      if (!cancelled) setHtml(result)
    })
    return () => {
      cancelled = true
    }
  }, [code])

  if (!html) {
    return (
      <pre className="max-h-[500px] overflow-auto rounded-lg bg-neutral-950 p-4 text-sm text-neutral-100">
        <code>{code}</code>
      </pre>
    )
  }

  return (
    <div
      className="max-h-[500px] overflow-auto rounded-lg text-sm [&_pre]:p-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
