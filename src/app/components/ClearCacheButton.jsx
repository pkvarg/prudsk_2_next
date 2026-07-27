'use client'
import React from 'react'

export const clearCacheHandler = async () => {
  try {
    const response = await fetch('/api/cache/invalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (response.ok) {
      alert(
        'Cache bola úspešne aktualizovaná! Ak sa niektorá časť webu neaktualizovala, podržte Shift a kliknite na refresh.',
      )
    } else {
      alert('Nepodarilo sa aktualizovať cache: ' + data.error)
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Chyba pri aktualizácii cache')
  }
}

export const ClearCacheButton = () => {
  return (
    <button
      className="py-2 px-3 sm:px-4 bg-[#f4f019] hover:bg-orange-400 text-black rounded flex items-center justify-center gap-1 text-sm sm:text-base"
      onClick={clearCacheHandler}
    >
      Vymazať Cache
    </button>
  )
}
