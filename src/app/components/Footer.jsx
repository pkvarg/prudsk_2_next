'use client'
import React from 'react'
import Link from 'next/link'
import CookieConsent from 'react-cookie-consent'

const Footer = () => {
  const apiUrl = 'https://hono-api.pictusweb.com/api/visitors/proud2next/increase'
  //const apiUrl = 'http://localhost:3013/api/visitors/proud2next/increase'

  const incrementCount = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error('Failed to increment count')
      }
    } catch (err) {
      console.log(err instanceof Error ? err.message : 'An unknown error occurred')
    }
  }

  return (
    <>
      <CookieConsent
        location="bottom"
        style={{
          background: '#dadada',
          color: '#8a1b1f',
          fontSize: '15px',
          textAlign: 'justify',
        }}
        buttonStyle={{
          background: '#1d9f2f',
          color: '#fff',
          fontSize: '17.5px',
        }}
        buttonText="Souhlasím"
        expires={365}
        enableDeclineButton
        onAccept={() => {
          incrementCount()
        }}
        declineButtonStyle={{
          background: 'red',
          color: '#fff',
          fontSize: '17.5px',
        }}
        declineButtonText="Nesouhlasím"
        onDecline={() => {
          incrementCount()
        }}
      >
        Tato stránka používá pouze analytické a pro fungování webu nezbytné cookies. Nepoužíváme
        funkční ani marketingové soubory cookies.{' '}
        <a
          style={{
            color: '#8a1b1f',
            fontSize: '15px',
            //textDecoration: 'none',
          }}
          href="/safety-privacy"
        >
          {' '}
          GDPR
        </a>
      </CookieConsent>
      <footer className="bg-[#edeae4]">
        <div className="container mx-auto">
          <div className="text-center pt-8 my-4">
            <div className="grid grid-cols-1 md:grid-cols-4">
              <div>
                <div className="flex flex-col items-start md:items-start mx-3 md:mx-0 w-[90vw] md:w-auto">
                  <h2 className="text-[#071e46] !font-normal hidden md:block">Informace</h2>
                  <Link href="/about" className="no-underline">
                    <p className="text-[#9b7d57] text-[17px]">O nás</p>
                  </Link>
                  <Link href="/contact" className="no-underline">
                    <p className="text-[#9b7d57] text-[17px] md:leading-[21.5px] leading-[35px]">
                      Kontaktujte nás
                    </p>
                  </Link>
                </div>
              </div>
              <div>
                <div className="flex flex-col items-start md:items-start mx-3 md:mx-0 w-[90vw] md:w-auto">
                  <h2 className="text-[#071e46] !font-normal hidden md:block">Podmínky</h2>
                  <Link href="/safety-privacy" className="no-underline">
                    <p className="text-[#9b7d57] text-[17px]">GDPR</p>
                  </Link>
                  <Link href="/trade-rules" className="no-underline">
                    <p className="text-[#9b7d57] text-[17px] md:leading-[21.5px] leading-[35px]">
                      Obchodní podmínky
                    </p>
                  </Link>
                </div>
              </div>
              <div>
                <div className="flex flex-col items-start md:items-start mx-3 md:mx-0 w-[90vw] md:w-auto">
                  <h2 className="text-[#071e46] !font-normal hidden md:block">Váš účet</h2>
                  <Link href="/login?redirect=/profile" className="no-underline">
                    <p className="text-[#9b7d57] text-[17px]">Objednávky</p>
                  </Link>
                  <Link href="/forgot-password" className="no-underline">
                    <p className="text-[#9b7d57] text-[17px] md:leading-[21.5px] leading-[35px]">
                      Zapomenuté heslo
                    </p>
                  </Link>
                </div>
              </div>
              <div>
                <div className="flex flex-col items-start md:items-start mx-3 md:mx-0 w-[90vw] md:w-auto">
                  <h2 className="text-[#071e46] !font-normal hidden md:block">Kontakt</h2>
                  <a href="mailto:eshop@proudzivota.cz" className="no-underline">
                    <p className="text-[#9b7d57] text-[17px]">eshop@proudzivota.cz</p>
                  </a>
                  <a href="tel:+421904060262" className="no-underline">
                    <p className="text-[#9b7d57] text-[17px]">+420 724 526 926</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto">
          <div className="py-3">
            {/* Desktop copyright */}
            <div className="hidden md:flex md:flex-row md:justify-center md:gap-0 text-center">
              <p className="ml-2 text-[16px] text-[#828282] mb-0">
                Copyright &copy; {Date().substring(11, 15)} Distribuce Proud, všechna práva
                vyhrazena,
              </p>
              <a
                href="https://www.lsm.org"
                target="_blank"
                rel="noreferrer"
                className="text-[16px] !text-[#828282] ml-0.5"
              >
                se svolením
                <span className="ml-2 underline">Living Stream Ministry</span>
              </a>
              <a
                href="https://www.pictusweb.sk"
                target="_blank"
                rel="noreferrer"
                className="text-[16px] !text-[#828282] ml-2.5"
              >
                &#60;&#47;&#62; PICTUSWEB Development
              </a>
            </div>

            {/* Mobile copyright */}
            <div className="md:hidden flex flex-col justify-center gap-3 text-left mx-3">
              <p className="text-[16px] text-[#828282] mb-0">
                Copyright &copy; {Date().substring(11, 15)} Distribuce Proud,
              </p>
              <p className="text-[16px] text-[#828282] mb-0">
                všechna práva vyhrazena, se svolením
              </p>
              <a
                href="https://www.lsm.org"
                target="_blank"
                rel="noreferrer"
                className="text-[16px] text-[#828282] ml-0"
              >
                LIVING STREAM MINISTRY
              </a>
              <a
                href="https://www.pictusweb.sk"
                target="_blank"
                rel="noreferrer"
                className="text-[16px] text-[#828282] ml-0"
              >
                &#60;&#47;&#62; PICTUSWEB Development
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
