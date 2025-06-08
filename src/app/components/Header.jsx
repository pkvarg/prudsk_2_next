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

  // if (session) {
  //   console.log('header session', session)
  // }

  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [isAssistantOpen, setIsAssistantOpen] = useState(false)
  const adminDropdownRef = useRef(null)
  const assistantDropdownRef = useRef(null)

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Update your useEffect to handle clicks outside for all dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target)) {
        setIsAdminOpen(false)
      }
      if (assistantDropdownRef.current && !assistantDropdownRef.current.contains(event.target)) {
        setIsAssistantOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const logoutHandler = async () => {
    clearUserState() // Clear Zustand user
    await signOut({ redirect: false }) // Prevent automatic redirect
    window.location.href = '/' // Manually trigger redirect
  }

  return (
    <header>
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
            {/* // Update the admin section */}
            {userInfo && userInfo.isAdmin && !userInfo.isAssistant && (
              <div className="relative" ref={adminDropdownRef}>
                <button
                  onClick={() => setIsAdminOpen((prev) => !prev)}
                  className="text-[#313131] font-normal text-[17px] focus:outline-none ml-9"
                >
                  Admin
                </button>

                {isAdminOpen && (
                  <div className="absolute right-0 bg-white shadow-md mt-1 min-w-[150px] z-10">
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
                      href="/admin/audiolist"
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
                )}
              </div>
            )}
            {/* // Update the assistant section */}
            {userInfo && userInfo.isAssistant && (
              <div className="relative" ref={assistantDropdownRef}>
                <button
                  onClick={() => setIsAssistantOpen((prev) => !prev)}
                  className="text-[#313131] font-normal text-[17px] focus:outline-none ml-9"
                >
                  Asistent
                </button>

                {isAssistantOpen && (
                  <div className="absolute right-0 bg-white shadow-md mt-1 min-w-[150px] z-10">
                    <Link
                      href="/admin/audiolist"
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
                )}
              </div>
            )}
            {/* 
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
            )} */}
          </div>
        </div>
      </div>

      {/* Mobile hamburger menu */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 focus:outline-none"
        >
          {mobileMenuOpen ? (
            <Icon.X className="text-[25px]" />
          ) : (
            <Icon.List className="text-[25px]" />
          )}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-50 pt-4">
          <div className="flex justify-between items-center px-4 pb-4 border-b">
            <h2 className="text-xl font-semibold">Menu</h2>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 focus:outline-none">
              <Icon.X className="text-[25px]" />
            </button>
          </div>

          <div className="p-4">
            <div className="space-y-4">
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-[#313131] text-[17px] font-normal py-2"
              >
                Kontakt
              </Link>

              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-[#313131] text-[17px] font-normal py-2 relative"
              >
                <div className="flex items-center">
                  <Icon.Cart2 className="text-[25px] mr-2" />
                  <span>Košík ({cartItems?.length})</span>
                </div>
              </Link>

              {userInfo ? (
                <div className="space-y-2">
                  <div className="text-[#313131] text-[17px] font-normal py-2">{userInfo.name}</div>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block pl-4 text-[#313131] text-[15px] py-2"
                  >
                    Můj profil
                  </Link>
                  <button
                    onClick={() => {
                      logoutHandler()
                      setMobileMenuOpen(false)
                    }}
                    className="block pl-4 text-[#313131] text-[15px] py-2 w-full text-left"
                  >
                    Odhlásit se
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-[#313131] text-[17px] font-normal py-2"
                >
                  <div className="flex items-center">
                    <Icon.Person className="text-[25px] mr-2" />
                    <span>Přihlášení</span>
                  </div>
                </Link>
              )}

              {userInfo && userInfo.isAdmin && !userInfo.isAssistant && (
                <div className="space-y-2">
                  <div className="text-[#313131] text-[17px] font-normal py-2">Admin</div>
                  <Link
                    href="/admin/userlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block pl-4 text-[#313131] text-[15px] py-2"
                  >
                    Uživatelé
                  </Link>
                  <Link
                    href="/admin/productlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block pl-4 text-[#313131] text-[15px] py-2"
                  >
                    Produkty
                  </Link>
                  <Link
                    href="/admin/orderlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block pl-4 text-[#313131] text-[15px] py-2"
                  >
                    Objednávky
                  </Link>
                  <Link
                    href="/admin/audiolist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block pl-4 text-[#313131] text-[15px] py-2"
                  >
                    Audio
                  </Link>
                  <Link
                    href="/admin/video"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block pl-4 text-[#313131] text-[15px] py-2"
                  >
                    Video
                  </Link>
                  <Link
                    href="/admin/banner"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block pl-4 text-[#313131] text-[15px] py-2"
                  >
                    Bannery
                  </Link>
                  <Link
                    href="/admin/subscribers"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block pl-4 text-[#313131] text-[15px] py-2"
                  >
                    Odběratelé novinek
                  </Link>
                </div>
              )}

              {userInfo && userInfo.isAssistant && (
                <div className="space-y-2">
                  <div className="text-[#313131] text-[17px] font-normal py-2">Asistent</div>
                  <Link
                    href="/admin/audiolist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block pl-4 text-[#313131] text-[15px] py-2"
                  >
                    Audio
                  </Link>
                  <Link
                    href="/admin/video"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block pl-4 text-[#313131] text-[15px] py-2"
                  >
                    Video
                  </Link>
                  <Link
                    href="/admin/banner"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block pl-4 text-[#313131] text-[15px] py-2"
                  >
                    Bannery
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
