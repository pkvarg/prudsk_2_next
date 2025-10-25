'use client'
import React from 'react'
import Link from 'next/link'
import CookieConsent from 'react-cookie-consent'

const Footer = () => {
  const apiUrl = 'https://hono-api.pictusweb.com/api/visitors/prudsk2next/increase'
  //const apiUrl = 'http://localhost:3013/api/visitors/prudsk2next/increase'

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

  const loadUmamiScript = () => {
    if (!document.querySelector('[data-website-id="6b118a72-1e0a-4fe7-915c-dbbd7b549af2"]')) {
      const script = document.createElement('script')
      script.defer = true
      script.src = 'https://umami-p00gs00gwcwo00s4k4c4kgg8.pictusweb.com/script.js'
      script.setAttribute('data-website-id', '6b118a72-1e0a-4fe7-915c-dbbd7b549af2')
      document.head.appendChild(script)
    }
  }

  return (
    <>
      <CookieConsent
        location="bottom"
        style={{
          background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
          color: '#2c3e50',
          fontSize: '14px',
          textAlign: 'left',
          width: '100%',
          maxWidth: '100vw',
          padding: '20px 24px',
          boxSizing: 'border-box',
          overflowX: 'hidden',
          boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.15)',
          borderTop: '3px solid #8a1b1f',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '16px',
        }}
        containerClasses="cookie-consent-container"
        contentStyle={{
          flex: '1 1 auto',
          margin: '0',
          paddingRight: '0',
          maxWidth: 'none',
          wordWrap: 'break-word',
          lineHeight: '1.6',
        }}
        buttonWrapperClasses="flex flex-row gap-3 shrink-0"
        buttonStyle={{
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          color: '#fff',
          fontSize: '15px',
          fontWeight: '600',
          minWidth: '140px',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 6px rgba(34, 197, 94, 0.3)',
        }}
        buttonText="Súhlasím"
        expires={365}
        enableDeclineButton
        onAccept={() => {
          loadUmamiScript()
          incrementCount()
        }}
        declineButtonStyle={{
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: '#fff',
          fontSize: '15px',
          fontWeight: '600',
          minWidth: '140px',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 6px rgba(239, 68, 68, 0.3)',
        }}
        declineButtonText="Nesúhlasím"
        onDecline={() => {
          incrementCount()
        }}
      >
        <span className="text-[14px] sm:text-[15px] leading-relaxed">
          Táto stránka používa len analytické a pre fungovanie webu nevyhnutné cookies pre anonymnú
          analytiku návštevnosti.{' '}
          <a
            style={{
              color: '#8a1b1f',
              fontSize: '15px',
              fontWeight: '600',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}
            href="/safety-privacy"
            className="hover:opacity-80 transition-opacity"
          >
            GDPR →
          </a>
        </span>
      </CookieConsent>
      <footer className="bg-[#edeae4]">
        <div className="container mx-auto">
          <div className="text-center pt-8 my-4">
            <div className="grid grid-cols-1 md:grid-cols-4">
              <div>
                <div className="flex flex-col items-start md:items-start mx-3 md:mx-0 w-[90vw] md:w-auto">
                  <h2 className="text-[#071e46] !font-normal hidden md:block">Informácie</h2>
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
                  <h2 className="text-[#071e46] !font-normal hidden md:block">Podmienky</h2>
                  <Link href="/safety-privacy" className="no-underline">
                    <p className="text-[#9b7d57] text-[17px]">GDPR</p>
                  </Link>
                  <Link href="/trade-rules" className="no-underline">
                    <p className="text-[#9b7d57] text-[17px] md:leading-[21.5px] leading-[35px]">
                      Obchodné podmienky
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
                      Zabudnuté heslo
                    </p>
                  </Link>
                </div>
              </div>
              <div>
                <div className="flex flex-col items-start md:items-start mx-3 md:mx-0 w-[90vw] md:w-auto">
                  <h2 className="text-[#071e46] !font-normal hidden md:block">Kontakt</h2>
                  <a href="mailto:eshop@prud.sk" className="no-underline">
                    <p className="text-[#9b7d57] text-[17px]">eshop@prud.sk</p>
                  </a>
                  <a href="tel:+421904060262" className="no-underline">
                    <p className="text-[#9b7d57] text-[17px]">+421 904 060 262</p>
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
                Copyright &copy; {Date().substring(11, 15)} Prúd života, všetky práva vyhradené,
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
            <div className="md:hidden flex flex-col justify-center gap-1 text-left mx-3">
              <p className="text-[16px] text-[#828282] mb-0">
                Copyright &copy; {Date().substring(11, 15)} Prúd života,
              </p>
              <p className="text-[16px] text-[#828282] mb-0">všetky práva vyhradené,</p>
              <a
                href="https://www.lsm.org"
                target="_blank"
                rel="noreferrer"
                className="text-[16px] !text-[#828282] ml-0 cursor-pointer"
              >
                se svolením
                <span className="ml-2 underline">LIVING STREAM MINISTRY</span>
              </a>
              <a
                href="https://www.pictusweb.sk"
                target="_blank"
                rel="noreferrer"
                className="text-[12.5px] !text-[#828282] ml-0"
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
