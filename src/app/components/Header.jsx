// src/app/components/Header.jsx
'use client'
import React, { useState, useRef, useEffect } from 'react'
import SearchBox from './SearchBox'
import MobileSearchBox from './MobileSearchBox'
import { signOut } from 'next-auth/react'
import useUserStore from '../../store/userStore'
import useCartStore from '../../store/cartStore'
import * as Icon from 'react-bootstrap-icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Header = () => {
  // Get state and actions directly from Zustand stores
  //const { data: session, status } = useSession()
  const { userInfo, clearUserState } = useUserStore()
  const { cartItems } = useCartStore()

  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [isAssistantOpen, setIsAssistantOpen] = useState(false)
  const adminDropdownRef = useRef(null)
  const assistantDropdownRef = useRef(null)

  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const pathname = usePathname()
  const isHomePage = pathname === '/'

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

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
  }

  const toggleIsMenuOpen = () => {
    setIsMenuOpen(!isMenuOpen)
    setActiveDropdown(null)
  }

  const closeAllDropdowns = () => {
    setActiveDropdown(null)
    setIsMenuOpen(false)
  }

  const closeUserDropdown = () => {
    setActiveDropdown(null)
    setIsMenuOpen(false)
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
              className="!text-[#313131] text-[17px] font-normal cursor-pointer no-underline"
            >
              <p className="m-0 hover:text-[#24b9d6]">Kontakt</p>
            </Link>
          </div>
          <div className="flex items-center">
            <Link href="/cart" className="text-[#313131] mr-9 relative">
              <div>
                <p className="absolute -right-[7px] -top-[0.5px] inline-block rounded-full w-5 h-[17.5px] leading-[19px] bg-red-500 text-white">
                  <span className="text-md ml-[30%] ">{cartItems?.length}</span>
                </p>
                <Icon.Cart2 className="text-[27.5px] text-black font-thin mb-[0px]">
                  Košík
                </Icon.Cart2>
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
                      href="/admin/videolist"
                      className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px]"
                    >
                      Video
                    </Link>
                    <Link
                      href="/admin/bannerlist"
                      className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px]"
                    >
                      Bannery
                    </Link>
                    <Link
                      href="/admin/subscriberslist"
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
                      href="/admin/videolist"
                      className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px]"
                    >
                      Video
                    </Link>
                    <Link
                      href="/admin/bannerlist"
                      className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px]"
                    >
                      Bannery
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Header with Logo - desktop only */}
      <div className="hidden lg:block bg-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/" className="no-underline">
                <img src="/images/wwwproudbanner.png" className="h-16" alt="prud-zivota" />
              </Link>
              <h3 className="text-[#A07C54] italic text-lg mt-2">
                Přinášet bohatství Božího slova všemu Božímu lidu
              </h3>
            </div>
            <div>
              <SearchBox />
            </div>
          </div>
        </div>
      </div>
      <nav className="bg-red-700 lg:bg-red-700 flex justify-center items-center">
        <div className="mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Mobile menu button and mobile header items */}
            <div className="lg:hidden flex items-center space-x-4 py-3">
              {/* Mobile user */}
              {userInfo ? (
                <div
                  className="relative flex flex-row gap-4 text-white"
                  onClick={() => toggleDropdown('mobile-user')}
                >
                  <p>{userInfo.name}</p>
                  <button className=" flex items-center">
                    <Icon.Person className="h-5 w-5" />
                  </button>
                  {activeDropdown === 'mobile-user' && (
                    <div className="absolute left-0 mt-10 w-48 bg-white rounded-md shadow-lg z-50 border">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                        onClick={closeUserDropdown}
                      >
                        Můj profil
                      </Link>
                      <button
                        onClick={logoutHandler}
                        className="w-full text-left px-4 py-2 !text-[#352106] hover:bg-gray-50"
                      >
                        Odhlásit se
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="!text-white">
                  <Icon.Person className="h-5 w-5" />
                </Link>
              )}

              {/* Mobile cart */}
              <Link
                href="/cart"
                className="text-white relative"
                // onClick={closeAllDropdowns}
              >
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-700 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartItems.length}
                  </span>
                )}
                <Icon.Cart className="h-5 w-5 !text-white" />
              </Link>

              {/* Mobile favorites */}
              <Link href="/favorites" className="!text-white">
                <Icon.HeartFill className="h-5 w-5" />
              </Link>
            </div>

            {/* Red Mobile menu button */}
            <button
              //onClick={() => setIsMenuOpen(!isMenuOpen)}
              onClick={toggleIsMenuOpen}
              className="lg:hidden text-white p-2"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`block h-0.5 w-6 bg-white transform transition-transform ${
                    isMenuOpen ? 'rotate-45 translate-y-1' : ''
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-6 bg-white mt-1 transition-opacity ${
                    isMenuOpen ? 'opacity-0' : ''
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-6 bg-white mt-1 transform transition-transform ${
                    isMenuOpen ? '-rotate-45 -translate-y-1 !mt-0' : ''
                  }`}
                ></span>
              </div>
            </button>

            {/* Desktop navigation */}
            <div className="hidden lg:flex items-center space-x-6 py-4">
              {/* Novinky */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('news')}
                  className="text-white hover:text-gray-200 transition-colors flex items-center"
                >
                  Novinky
                  <Icon.ChevronDown className="h-4 w-4 ml-1" />
                </button>
                {activeDropdown === 'news' && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg z-50 border">
                    <Link
                      href="/new-books/2025"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Knihy 2025
                    </Link>
                  </div>
                )}
              </div>

              {/* Podcast */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('podcast')}
                  className="text-white hover:text-gray-200 transition-colors flex items-center"
                >
                  Podcast
                  <Icon.ChevronDown className="h-4 w-4 ml-1" />
                </button>
                {activeDropdown === 'podcast' && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg z-50 border">
                    <Link
                      href="/words-of-life"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Slova života
                    </Link>
                    <Link
                      href="/life-study"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Studium života
                    </Link>
                  </div>
                )}
              </div>

              {/* Video */}
              <Link href="/video" className="!text-white hover:text-gray-200 transition-colors">
                Video
              </Link>

              {/* E-shop */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('eshop')}
                  className="text-white hover:text-gray-200 transition-colors flex items-center"
                >
                  E-shop
                  <Icon.ChevronDown className="h-4 w-4 ml-1" />
                </button>
                {activeDropdown === 'eshop' && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white shadow-lg z-50 border max-h-96 overflow-y-auto">
                    <Link
                      href="/eshop/abecední-seznam-kníh"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Abecední seznam knih
                    </Link>
                    <Link
                      href="/eshop/Boží-ekonomie"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Boží ekonomie
                    </Link>
                    <Link
                      href="/eshop/brožury"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Brožury
                    </Link>
                    <Link
                      href="/eshop/církev"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Církev
                    </Link>
                    <Link
                      href="/eshop/duch"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Duch
                    </Link>
                    <Link
                      href="/eshop/evangelium"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Evangelium
                    </Link>
                    <Link
                      href="/eshop/kristus"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Kristus
                    </Link>
                    <Link
                      href="/eshop/křesťanská-praxe"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Křesťanská praxe
                    </Link>
                    <Link
                      href="/eshop/křesťanská-služba"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Křesťanská služba
                    </Link>
                    <Link
                      href="/eshop/letáky"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Letáky
                    </Link>
                    <Link
                      href="/eshop/mládež"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Mládež
                    </Link>
                    <Link
                      href="/eshop/studium-a-výklad-bible"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Studium a výklad Bible
                    </Link>
                    <Link
                      href="/eshop/Trojjediný-Bůh"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Trojjediný Bůh
                    </Link>
                    <Link
                      href="/eshop/život"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Život
                    </Link>
                    <Link
                      href="/eshop/životopisné"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Životopisné
                    </Link>
                  </div>
                )}
              </div>

              {/* Čítárna */}
              <Link href="/library" className="!text-white hover:text-gray-200 transition-colors">
                Čítárna
              </Link>

              {/* Info */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('info')}
                  className="text-white hover:text-gray-200 transition-colors flex items-center"
                >
                  Info
                  <Icon.ChevronDown className="h-4 w-4 ml-1" />
                </button>
                {activeDropdown === 'info' && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg z-50 border">
                    <Link
                      href="/watchman-nee"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Watchman Nee
                    </Link>
                    <Link
                      href="/witness-lee"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Witness Lee
                    </Link>
                    <Link
                      href="/about"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-50"
                      onClick={closeAllDropdowns}
                    >
                      O nás
                    </Link>
                    <Link
                      href="/safety-privacy"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Bezpečnost a soukromí
                    </Link>
                  </div>
                )}
              </div>

              {/* Kontakt */}
              <Link href="/contact" className="!text-white hover:text-gray-200 transition-colors">
                Kontakt
              </Link>

              {/* Favorites - desktop */}
              <Link href="/favorites" className="!text-white hover:text-gray-200 transition-colors">
                <Icon.HeartFill className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="lg:hidden bg-red-700 pb-4">
              <div className="space-y-2">
                {/* Mobile navigation items */}
                <div className="border-t border-red-600 pt-2 ">
                  <button
                    onClick={() => toggleDropdown('mobile-news')}
                    className="w-full text-left px-4 py-2 text-white flex justify-between items-center"
                  >
                    Novinky
                    <Icon.ChevronDown className="h-4 w-4" />
                  </button>
                  {activeDropdown === 'mobile-news' && (
                    <div className="px-8 py-2">
                      <Link
                        href="/new-books/2025"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        Knihy 2025
                      </Link>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    onClick={() => toggleDropdown('mobile-podcast')}
                    className="w-full text-left px-4 py-2 text-white flex justify-between items-center"
                  >
                    Podcast
                    <Icon.ChevronDown className="h-4 w-4" />
                  </button>
                  {activeDropdown === 'mobile-podcast' && (
                    <div className="px-8 py-2 space-y-1">
                      <Link
                        href="/words-of-life"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        Slova života
                      </Link>
                      <Link
                        href="/life-study"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        Studium života
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  href="/video"
                  className="block px-4 py-2 !text-white"
                  onClick={closeAllDropdowns}
                >
                  Video
                </Link>

                <div>
                  <button
                    onClick={() => toggleDropdown('mobile-eshop')}
                    className="w-full text-left px-4 py-2 text-white flex justify-between items-center"
                  >
                    E-shop
                    <Icon.ChevronDown className="h-4 w-4" />
                  </button>
                  {activeDropdown === 'mobile-eshop' && (
                    <div className="px-8 py-2 space-y-1 max-h-64 overflow-y-auto">
                      <Link
                        href="/eshop/abecední-seznam-kníh"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        Abecední seznam knih
                      </Link>
                      <Link
                        href="/eshop/Boží-ekonomie"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        Boží ekonomie
                      </Link>
                      <Link href="/eshop/brožury" className="block py-1 !text-white text-sm">
                        Brožury
                      </Link>
                      <Link
                        href="/eshop/církev"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        Církev
                      </Link>
                      <Link
                        href="/eshop/duch"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        Duch
                      </Link>
                      <Link
                        href="/eshop/evangelium"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        Evangelium
                      </Link>
                      <Link
                        href="/eshop/kristus"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        Kristus
                      </Link>
                      <Link
                        href="/eshop/křesťanská-praxe"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        Křesťanská praxe
                      </Link>
                      <Link
                        href="/eshop/křesťanská-služba"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        Křesťanská služba
                      </Link>
                      <Link
                        href="/eshop/letáky"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        Letáky
                      </Link>
                      <Link
                        href="/eshop/mládež"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        Mládež
                      </Link>
                      <Link
                        href="/eshop/studium-a-výklad-bible"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        Studium a výklad Bible
                      </Link>
                      <Link
                        href="/eshop/Trojjediný-Bůh"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        Trojjediný Bůh
                      </Link>
                      <Link
                        href="/eshop/život"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        Život
                      </Link>
                      <Link
                        href="/eshop/životopisné"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        Životopisné
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  href="/library"
                  className="block px-4 py-2 !text-white"
                  onClick={closeAllDropdowns}
                >
                  Čítárna
                </Link>

                <div>
                  <button
                    onClick={() => toggleDropdown('mobile-info')}
                    className="w-full text-left px-4 py-2 !text-white flex justify-between items-center"
                  >
                    Info
                    <Icon.ChevronDown className="h-4 w-4" />
                  </button>
                  {activeDropdown === 'mobile-info' && (
                    <div className="px-8 py-2 space-y-1">
                      <Link
                        href="/watchman-nee"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        Watchman Nee
                      </Link>
                      <Link
                        href="/witness-lee"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        Witness Lee
                      </Link>
                      <Link
                        href="/about"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        O nás
                      </Link>
                      <Link
                        href="/safety-privacy"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        Bezpečnost a soukromí
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  href="/contact"
                  className="block px-4 py-2 !text-white"
                  onClick={closeAllDropdowns}
                >
                  Kontakt
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
      {/* Mobile Logo routing to -> Home.  */}
      <div className="block lg:hidden bg-white py-6">
        <div className="px-4">
          <div className="flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center">
              <Link href="/" className="no-underline">
                <img src="/images/wwwproudbanner.png" className="h-16" alt="prud-zivota" />
              </Link>
              <h3 className="text-[#A07C54] text-center italic !text-[15px] mt-2">
                Přinášet bohatství Božího slova všemu Božímu lidu
              </h3>
            </div>
            {/* Display on '/' only  */}
            {isHomePage && (
              <div className="mt-8">
                <MobileSearchBox />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
