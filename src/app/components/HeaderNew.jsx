import React from 'react'
import Link from 'next/link'
import * as Icon from 'react-bootstrap-icons'

const Header = () => {
  return (
    <header>
      {/* Grey navbar (desktop only) */}
      <div className="hidden lg:block bg-gray-100 border border-gray-300 h-10">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <Link
              href="/contact"
              className="text-gray-700 text-base font-normal cursor-pointer no-underline"
            >
              <p className="m-0">Kontakt</p>
            </Link>
          </div>
          <div className="flex items-center">
            <Link href="/cart" className="text-gray-700 mr-9 relative">
              <div>
                <p className="absolute -right-2 -top-2 inline-block rounded-full w-5 h-5 leading-5 bg-red-500 text-white">
                  <span className="text-lg ml-1 pb-3"></span>
                </p>
                <Icon.Cart2 className="text-2xl font-thin mb-2">Košík</Icon.Cart2>
              </div>
            </Link>
            {/* User authentication links would go here */}
          </div>
        </div>
      </div>

      {/* Header with Logo (desktop only) */}
      <div className="hidden lg:flex container mx-auto justify-between items-center mt-4 mb-3">
        <div>
          <Link href="/" className="no-underline">
            <img src="/images/wwwproudbanner.png" className="w-5/12 mt-4" alt="prud-zivota"></img>
          </Link>
          <h3 className="text-[#a07c54] text-xl font-normal italic mb-4 pt-0 pb-0 font-serif">
            Přinášet bohatství Božího slova všemu Božímu lidu
          </h3>
        </div>
        <div className="flex-1 max-w-md">{/* SearchBox would go here */}</div>
      </div>

      {/* Red Navbar (desktop) / Grey Navbar with toggle (mobile) */}
      <nav className="lg:bg-[#8a1c1f] bg-gray-100 h-6 lg:h-[25px]">
        <div className="lg:-translate-y-3 lg:mx-auto relative z-10">
          <div className="container mx-auto">
            <div>
              {/* Mobile navbar items */}
              <div className="flex lg:hidden items-center justify-center gap-8 ml-11 -translate-y-3">
                {/* Mobile sign in */}
                <div className="flex items-center">
                  {/* Authentication dropdown would go here */}
                </div>

                {/* Mobile cart */}
                <div className="flex">
                  <Link href="/cart" className="relative block">
                    <div>
                      <p className="absolute -right-2 -top-2 inline-block rounded-full w-5 h-5 leading-5 bg-red-500 text-white"></p>
                      <Icon.Cart className="text-gray-700" />
                    </div>
                  </Link>
                </div>

                {/* Favorites */}
                <Link href="favorites" className="mb-[2%] ml-[2%]">
                  <Icon.HeartFill className="text-red-500" />
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile menu button would go here */}

          {/* Navbar collapse - desktop and mobile */}
          <div className="lg:flex bg-gray-100 lg:bg-transparent pt-12 lg:pt-0 pl-4 lg:pl-0">
            {/* Novinky dropdown */}
            <div className="lg:text-white text-gray-700 lg:mr-4 text-base lg:px-1 lg:py-2 cursor-pointer group relative">
              <span>Novinky</span>
              <div className="hidden group-hover:block absolute bg-gray-50 min-w-max shadow-md mt-0 z-10">
                <Link
                  href="new-books/2025"
                  className="block px-4 py-2 text-gray-700 hover:bg-[#24b9d6] hover:text-white text-sm"
                >
                  Knihy 2025
                </Link>
              </div>
            </div>

            {/* Podcast dropdown */}
            <div className="lg:text-white text-gray-700 lg:mr-4 text-base lg:px-1 lg:py-2 cursor-pointer group relative">
              <span>Podcast</span>
              <div className="hidden group-hover:block absolute bg-gray-50 min-w-max shadow-md mt-0 z-10">
                <Link
                  href="words-of-life"
                  className="block px-4 py-2 text-gray-700 hover:bg-[#24b9d6] hover:text-white text-sm"
                >
                  Slova života
                </Link>
                <Link
                  href="life-study"
                  className="block px-4 py-2 text-gray-700 hover:bg-[#24b9d6] hover:text-white text-sm"
                >
                  Studium života
                </Link>
              </div>
            </div>

            {/* Video link */}
            <Link href="/video" className="block">
              <div className="lg:text-white text-gray-700 lg:mr-4 text-base lg:px-1 lg:py-2 lg:hover:bg-[#611316] cursor-pointer">
                Video
              </div>
            </Link>

            {/* E-shop dropdown */}
            <div className="lg:text-white text-gray-700 lg:mr-4 text-base lg:px-1 lg:py-2 cursor-pointer group relative">
              <span>E-shop</span>
              <div className="hidden group-hover:block absolute bg-gray-50 min-w-max shadow-md mt-0 z-10">
                <Link
                  href="eshop/abecedný-zoznam-kníh"
                  className="block px-4 py-2 text-gray-700 hover:bg-[#24b9d6] hover:text-white text-sm"
                >
                  Abecední seznam knih
                </Link>
                <Link
                  href="eshop/Boží-ekonomie"
                  className="block px-4 py-2 text-gray-700 hover:bg-[#24b9d6] hover:text-white text-sm"
                >
                  Boží ekonomie
                </Link>
                {/* More eshop categories would go here */}
              </div>
            </div>

            {/* Library link */}
            <Link href="/library" className="block">
              <div className="lg:text-white text-gray-700 lg:mr-4 text-base lg:px-1 lg:py-2 lg:hover:bg-[#611316] cursor-pointer">
                Čítárna
              </div>
            </Link>

            {/* Info dropdown */}
            <div className="lg:text-white text-gray-700 lg:mr-4 text-base lg:px-1 lg:py-2 cursor-pointer group relative">
              <span>Info</span>
              <div className="hidden group-hover:block absolute bg-gray-50 min-w-max shadow-md mt-0 z-10">
                <Link
                  href="watchman-nee"
                  className="block px-4 py-2 text-gray-700 hover:bg-[#24b9d6] hover:text-white text-sm"
                >
                  Watchman Nee
                </Link>
                <Link
                  href="witness-lee"
                  className="block px-4 py-2 text-gray-700 hover:bg-[#24b9d6] hover:text-white text-sm"
                >
                  Witness Lee
                </Link>
                <Link
                  href="about"
                  className="block px-4 py-2 text-gray-700 hover:bg-[#24b9d6] hover:text-white text-sm"
                >
                  O nás
                </Link>
                <Link
                  href="safety-privacy"
                  className="block px-4 py-2 text-gray-700 hover:bg-[#24b9d6] hover:text-white text-sm"
                >
                  Bezpečnost a soukromí
                </Link>
              </div>
            </div>

            {/* Contact link */}
            <Link href="/contact" className="block">
              <div className="lg:text-white text-gray-700 lg:mr-4 text-base lg:px-1 lg:py-2 lg:hover:bg-[#611316] cursor-pointer">
                Kontakt
              </div>
            </Link>

            {/* Favorites icon (desktop) */}
            <Link href="favorites" className="hidden lg:block">
              <Icon.HeartFill className="text-white text-2xl ml-3 hover:text-[#611316]" />
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
          <p className="ml-4 mr-4 mt-4 italic text-[#a07c54] text-2xl font-normal overflow-hidden">
            Přinášet bohatství Božího lidu všemu Božímu lidu
          </p>
        </Link>

        <div className="mx-6 mt-4">{/* SearchBox would go here */}</div>
      </div>
    </header>
  )
}

export default Header
