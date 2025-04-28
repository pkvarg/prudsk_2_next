'use client'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux' // setup for next js
import SearchBox from './SearchBox'
import { logoutAndRedirect } from '@/store/slices/userSlice'

import * as Icon from 'react-bootstrap-icons'
import Link from 'next/link'

const Header = () => {
  const dispatch = useDispatch()
  const { userInfo } = useSelector((state) => state.user)

  const { cartItems } = useSelector((state) => state.cart)

  const logoutHandler = () => {
    dispatch(logoutAndRedirect())
  }
  return (
    <header>
      {/* Grey navbar (desktop only) */}
      <div className="hidden lg:block bg-gray-100 border border-gray-300 h-8">
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
              <div className="relative group">
                <button className="text-[#313131] font-normal text-[17px] focus:outline-none">
                  {userInfo.name}
                </button>
                <div className="hidden group-hover:block absolute right-0 bg-white shadow-md mt-1 min-w-[150px] z-10">
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

      {/* Header with Logo (desktop only) */}
      <div className="hidden lg:flex container mx-auto justify-between items-center mt-4 mb-3">
        <div>
          <Link href="/" className="no-underline">
            <img src="/images/wwwproudbanner.png" className="w-[42%] mt-4" alt="prud-zivota" />
          </Link>
          <h3 className="text-[#a07c54] text-[22px] font-normal italic mb-4 pt-0 pb-0 font-['headerPublisher']">
            Přinášet bohatství Božího slova všemu Božímu lidu
          </h3>
        </div>
        <div className="flex-1 max-w-md">
          <SearchBox />
        </div>
      </div>

      {/* Red Navbar (desktop) / Grey Navbar with toggle (mobile) */}
      <nav className="lg:bg-[#8a1c1f] bg-gray-100 lg:h-[35px] h-[65px]">
        <div className="lg:-translate-y-1 relative z-10">
          <div className="container mx-auto">
            <div>
              {/* Mobile navbar items */}
              <div className="flex lg:hidden items-center justify-center gap-8 ml-11 -translate-y-3">
                {/* Mobile sign in */}
                <div className="flex items-center">
                  {userInfo ? (
                    <div className="relative group">
                      <button className="text-[#5e5d5d] font-normal text-[17px] focus:outline-none p-0 ml-[5px]">
                        {userInfo.name}
                      </button>
                      <div className="hidden group-hover:block absolute left-0 bg-white shadow-md mt-1 min-w-[150px] z-10">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-[#5e5d5d] hover:bg-[#907355] hover:text-white"
                        >
                          Můj profil
                        </Link>
                        <button
                          onClick={logoutHandler}
                          className="w-full text-left px-4 py-2 text-[#5e5d5d] hover:bg-[#907355] hover:text-white"
                        >
                          Odhlásit se
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link href="/login">
                      <div className="flex items-center">
                        <Icon.Person className="text-[25px] text-[#5e5d5d]" />
                      </div>
                    </Link>
                  )}

                  {userInfo && userInfo.isAdmin && !userInfo.isAssistant && (
                    <div className="relative group ml-1">
                      <button className="text-[#5e5d5d] font-normal text-[17px] focus:outline-none ml-[5px]">
                        Admin
                      </button>
                      <div className="hidden group-hover:block absolute left-0 bg-white shadow-md mt-1 min-w-[150px] z-10">
                        <Link
                          href="/admin/userlist"
                          className="block px-4 py-2 text-[#5e5d5d] hover:bg-[#907355] hover:text-white text-[15px]"
                        >
                          Uživatelé
                        </Link>
                        {/* Other admin menu items */}
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile cart */}
                <div className="flex">
                  <Link href="/cart" className="relative block">
                    <div>
                      <p className="absolute -top-[11px] left-[15px] inline-block rounded-full w-5 h-5 leading-[19px] bg-red-500 text-white">
                        <span className="text-lg ml-[25%]">{cartItems?.length}</span>
                      </p>
                      <Icon.Cart className="text-[25px] text-[#5e5d5d]" />
                    </div>
                  </Link>
                </div>

                {/* Favorites */}
                <Link href="favorites" className="mb-[2%] ml-[2%]">
                  <Icon.HeartFill className="text-red-500 text-[25px]" />
                </Link>
              </div>
            </div>
          </div>

          {/* Navbar items - desktop and mobile */}
          <div className="lg:flex items-center justify-center bg-gray-100 lg:bg-transparent pt-12 lg:pt-0 pl-4 lg:pl-0">
            {/* Navigation items with dropdowns */}
            <div className="lg:text-white text-[#5e5d5d] lg:mr-4 text-[17px] lg:px-1 lg:py-2 cursor-pointer group relative">
              <span>Novinky</span>
              <div className="hidden group-hover:block absolute bg-[#f7f7f9] min-w-max shadow-md mt-0 z-10">
                <Link
                  href="new-books/2025"
                  className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px] font-normal"
                >
                  Knihy 2025
                </Link>
              </div>
            </div>

            {/* Podcast dropdown */}
            <div className="lg:text-white text-gray-700 lg:mr-4 text-[17px] lg:px-1 lg:py-2 cursor-pointer group relative">
              <span>Podcast</span>
              <div className="hidden group-hover:block absolute bg-[#f7f7f9] min-w-max shadow-md mt-0 z-10">
                <Link
                  href="words-of-life"
                  className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px] font-normal"
                >
                  Slova života
                </Link>
                <Link
                  href="life-study"
                  className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px] font-normal"
                >
                  Studium života
                </Link>
              </div>
            </div>

            {/* Video link */}
            <Link href="/video" className="block">
              <div className="lg:text-white text-gray-700 lg:mr-4 text-[17px] lg:px-1 lg:py-2 lg:hover:bg-[#611316] cursor-pointer">
                Video
              </div>
            </Link>

            {/* E-shop dropdown */}
            <div className="lg:text-white text-gray-700 lg:mr-4 text-[17px] lg:px-1 lg:py-2 cursor-pointer group relative">
              <span>E-shop</span>
              <div className="hidden group-hover:block absolute bg-[#f7f7f9] min-w-max shadow-md mt-0 z-10">
                <Link
                  href="eshop/abecedný-zoznam-kníh"
                  className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px] font-normal"
                >
                  Abecední seznam knih
                </Link>
                <Link
                  href="eshop/Boží-ekonomie"
                  className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px] font-normal"
                >
                  Boží ekonomie
                </Link>
                <Link
                  href="eshop/brožury"
                  className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px] font-normal"
                >
                  Brožury
                </Link>
                <Link
                  href="eshop/církev"
                  className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px] font-normal"
                >
                  Církev
                </Link>
                <Link
                  href="eshop/duch"
                  className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px] font-normal"
                >
                  Duch
                </Link>
                <Link
                  href="eshop/evangelium"
                  className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px] font-normal"
                >
                  Evangelium
                </Link>
                <Link
                  href="eshop/kristus"
                  className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px] font-normal"
                >
                  Kristus
                </Link>
                <Link
                  href="eshop/křesťanská-praxe"
                  className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px] font-normal"
                >
                  Křesťanská praxe
                </Link>
                <Link
                  href="eshop/křesťanská-služba"
                  className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px] font-normal"
                >
                  Křesťanská služba
                </Link>
                <Link
                  href="eshop/letáky"
                  className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px] font-normal"
                >
                  Letáky
                </Link>
                <Link
                  href="eshop/mládež"
                  className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px] font-normal"
                >
                  Mládež
                </Link>
                <Link
                  href="eshop/studium-a-výklad-bible"
                  className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px] font-normal"
                >
                  Studium a výklad Bible
                </Link>
                <Link
                  href="eshop/Trojjediný-Bůh"
                  className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px] font-normal"
                >
                  Trojjediný Bůh
                </Link>
                <Link
                  href="eshop/život"
                  className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px] font-normal"
                >
                  Život
                </Link>
                <Link
                  href="eshop/životopisné"
                  className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px] font-normal"
                >
                  Životopisné
                </Link>
              </div>
            </div>

            {/* Library link */}
            <Link href="/library" className="block">
              <div className="lg:text-white text-gray-700 lg:mr-4 text-[17px] lg:px-1 lg:py-2 lg:hover:bg-[#611316] cursor-pointer">
                Čítárna
              </div>
            </Link>

            {/* Info dropdown */}
            <div className="lg:text-white text-gray-700 lg:mr-4 text-[17px] lg:px-1 lg:py-2 cursor-pointer group relative">
              <span>Info</span>
              <div className="hidden group-hover:block absolute bg-[#f7f7f9] min-w-max shadow-md mt-0 z-10">
                <Link
                  href="watchman-nee"
                  className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px] font-normal"
                >
                  Watchman Nee
                </Link>
                <Link
                  href="witness-lee"
                  className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px] font-normal"
                >
                  Witness Lee
                </Link>
                <Link
                  href="about"
                  className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px] font-normal"
                >
                  O nás
                </Link>
                <Link
                  href="safety-privacy"
                  className="block px-4 py-2 text-[#313131] hover:bg-[#24b9d6] hover:text-white text-[15px] font-normal"
                >
                  Bezpečnost a soukromí
                </Link>
              </div>
            </div>

            {/* Contact link */}
            <Link href="/contact" className="block">
              <div className="lg:text-white text-gray-700 lg:mr-4 text-[17px] lg:px-1 lg:py-2 lg:hover:bg-[#611316] cursor-pointer">
                Kontakt
              </div>
            </Link>

            {/* Favorites icon (desktop) */}
            <Link href="favorites" className="hidden lg:block">
              <Icon.HeartFill className="text-white text-[20px] mt-0 ml-[10px] hover:text-[#611316]" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile logo section */}
      <div className="lg:hidden flex flex-col">
        <Link href="/" className="no-underline">
          <img
            src="/images/wwwproudbanner.png"
            className="w-[70vw] ml-[20%] mt-6"
            alt="prud-zivota"
          />
          <p className="ml-4 mr-4 mt-4 italic text-[#a07c54] text-[25px] font-normal overflow-hidden">
            Přinášet bohatství Božího lidu všemu Božímu lidu
          </p>
        </Link>

        <div className="mx-6 mt-4">
          <SearchBox />
        </div>
      </div>
    </header>
  )
}

export default Header
