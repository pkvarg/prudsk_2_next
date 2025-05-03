// src/app/components/Header.jsx
'use client'
import React, { useState, useRef, useEffect } from 'react'
import SearchBox from './SearchBox'
import { signOut } from 'next-auth/react'
import useUserStore from '../../store/userStore'
import useCartStore from '../../store/cartStore'
import * as Icon from 'react-bootstrap-icons'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

const Header = () => {
  // Get state and actions directly from Zustand stores
  const { data: session, status } = useSession()
  const { userInfo, setUserInfo, clearUserState } = useUserStore()
  const { cartItems } = useCartStore()

  if (session) {
    console.log('header session', session)
  }

  //console.log('userInfo header', userInfo)

  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Sync Zustand with NextAuth session
  // useEffect(() => {
  //   if (!session && userInfo) {
  //     // User just signed out
  //     clearUserState()
  //   } else if (session?.user && !userInfo) {
  //     // User signed in
  //     setUserInfo({
  //       name: session.user.name,
  //       email: session.user.email,
  //       isAdmin: false,
  //       isAssistant: false,
  //     })
  //   }
  // }, [session, userInfo, clearUserState, setUserInfo])

  const logoutHandler = async () => {
    clearUserState() // Clear Zustand user
    await signOut({ redirect: false }) // Prevent automatic redirect
    window.location.href = '/' // Manually trigger redirect
  }

  return (
    <header>
      {/* Rest of your component... */}
      {/* Grey navbar (desktop only) */}
      <div className="hidden lg:block bg-gray-100 border border-gray-300 h-8">
        {/* Component content... */}
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <Link
              href="/contact"
              className="text-[#313131] text-[17px] font-normal cursor-pointer no-underline"
            >
              <p className="m-0 hover:text-[#24b9d6]">Kontakt</p>
            </Link>
          </div>
          <div className="flex items-center">
            <Link href="/cart" className="text-[#313131] mr-9 relative">
              <div>
                <p className="absolute -right-[7px] -top-[1px] inline-block rounded-full w-5 h-[17.5px] leading-[19px] bg-red-500 text-white">
                  <span className="text-md ml-[25%] ">{cartItems?.length}</span>
                </p>
                <Icon.Cart2 className="text-[25px] font-thin mb-[7.5px]">Košík</Icon.Cart2>
              </div>
            </Link>

            {userInfo ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsOpen((prev) => !prev)}
                  className="text-[#313131] font-normal text-[17px] focus:outline-none"
                >
                  {userInfo.name}
                </button>

                {isOpen && (
                  <div className="absolute right-0 bg-white shadow-md mt-1 min-w-[150px] z-10">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white"
                    >
                      Můj profil
                    </Link>
                    <button
                      onClick={logoutHandler}
                      className="w-full text-left px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white"
                    >
                      Odhlásit se
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="text-[#313131] font-normal">
                <div className="flex items-center">
                  <Icon.Person className="text-[25px] mr-1" />
                  <span>Přihlášení</span>
                </div>
              </Link>
            )}

            {userInfo && userInfo.isAdmin && !userInfo.isAssistant && (
              <div className="relative group ml-9">
                <button className="text-[#313131] font-normal text-[17px] focus:outline-none">
                  Admin
                </button>
                <div className="hidden group-hover:block absolute right-0 bg-white shadow-md mt-1 min-w-[150px] z-10">
                  <Link
                    href="/admin/userlist"
                    className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px]"
                  >
                    Uživatelé
                  </Link>
                  <Link
                    href="/admin/productlist"
                    className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px]"
                  >
                    Produkty
                  </Link>
                  <Link
                    href="/admin/orderlist"
                    className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px]"
                  >
                    Objednávky
                  </Link>
                  <Link
                    href="/admin/audio"
                    className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px]"
                  >
                    Audio
                  </Link>
                  <Link
                    href="/admin/video"
                    className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px]"
                  >
                    Video
                  </Link>
                  <Link
                    href="/admin/banner"
                    className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px]"
                  >
                    Bannery
                  </Link>
                  <Link
                    href="/admin/subscribers"
                    className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px]"
                  >
                    Odběratelé novinek
                  </Link>
                </div>
              </div>
            )}

            {userInfo && userInfo.isAssistant && (
              <div className="relative group ml-9">
                <button className="text-[#313131] font-normal text-[17px] focus:outline-none">
                  Asistent
                </button>
                <div className="hidden group-hover:block absolute right-0 bg-white shadow-md mt-1 min-w-[150px] z-10">
                  <Link
                    href="/admin/audio"
                    className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px]"
                  >
                    Audio
                  </Link>
                  <Link
                    href="/admin/video"
                    className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px]"
                  >
                    Video
                  </Link>
                  <Link
                    href="/admin/banner"
                    className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px]"
                  >
                    Bannery
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rest of your component... */}
    </header>
  )
}

export default Header
