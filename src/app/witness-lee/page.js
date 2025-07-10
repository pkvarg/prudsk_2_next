// app/witness-lee/page.js (Server Component)
import Link from 'next/link'

// Enhanced metadata for SEO
export const metadata = {
  title: 'Witness Lee - Životopis a služba | Proud života',
  description:
    'Seznamte se s životem a službou Witness Leeho, významného křesťanského učitele a spolupracovníka Watchmana Neeho. Jeho služba v Číně, Tchaj-wanu a USA.',
  keywords:
    'Witness Lee, křesťanský učitel, křesťanský spisovatel, Living Stream Ministry, Recovery Version, Studium života, místní církve, Watchman Nee, křesťanské knihy',
  openGraph: {
    title: 'Witness Lee - Životopis a služba | Proud života',
    description:
      'Životopis Witness Leeho, významného křesťanského učitele a spolupracovníka Watchmana Neeho. Jeho služba a dílo.',
    type: 'article',
    url: 'https://proudzivota.cz/witness-lee',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Witness Lee - Životopis a služba',
    description:
      'Životopis Witness Leeho, významného křesťanského učitele a spolupracovníka Watchmana Neeho',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://proudzivota.cz/witness-lee',
  },
}

export default function WitnessLeePage() {
  // Generate JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Witness Lee - Životopis a služba',
    description:
      'Životopis Witness Leeho, významného křesťanského učitele a spolupracovníka Watchmana Neeho. Jeho služba a dílo.',
    author: {
      '@type': 'Organization',
      name: 'Proud života',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Proud života',
      logo: {
        '@type': 'ImageObject',
        url: 'https://proudzivota.cz/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://proudzivota.cz/witness-lee',
    },
    about: {
      '@type': 'Person',
      name: 'Witness Lee',
      description: 'Křesťanský učitel, kazatel a spisovatel',
      birthDate: '1905',
      deathDate: '1997',
      nationality: 'Chinese',
      occupation: 'Křesťanský učitel a spisovatel',
      knowsAbout: ['Křesťanství', 'Bible', 'Duchovní život', 'Místní církve'],
      worksFor: {
        '@type': 'Organization',
        name: 'Living Stream Ministry',
      },
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Domů',
          item: 'https://proudzivota.cz',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Witness Lee',
          item: 'https://proudzivota.cz/witness-lee',
        },
      ],
    },
  }

  return (
    <>
      {/* Add JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4">
        {/* Back button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center px-4 my-8 py-2 bg-[#2bb2e6] !text-white rounded hover:bg-[#218334] transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Zpět
          </Link>
        </div>

        <div className="my-3 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-[#071e46] mb-8 text-center">Witness Lee</h1>

          {/* Introduction */}
          <div className="mb-8 p-6 bg-[#f8f9fa] rounded-lg border-l-4 border-[#9b7d57]">
            <p className="text-[#191817] text-lg leading-relaxed">
              <strong>Witness Lee (1905-1997)</strong> byl významný křesťanský učitel, kazatel a
              spisovatel. Spolupracoval s Watchmanem Neem a pokračoval v jeho díle, sloužil v Číně,
              Tchaj-wanu a později ve Spojených státech.
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-[#071e46] mb-4 border-b-2 border-[#9b7d57] pb-2">
                POČÁTKY
              </h2>
              <p className="text-[#191817] text-[17px] leading-relaxed text-justify">
                Witness Lee se narodil v roce 1905 v severní Číně a vyrůstal v křesťanské rodině. V
                devatenácti letech byl zcela uchvácen Kristem a okamžitě se rozhodl zasvětit svůj
                život kázání evangelia. Na počátku své služby se setkal se známým kazatelem,
                učitelem a spisovatelem Watchmanem Neem. Witness Lee spolupracoval s Watchmanem Neem
                pod jeho vedením. Počátkem roku 1934 mu Watchman Nee svěřil vedení svého
                nakladatelství Shanghai Gospel Book Room.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#071e46] mb-4 border-b-2 border-[#9b7d57] pb-2">
                TCHAJ-WAN
              </h2>
              <p className="text-[#191817] text-[17px] leading-relaxed text-justify">
                Těsně před komunistickým převratem v roce 1949 poslal Watchman Nee Witnesse Leeho a
                další, kteří s ním spolupracovali v Číně, na Tchaj-wan, aby zajistili, že věci,
                které jim Pán svěřil, nepodlehnou zkáze. Watchman Nee pověřil Witnesse Leeho, aby
                pokračoval ve vydavatelské práci v zahraničí. Tak vzniklo nakladatelství Taiwan
                Gospel Book Room. Od té doby je Taiwan Gospel Book Room všeobecně uznávaným
                vydavatelem děl Watchmana Neeho mimo Čínu. Krátce nato se projevilo hojné Pánovo
                požehnání. Z 350 věřících, kteří právě uprchli z pevninské Číny, se místní církve
                během pěti let rozrostly na 20 000 věřících.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#071e46] mb-4 border-b-2 border-[#9b7d57] pb-2">
                SPOJENÉ STÁTY
              </h2>
              <p className="text-[#191817] text-[17px] leading-relaxed text-justify">
                V roce 1962 byl Witness Lee veden Pánem, aby přijel do Spojených států, kde se
                usadil v Los Angeles. Během své pětatřicetileté služby ve Spojených státech neúnavně
                sloužil na týdenních shromážděních a víkendových konferencích a pronesl několik
                tisíc poselství. Z těchto promluv bylo vydáno více než 400 knih. Mnohé z nich byly
                přeloženy do více než čtrnácti jazyků. Svou poslední konferenci vedl v únoru 1997 ve
                věku jedenadevadesáti let.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#071e46] mb-4 border-b-2 border-[#9b7d57] pb-2">
                DÍLO
              </h2>
              <p className="text-[#191817] text-[17px] leading-relaxed text-justify mb-4">
                Zanechává po sobě bohatý výklad biblické pravdy. Jeho hlavní dílo Studium života v
                Bibli obsahuje více než 25 000 stran komentářů ke všem biblickým knihám, které jsou
                zpracovány z hlediska potěšení a zkušenosti věřících s božským životem v Kristu
                skrze Ducha Svatého. Pod vedením Witnesse Leeho byla do angličtiny přeložena celá
                Bible (Recovery Version) a byl také šéfredaktorem čínského překladu Nového zákona.
                Recovery Version byla přeložena i do dalších jazyků. Sestavil rozsáhlé poznámky pod
                čarou, osnovy a odkazy, které se týkají duchovních témat. Ve Spojených státech je
                možné poslouchat jeho poselství na křesťanských rozhlasových stanicích. Witness Lee
                založil v roce 1965 neziskovou společnost Living Stream Ministry se sídlem v
                Anaheimu v Kalifornii, která oficiálně zastupuje službu Witnesse Leeho a Watchmana
                Neeho.
              </p>

              <div className="bg-[#f0f8ff] p-4 rounded-lg border border-[#2bb2e6]">
                <h3 className="text-lg font-semibold text-[#071e46] mb-2">Významná díla:</h3>
                <ul className="text-[#191817] space-y-1">
                  <li>
                    • <strong>Studium života v Bibli</strong> - více než 25 000 stran komentářů
                  </li>
                  <li>
                    • <strong>Recovery Version</strong> - překlad Bible s poznámkami
                  </li>
                  <li>
                    • <strong>Více než 400 knih</strong> z jeho poselství
                  </li>
                  <li>
                    • <strong>Living Stream Ministry</strong> - založeno v roce 1965
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#071e46] mb-4 border-b-2 border-[#9b7d57] pb-2">
                SLUŽBA
              </h2>
              <div className="bg-[#edeae4] p-6 rounded-lg border-l-4 border-[#9b7d57]">
                <p className="text-[#191817] text-[17px] leading-relaxed text-justify">
                  Witness Lee ve své službě zdůrazňuje prožívání Krista jako života a praktickou
                  jednotu věřících jako Těla Kristova. Tím, že zdůrazňoval důležitost péče o oba
                  tyto aspekty, vedl místní církve, které měl na starosti, k růstu v křesťanském
                  životě a funkčnosti. Witness Lee byl neochvějně přesvědčen, že Božím cílem není
                  úzkoprsé sektářství, ale Tělo Kristovo. V reakci na toto přesvědčení se věřící
                  začali jednoduše scházet jako církev ve svých městech. V nedávné minulosti vznikly
                  nové místní církve v Rusku a v mnoha východoevropských zemích.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#071e46] mb-4 border-b-2 border-[#9b7d57] pb-2">
                ODKAZ
              </h2>
              <p className="text-[#191817] text-[17px] leading-relaxed text-justify">
                Witness Lee zemřel v roce 1997, ale jeho služba a učení pokračuje prostřednictvím
                Living Stream Ministry a místních církví po celém světě. Jeho důraz na prožívání
                Krista jako života a praktickou jednotu věřících ovlivnil tisíce křesťanů napříč
                kontinenty. Jeho knihy a poselství jsou stále studovány a aplikovány věřícími, kteří
                hledají hlubší zkušenost s Kristem a praktický církevní život.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
