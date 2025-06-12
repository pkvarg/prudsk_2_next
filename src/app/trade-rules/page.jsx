'use client'
import React, { useLayoutEffect } from 'react'

const TradeRules = () => {
  useLayoutEffect(() => {
    window.scrollTo(0, 200)
  })

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-3 md:px-0">
        <div className="my-3 py-8">
          <h1 className="text-[#071e46] font-bold text-2xl md:text-3xl mb-6">Obchodní podmínky</h1>
        </div>
      </div>
    </div>
  )
}

export default TradeRules
