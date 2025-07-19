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
        'Cache byl úspěšně aktualizován! Pokud se některá část webu neaktualizovala, podržte Shift a klikněte na refresh.',
      )
    } else {
      alert('Failed to refresh cache: ' + data.error)
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Error refreshing cache')
  }
}

export const ClearCacheButton = () => {
  return (
    <button
      className="py-2 px-4 bg-[#f4f019] hover:bg-orange-400 text-black rounded flex items-center gap-1"
      onClick={clearCacheHandler}
    >
      Clear Cache
    </button>
  )
}
