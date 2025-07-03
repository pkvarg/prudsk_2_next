// components/BackButton.jsx
'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function BackButton() {
  const router = useRouter()

  return (
    <Link
      href="#"
      onClick={(e) => {
        e.preventDefault()
        router.back()
      }}
      className="inline-flex items-center px-4 my-8 py-2 bg-[#2bb2e6] !text-white rounded hover:bg-[#218334] transition-colors duration-200"
    >
      Zpět
    </Link>
  )
}
