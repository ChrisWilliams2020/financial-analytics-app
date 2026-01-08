import React from 'react'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>MedPact Financial Analytics - Voice-First Market Intelligence</title>
        <meta name="description" content="Revolutionary voice-first financial analytics platform integrating market data, SEC filings, payer transparency, and clinical outcomes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  )
}
