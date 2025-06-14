'use client'

import React from 'react'
import Link from 'next/link'

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const steps = [
    { id: 1, name: 'Přihlášení', href: '/login', active: step1 },
    { id: 2, name: 'Doručení', href: '/shipping', active: step2 },
    { id: 3, name: 'Platba', href: '/payment', active: step3 },
    { id: 4, name: 'Objednat', href: '/placeorder', active: step4 },
  ]

  return (
    <nav className="flex justify-center mb-8" aria-label="Checkout progress">
      <ol className="flex items-center space-x-2 md:space-x-4">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1
          const isActive = step.active

          return (
            <li key={step.id} className="flex items-center">
              {/* Step Circle and Content */}
              <div className="flex items-center">
                {isActive ? (
                  <Link
                    href={step.href}
                    className="flex items-center text-[#071e46] hover:text-[#2bb2e6] transition-colors duration-200"
                  >
                    {/* Active Step Circle */}
                    <div className="flex items-center justify-center w-8 h-8 bg-[#2bb2e6] text-white rounded-full text-sm font-medium">
                      {step.id}
                    </div>
                    {/* Active Step Label */}
                    <span className="ml-2 text-sm font-medium hidden sm:inline">{step.name}</span>
                  </Link>
                ) : (
                  <div className="flex items-center text-gray-400 cursor-not-allowed">
                    {/* Disabled Step Circle */}
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-200 text-gray-400 rounded-full text-sm font-medium">
                      {step.id}
                    </div>
                    {/* Disabled Step Label */}
                    <span className="ml-2 text-sm font-medium hidden sm:inline">{step.name}</span>
                  </div>
                )}
              </div>

              {/* Connector Line */}
              {!isLast && <div className="w-8 md:w-16 h-0.5 bg-gray-200 mx-2 md:mx-4"></div>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default CheckoutSteps
