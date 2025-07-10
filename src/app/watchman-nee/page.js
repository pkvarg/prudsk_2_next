// app/watchman-nee/page.js (Server Component)
import Link from 'next/link'
import BackButton from '../components/BackButton'

// Enhanced metadata for SEO
export const metadata = {
  title: 'Watchman Nee - Životopis a služba | Proud života',
  description:
    'Seznamte se s životem a službou Watchmana Neeho, významného křesťanského kazatele a spisovatele. Jeho víra, uvěznění a odkaz pro církev.',
  keywords:
    'Watchman Nee, křesťanský kazatel, křesťanský spisovatel, církev, duchovní literatura, křesťanské knihy, Bible, služba Pánu, víra, uvěznění pro víru',
  openGraph: {
    title: 'Watchman Nee - Životopis a služba | Proud života',
    description:
      'Životopis Watchmana Neeho, významného křesťanského kazatele a spisovatele. Jeho víra, služba a uvěznění pro Krista.',
    type: 'article',
    url: 'https://proudzivota.cz/watchman-nee',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Watchman Nee - Životopis a služba',
    description: 'Životopis Watchmana Neeho, významného křesťanského kazatele a spisovatele',
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
    canonical: 'https://proudzivota.cz/watchman-nee',
  },
}

export default function WatchmanNeePage() {
  // Generate JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Watchman Nee - Životopis a služba',
    description:
      'Životopis Watchmana Neeho, významného křesťanského kazatele a spisovatele. Jeho víra, služba a uvěznění pro Krista.',
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
      '@id': 'https://proudzivota.cz/watchman-nee',
    },
    about: {
      '@type': 'Person',
      name: 'Watchman Nee',
      description: 'Křesťanský kazatel, učitel a spisovatel',
      birthDate: '1903',
      deathDate: '1972-05-30',
      nationality: 'Chinese',
      occupation: 'Křesťanský kazatel a spisovatel',
      knowsAbout: ['Křesťanství', 'Bible', 'Duchovní život', 'Církev'],
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
          name: 'Watchman Nee',
          item: 'https://proudzivota.cz/watchman-nee',
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
          <h1 className="text-4xl font-bold text-[#071e46] mb-8 text-center">Watchman Nee</h1>

          {/* Introduction */}
          <div className="mb-8 p-6 bg-[#f8f9fa] rounded-lg border-l-4 border-[#9b7d57]">
            <p className="text-[#191817] text-lg leading-relaxed">
              <strong>Watchman Nee (1903-1972)</strong> byl významný křesťanský kazatel, učitel a
              spisovatel z Číny. Jeho život byl poznamenán hlubokou vírou v Krista, službou místním
              církvím a nakonec uvězněním pro svou víru.
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-[#071e46] mb-4 border-b-2 border-[#9b7d57] pb-2">
                POČÁTKY SLUŽBY
              </h2>
              <p className="text-[#191817] text-[17px] leading-relaxed text-justify">
                Watchman Nee brzy po svém spasení začal milovat Pána a měl velkou touhu kázat
                evangelium svým spolužákům a krajanům vhod či nevhod. Díky jeho kázání byli téměř
                všichni jeho spolužáci přivedeni k Pánu a v roce 1923 nastalo na jeho škole
                probuzení, které se široce rozšířilo mezi lidmi v jeho městě. Stovky lidí byly
                zachráněny a jejich životy se změnily. Watchman Nee nenavštěvoval žádnou teologickou
                školu ani biblický institut. Většinu toho, co se naučil o Kristu, duchovních věcech
                a dějinách církve, získal studiem Bible a četbou knih duchovních lidí. Watchman Nee
                byl nejen skvělým studentem Bible, ale také čtenářem duchovní literatury. Měl
                pozoruhodný dar vybírat, porozumět, rozlišovat a zapamatovat si ten správný
                materiál. Dokázal okamžitě pochopit hlavní body jakékoli knihy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#071e46] mb-4 border-b-2 border-[#9b7d57] pb-2">
                ŽIVÁ VÍRA
              </h2>
              <p className="text-[#191817] text-[17px] leading-relaxed text-justify">
                Kvůli pracovnímu přetížení a nedostatečné fyzické péči onemocněl Watchman Nee v roce
                1924 tuberkulózou. Situace byla natolik vážná, že se rozšířily falešné zprávy o jeho
                smrti. Během své nemoci se naučil důvěřovat Bohu ohledně své existence a Bůh se o
                něj věrně staral. Bůh ho milostivě uzdravil z tuberkulózy, ale ve své svrchovanosti
                mu ponechal s anginou pectoris. Každou chvíli mohl zemřít. To ho však spontánně
                přivedlo k naprosté důvěře v Pána. V každém okamžiku žil z víry v Boha a po celá
                léta až do své smrti ho Bůh zaopatřoval svou milostivou péčí a životem vzkříšení.
                Skrze tyto fyzické těžkosti zakoušel Boha a těšil se z Něj mnohem více, než by bylo
                možné bez nich. Boží uzdravení, které Watchman Nee zažil, nebylo jen zázračným Božím
                činem, ale bylo to působení života vzkříšení skrze milost uplatňování živé víry ve
                věrné Boží Slovo pro budování a růst v životě. Nebyl to jen zázrak Boží moci, byla
                to zcela záležitost milosti a božského života.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#071e46] mb-4 border-b-2 border-[#9b7d57] pb-2">
                ŽIVOT A DÍLO
              </h2>
              <p className="text-[#191817] text-[17px] leading-relaxed text-justify">
                Kdykoli byla Watchmanu Neemu položena nějaká otázka, jeho odpověď byla vždy
                praktická, věcná, jasná, plná pomazání a světla. Jeho chování bylo velmi přirozené a
                otevřené; byl to člověk snadno přístupný. Měl široké srdce. V duchovních otázkách
                stoupal k výšinám a dotýkal se hlubin. Měl bohaté znalosti a zkušenosti ve věcech
                týkajících se Božích principů a Božího záměru. Vždy působil příjemným dojmem, ale
                vždy vzbuzoval respekt. Jeho postoj byl mírný a klidný a jeho slova byla plná
                pomazání. Při rozhovoru s ním nebyl cítit odstup, ale pocit osvěžení a podpory.
                Dojem, který zanechal svými slovy a chováním, je nezapomenutelný. Watchman Nee
                uviděl důležitou věc týkající se naší služby: Nezáleží na kvantitě, ale na kvalitě.
                Skutečná služba je přetékáním života.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#071e46] mb-4 border-b-2 border-[#9b7d57] pb-2">
                UVĚZNĚNÍ
              </h2>
              <p className="text-[#191817] text-[17px] leading-relaxed text-justify mb-4">
                V únoru 1949 se Watchman Nee po dlouhých modlitbách a úvahách rozhodl zůstat v
                Šanghaji kvůli svému břemenu pro místní církve, spolupracovníky a Pánovo svědectví v
                pevninské Číně. Na jedné straně plně důvěřoval Pánově svrchovanosti, na druhé straně
                si byl vědom nebezpečí a byl připraven obětovat se pro Pánovo svědectví. Na jaře
                1952 byl pro svou víru zatčen a uvězněn a v létě 1956 byl po dlouhém procesu
                odsouzen k patnácti letům vězení. Nikdy však nebyl propuštěn. Během jeho věznění
                byly povoleny pouze příležitostné návštěvy jeho manželky. Zemřela 7. listopadu 1971.
                Watchman Nee byl její smrtí hluboce zarmoucen a zcela odříznut od kontaktu s okolním
                světem. Brzy poté, 30. května 1972, ukončil Watchman Nee své putování po této zemi a
                spočinul v Kristu, kterému sloužil i za cenu svého života. Pod polštářem zanechal na
                kousku papíru několik řádek psaných velkým, roztřeseným písmem: &quot;Kristus je Syn
                Boží, který zemřel pro vykoupení hříšníků a po třech dnech vstal z mrtvých. To je
                největší pravda ve vesmíru. Umírám pro svou víru v Krista. Watchman Nee.&quot;
              </p>

              <div className="bg-[#edeae4] p-6 rounded-lg border-l-4 border-[#9b7d57]">
                <h3 className="text-lg font-semibold text-[#071e46] mb-3">Památné citáty</h3>
                <p className="text-[#191817] text-[17px] leading-relaxed text-justify italic mb-4">
                  &quot;Je důležité, abychom přijali Boží uspořádání našich okolností. Je to výchova
                  Ducha Svatého. Pouhý jeden únik z Božího uspořádání znamená ztrátu příležitosti ke
                  zvýšení naší kapacity. Věřící člověk nemůže nikdy zůstat stejný poté, co projde
                  utrpením.&quot;
                </p>
                <p className="text-[#191817] text-[17px] leading-relaxed text-justify italic">
                  &quot;Když jsem začal sloužit Pánu, měl jsem obavy o své živobytí. Protože jsem
                  však měl kráčet po Pánově cestě, spoléhal jsem na to, že mě hmotně zajistí On. V
                  letech 1921 a 1922 bylo v Číně jen velmi málo kazatelů, kteří žili tak, že
                  spoléhali pouze na Pána. Když jsem však vzhlédl k Pánu, řekl mi: &apos;Pokud
                  nedokážeš žít z víry, nemůžeš pro mě konat dílo.&apos; Věděl jsem, že abych mohl
                  sloužit živému Bohu, musím konat živé dílo a mít živou víru. Bůh se postaral o
                  všechny mé potřeby a nikdy nezklamal.&quot;
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
