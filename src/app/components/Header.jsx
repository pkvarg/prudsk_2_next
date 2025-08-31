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
      <div className="hidden lg:block bg-gray-100 border border-gray-300 h-10">
        {/* Component content... */}
        <div className="container mx-auto flex justify-between items-center mt-1.5">
          <div>
            <Link
              href="/contact"
              className="!text-[#000000] text-[17px] font-normal cursor-pointer no-underline"
            >
              <p className="m-0 hover:text-[#24b9d6]">Kontakt</p>
            </Link>
          </div>
          <div className="flex items-center">
            <Link href="/cart" className="mr-9 relative">
              <div className="relative">
                {/* Only show badge if there are items */}
                {cartItems?.length > 0 && (
                  <div className="absolute -right-2 -top-2 min-w-[20px] h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium px-1">
                      {cartItems.length > 99 ? '99+' : cartItems.length}
                    </span>
                  </div>
                )}
                <Icon.Cart2 className="text-[22.5px] text-black font-thin" />
              </div>
            </Link>
            {userInfo ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsOpen((prev) => !prev)}
                  className="!text-[#000000] font-normal text-[17px] focus:outline-none"
                >
                  {userInfo.name}
                </button>

                {isOpen && (
                  <div className="absolute right-0 bg-white shadow-md mt-1.5 min-w-[150px] z-10">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-[#24b9d6]  !text-[#000000]"
                    >
                      Môj profil
                    </Link>
                    <button
                      onClick={logoutHandler}
                      className="w-full text-left px-4 py-2 hover:bg-[#24b9d6] !text-[#000000]"
                    >
                      Odhlásiť sa
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="text-[#313131] font-normal">
                <div className="flex items-center">
                  <Icon.Person className="text-[25px] mr-1" />
                  <span>Prihlásenie</span>
                </div>
              </Link>
            )}
            {/* Admin section */}
            {userInfo && userInfo.isAdmin && !userInfo.isAssistant && (
              <div className="relative" ref={adminDropdownRef}>
                <button
                  onClick={() => setIsAdminOpen((prev) => !prev)}
                  className="!text-[#000000] font-normal text-[17px] focus:outline-none ml-9"
                >
                  Admin
                </button>

                {isAdminOpen && (
                  <div className="absolute right-0 bg-white shadow-md mt-1.5 min-w-[150px] z-10">
                    <Link
                      href="/admin/userlist"
                      className="block px-4 py-2 !text-[#000000] hover:bg-[#24b9d6] text-[15px]"
                    >
                      Používatelia
                    </Link>
                    <Link
                      href="/admin/productlist"
                      className="block px-4 py-2 !text-[#000000] hover:bg-[#24b9d6] text-[15px]"
                    >
                      Produkty
                    </Link>
                    <Link
                      href="/admin/orderlist"
                      className="block px-4 py-2 !text-[#000000] hover:bg-[#24b9d6] text-[15px]"
                    >
                      Objednávky
                    </Link>
                    <Link
                      href="/admin/audiolist"
                      className="block px-4 py-2 !text-[#000000] hover:bg-[#24b9d6] text-[15px]"
                    >
                      Audio
                    </Link>
                    <Link
                      href="/admin/videolist"
                      className="block px-4 py-2 !text-[#000000] hover:bg-[#24b9d6] text-[15px]"
                    >
                      Video
                    </Link>
                    <Link
                      href="/admin/bannerlist"
                      className="block px-4 py-2 !text-[#000000] hover:bg-[#24b9d6] text-[15px]"
                    >
                      Bannery
                    </Link>
                    <Link
                      href="/admin/subscriberslist"
                      className="block px-4 py-2 !text-[#000000] hover:bg-[#24b9d6] text-[15px]"
                    >
                      Odoberatelia noviniek
                    </Link>
                  </div>
                )}
              </div>
            )}
            {/* Assistant section */}
            {userInfo && userInfo.isAssistant && (
              <div className="relative" ref={assistantDropdownRef}>
                <button
                  onClick={() => setIsAssistantOpen((prev) => !prev)}
                  className="!text-[#000000] font-normal text-[17px] focus:outline-none ml-9"
                >
                  Asistent
                </button>

                {isAssistantOpen && (
                  <div className="absolute right-0 bg-white shadow-md mt-1 min-w-[150px] z-10">
                    <Link
                      href="/admin/audiolist"
                      className="block px-4 py-2 !text-[#000000] hover:bg-[#24b9d6] text-[15px]"
                    >
                      Audio
                    </Link>
                    <Link
                      href="/admin/videolist"
                      className="block px-4 py-2 !text-[#000000] hover:bg-[#24b9d6] text-[15px]"
                    >
                      Video
                    </Link>
                    <Link
                      href="/admin/bannerlist"
                      className="block px-4 py-2 !text-[#000000] hover:bg-[#24b9d6] text-[15px]"
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
                <img src="/images/prudbanner.png" className="h-16" alt="prud-zivota" />
              </Link>
              <h3 className="text-[#A07C54] italic text-lg mt-2">
                Prinášať bohatstvo Božieho slova celému Božiemu ľudu
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
                        Môj profil
                      </Link>
                      <button
                        onClick={logoutHandler}
                        className="w-full text-left px-4 py-2 !text-[#352106] hover:bg-gray-50"
                      >
                        Odhlásiť sa
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
              <Link href="/cart" className="text-white relative" onClick={closeAllDropdowns}>
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
                  <div className="absolute top-full left-0 mt-3 w-48 bg-white shadow-lg z-50 border">
                    <Link
                      href="/new-books/2024"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Knihy 2024
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
                  <div className="absolute top-full left-0 mt-3 w-48 bg-white shadow-lg z-50 border">
                    <Link
                      href="/words-of-life"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Slová života
                    </Link>
                    <Link
                      href="/life-study"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Štúdium života
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
                  <div className="absolute top-full left-0 mt-3 w-64 bg-white shadow-lg z-50 border max-h-96 overflow-y-auto">
                    <Link
                      href="/eshop/abecední-seznam-kníh"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Abecedný zoznam kníh
                    </Link>
                    <Link
                      href="/eshop/božia-ekonómia"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Božia ekonómia
                    </Link>
                    <Link
                      href="/eshop/brožúry"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Brožúry
                    </Link>
                    <Link
                      href="/eshop/cirkev"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Cirkev
                    </Link>
                    <Link
                      href="/eshop/duch"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Duch
                    </Link>
                    <Link
                      href="/eshop/evanjelium"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Evanjelium
                    </Link>
                    <Link
                      href="/eshop/kristus"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Kristus
                    </Link>
                    <Link
                      href="/eshop/kresťanská-prax"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Kresťanská prax
                    </Link>
                    <Link
                      href="/eshop/kresťanská-služba"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Kresťanská služba
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
                      href="/eshop/štúdium-a-výklad-biblie"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Štúdium a výklad Biblie
                    </Link>
                    <Link
                      href="/eshop/trojjediný-boh"
                      className="block px-4 py-2 !text-[#352106] hover:bg-gray-200"
                      onClick={closeAllDropdowns}
                    >
                      Trojjediný Boh
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

              {/* Čitáreň */}
              <Link href="/library" className="!text-white hover:text-gray-200 transition-colors">
                Čitáreň
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
                  <div className="absolute top-full left-0 mt-3 w-48 bg-white shadow-lg z-50 border">
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
                      Bezpečnosť a súkromie
                    </Link>
                  </div>
                )}
              </div>

              {/* Kontakt */}
              <Link href="/contact" className="!text-white hover:text-gray-200 transition-colors">
                Kontakt
              </Link>
              <Link
                href="/download"
                className="!text-white hover:text-gray-200 transition-colors"
                onClick={closeAllDropdowns}
              >
                Na stiahnutie
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
                        href="/new-books/2024"
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
                        Slová života
                      </Link>
                      <Link
                        href="/life-study"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        Štúdium života
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
                        Abecedný zoznam kníh
                      </Link>
                      <Link
                        href="/eshop/božia-ekonómia"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        Božia ekonómia
                      </Link>
                      <Link href="/eshop/brožúry" className="block py-1 !text-white text-sm">
                        Brožúry
                      </Link>
                      <Link
                        href="/eshop/cirkev"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        Cirkev
                      </Link>
                      <Link
                        href="/eshop/duch"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        Duch
                      </Link>
                      <Link
                        href="/eshop/evanjelium"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        Evanjelium
                      </Link>
                      <Link
                        href="/eshop/kristus"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        Kristus
                      </Link>
                      <Link
                        href="/eshop/kresťanská-prax"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        Kresťanská prax
                      </Link>
                      <Link
                        href="/eshop/kresťanská-služba"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        Kresťanská služba
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
                        href="/eshop/štúdium-a-výklad-biblie"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        Štúdium a výklad Biblie
                      </Link>
                      <Link
                        href="/eshop/trojjediný-boh"
                        className="block py-1 !text-white text-sm"
                        onClick={closeAllDropdowns}
                      >
                        Trojjediný Boh
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
                  Čitáreň
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
                        Bezpečnosť a súkromie
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
                <Link
                  href="/download"
                  className="block px-4 py-2 !text-white"
                  onClick={closeAllDropdowns}
                >
                  Na stiahnutie
                </Link>
                {/* Add this ADMIN section for mobile */}
                {userInfo && userInfo.isAdmin && !userInfo.isAssistant && (
                  <div>
                    <button
                      onClick={() => toggleDropdown('mobile-admin')}
                      className="w-full text-left px-4 py-2 text-white flex justify-between items-center"
                    >
                      Admin
                      <Icon.ChevronDown className="h-4 w-4" />
                    </button>
                    {activeDropdown === 'mobile-admin' && (
                      <div className="px-8 py-2 space-y-1">
                        <Link
                          href="/admin/userlist"
                          className="block py-1 !text-white text-sm"
                          onClick={closeAllDropdowns}
                        >
                          Používatelia
                        </Link>
                        <Link
                          href="/admin/productlist"
                          className="block py-1 !text-white text-sm"
                          onClick={closeAllDropdowns}
                        >
                          Produkty
                        </Link>
                        <Link
                          href="/admin/orderlist"
                          className="block py-1 !text-white text-sm"
                          onClick={closeAllDropdowns}
                        >
                          Objednávky
                        </Link>
                        <Link
                          href="/admin/audiolist"
                          className="block py-1 !text-white text-sm"
                          onClick={closeAllDropdowns}
                        >
                          Audio
                        </Link>
                        <Link
                          href="/admin/videolist"
                          className="block py-1 !text-white text-sm"
                          onClick={closeAllDropdowns}
                        >
                          Video
                        </Link>
                        <Link
                          href="/admin/bannerlist"
                          className="block py-1 !text-white text-sm"
                          onClick={closeAllDropdowns}
                        >
                          Bannery
                        </Link>
                        <Link
                          href="/admin/subscriberslist"
                          className="block py-1 !text-white text-sm"
                          onClick={closeAllDropdowns}
                        >
                          Odoberatelia noviniek
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* Add ASSISTANT section for mobile */}
                {userInfo && userInfo.isAssistant && (
                  <div>
                    <button
                      onClick={() => toggleDropdown('mobile-assistant')}
                      className="w-full text-left px-4 py-2 text-white flex justify-between items-center"
                    >
                      Asistent
                      <Icon.ChevronDown className="h-4 w-4" />
                    </button>
                    {activeDropdown === 'mobile-assistant' && (
                      <div className="px-8 py-2 space-y-1">
                        <Link
                          href="/admin/audiolist"
                          className="block py-1 !text-white text-sm"
                          onClick={closeAllDropdowns}
                        >
                          Audio
                        </Link>
                        <Link
                          href="/admin/videolist"
                          className="block py-1 !text-white text-sm"
                          onClick={closeAllDropdowns}
                        >
                          Video
                        </Link>
                        <Link
                          href="/admin/bannerlist"
                          className="block py-1 !text-white text-sm"
                          onClick={closeAllDropdowns}
                        >
                          Bannery
                        </Link>
                      </div>
                    )}
                  </div>
                )}
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
                <img src="/images/prudbanner.png" className="h-16" alt="prud-zivota" />
              </Link>
              <h3 className="text-[#A07C54] text-center italic !text-[15px] mt-2">
                Prinášať bohatstvo Božieho slova celému Božiemu ľudu
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
