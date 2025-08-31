// app/witness-lee/page.js (Server Component)
import Link from 'next/link'

// Enhanced metadata for SEO
export const metadata = {
  title: 'Witness Lee - Životopis a služba | Prúd života',
  description:
    'Oboznámte sa so životom a službou Witness Lee, významného kresťanského učiteľa a spolupracovníka Watchmana Nee. Jeho služba v Číne, Taiwane a USA.',
  keywords:
    'Witness Lee, kresťanský učiteľ, kresťanský spisovateľ, Living Stream Ministry, Recovery Version, Štúdium života, miestne cirkvi, Watchman Nee, kresťanské knihy',
  openGraph: {
    title: 'Witness Lee - Životopis a služba | Prúd života',
    description:
      'Životopis Witness Lee, významného kresťanského učiteľa a spolupracovníka Watchmana Nee. Jeho služba a dielo.',
    type: 'article',
    url: 'https://prud.sk/witness-lee',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Witness Lee - Životopis a služba',
    description:
      'Životopis Witness Lee, významného kresťanského učiteľa a spolupracovníka Watchmana Nee',
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
    canonical: 'https://prud.sk/witness-lee',
  },
}

export default function WitnessLeePage() {
  // Generate JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Witness Lee - Životopis a služba',
    description:
      'Životopis Witness Lee, významného kresťanského učiteľa a spolupracovníka Watchmana Nee. Jeho služba a dielo.',
    author: {
      '@type': 'Organization',
      name: 'Prúd života',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Prúd života',
      logo: {
        '@type': 'ImageObject',
        url: 'https://prud.sk/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://prud.sk/witness-lee',
    },
    about: {
      '@type': 'Person',
      name: 'Witness Lee',
      description: 'Kresťanský učiteľ, kazateľ a spisovateľ',
      birthDate: '1905',
      deathDate: '1997',
      nationality: 'Chinese',
      occupation: 'Kresťanský učiteľ a spisovateľ',
      knowsAbout: ['Kresťanstvo', 'Biblia', 'Duchovný život', 'Miestne cirkvi'],
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
          name: 'Domov',
          item: 'https://prud.sk',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Witness Lee',
          item: 'https://prud.sk/witness-lee',
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
            Späť
          </Link>
        </div>

        <div className="my-3 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-[#071e46] mb-8 text-center">Witness Lee</h1>

          {/* Introduction */}
          <div className="mb-8 p-6 bg-[#f8f9fa] rounded-lg border-l-4 border-[#9b7d57]">
            <p className="text-[#191817] text-lg leading-relaxed">
              <strong>Witness Lee (1905-1997)</strong> bol významný kresťanský učiteľ, kazateľ a
              spisovateľ. Spolupracoval s Watchmanom Neem a pokračoval v jeho diele, slúžil v Číne,
              Taiwane a neskôr v Spojených štátoch.
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-[#071e46] mb-4 border-b-2 border-[#9b7d57] pb-2">
                O AUTOROVI
              </h2>
              <p className="text-[#191817] text-[17px] leading-relaxed text-justify">
                Witness Lee sa narodil v roku 1905 v severnej Číne a vyrastal v kresťanskej rodine.
                Vo svojich devätnástich rokoch bol plne uchvátený Kristom a okamžite sa rozhodol
                zasvätiť celý svoj život kázaniu evanjelia. Na počiatku svojej služby sa stretol s
                Watchmanom Nee, známym kazateľom, učiteľom a spisovateľom. Witness Lee pracoval
                spoločne s Watchmana Nee pod jeho vedením. Začiatkom roku 1934 Watchman Nee zveril
                Witnessovi Lee vedenie svojej publikačnej činnosti v Šanghajskom vydavateľstve
                Dobrej Zvesti (Shanghai Gospel Book Room).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#071e46] mb-4 border-b-2 border-[#9b7d57] pb-2">
                TAIWAN
              </h2>
              <p className="text-[#191817] text-[17px] leading-relaxed text-justify">
                Tesne pred komunistickým prevratom v roku 1949 Watchman Nee vyslal Witnessa Lee a
                ďalších, ktorí s ním spolupracovali v Číne, na Taiwan, aby tak bolo zaistené, že
                veci, ktoré im boli zverené Pánom, nepodľahnú skaze. Watchman Nee poveril Witnessa
                Lee, aby pokračoval v doterajšej vydavateľskej činnosti v zahraničí. Tak vzniklo
                vydavateľstvo Taiwan Gospel Book Room. Od toho momentu je Taiwan Gospel Book Room
                všeobecne uznávaným vydavateľstvom diel Watchmana Nee mimo Číny. Krátko nato, sa
                prejavilo Pánovo hojné požehnanie. Z 350 veriacich, ktorí práve ušli z
                kontinentálnej Číny vzrástli cirkvi na 20 tisíc veriacich počas piatich rokov.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#071e46] mb-4 border-b-2 border-[#9b7d57] pb-2">
                USA
              </h2>
              <p className="text-[#191817] text-[17px] leading-relaxed text-justify">
                V roku 1962 bol Witness Lee vedený Pánom na pricestovanie do USA, kde sa usadil v
                Los Angeles. Počas tridsiatich piatich rokov služby v USA neúnavne slúžil na
                týždňových stretnutiach a víkendových konferenciách, a predniesol niekoľko tisíc
                posolstiev. Z týchto promluv bolo vydaných viac ako 400 kníh. Mnohé z nich boli
                preložené do viac ako štrnástich jazykov. Svoju poslednú konferenciu viedol v
                februári 1997 vo veku deväťdesiatjeden rokov.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#071e46] mb-4 border-b-2 border-[#9b7d57] pb-2">
                DIELO
              </h2>
              <p className="text-[#191817] text-[17px] leading-relaxed text-justify mb-4">
                Zanecháva po sebe bohatý výklad biblickej pravdy. Jeho hlavné dielo Štúdium života
                v Biblii obsahuje viac ako 25 000 strán komentárov ku všetkým biblickým knihám,
                ktoré sú spracované z hľadiska potešenia a skúsenosti veriacich s božským životom v
                Kristovi skrze Ducha Svätého. Pod vedením Witnessa Lee bola do angličtiny
                preložená celá Biblia (Recovery Version) a bol aj šéfredaktorom čínskeho prekladu
                Nového zákona. Recovery Version bola preložená aj do ďalších jazykov. Zostavil
                rozsiahle poznámky pod čiarou, osnovy a odkazy, ktoré sa týkajú duchovných tém. V
                Spojených štátoch je možné počúvať jeho posolstvá na kresťanských rozhlasových
                staniciach. Witness Lee založil v roku 1965 neziskovú spoločnosť Living Stream
                Ministry so sídlom v Anaheime v Kalifornii, ktorá oficiálne zastupuje službu
                Witnessa Lee a Watchmana Nee.
              </p>

              <div className="bg-[#f0f8ff] p-4 rounded-lg border border-[#2bb2e6]">
                <h3 className="text-lg font-semibold text-[#071e46] mb-2">Významné diela:</h3>
                <ul className="text-[#191817] space-y-1">
                  <li>
                    • <strong>Štúdium života v Biblii</strong> - viac ako 25 000 strán komentárov
                  </li>
                  <li>
                    • <strong>Recovery Version</strong> - preklad Biblie s poznámkami
                  </li>
                  <li>
                    • <strong>Viac ako 400 kníh</strong> z jeho posolstiev
                  </li>
                  <li>
                    • <strong>Living Stream Ministry</strong> - založené v roku 1965
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
                  Witness Lee vo svojej službe zdôrazňuje prožívanie Krista ako života a
                  praktickú jednotu veriacich ako Tela Kristovho. Tým, že zdôrazňoval dôležitosť
                  starostlivosti o oba tieto aspekty, viedol miestne cirkvi, ktoré mal na
                  starosti, k rastu v kresťanskom živote a funkčnosti. Witness Lee bol neochvejne
                  presvedčený, že Božím cieľom nie je úzkoprsé sektárstvo, ale Telo Kristovo. V
                  reakcii na toto presvedčenie sa veriaci začali jednoducho schádzať ako cirkev vo
                  svojich mestách. V nedávnej minulosti vznikli nové miestne cirkvi v Rusku a v
                  mnohých východoeurópskych krajinách.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#071e46] mb-4 border-b-2 border-[#9b7d57] pb-2">
                ODKAZ
              </h2>
              <p className="text-[#191817] text-[17px] leading-relaxed text-justify">
                Witness Lee zomrel v roku 1997, ale jeho služba a učenie pokračuje prostredníctvom
                Living Stream Ministry a miestnych cirkví po celom svete. Jeho dôraz na prožívanie
                Krista ako života a praktickú jednotu veriacich ovplyvnil tisíce kresťanov naprieč
                kontinentmi. Jeho knihy a posolstvá sú stále študované a aplikované veriacimi, ktorí
                hľadajú hlbšiu skúsenosť s Kristom a praktický cirkevný život.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
