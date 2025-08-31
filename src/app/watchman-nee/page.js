// app/watchman-nee/page.js (Server Component)
import Link from 'next/link'
import BackButton from '../components/BackButton'

// Enhanced metadata for SEO
export const metadata = {
  title: 'Watchman Nee - Životopis a služba | Prúd života',
  description:
    'Oboznámte sa so životom a službou Watchmana Nee, významného kresťanského kazateľa a spisovateľa. Jeho viera, uväznenie a odkaz pre cirkev.',
  keywords:
    'Watchman Nee, kresťanský kazateľ, kresťanský spisovateľ, cirkev, duchovná literatúra, kresťanské knihy, Biblia, služba Pánovi, viera, uväznenie pre vieru',
  openGraph: {
    title: 'Watchman Nee - Životopis a služba | Prúd života',
    description:
      'Životopis Watchmana Nee, významného kresťanského kazateľa a spisovateľa. Jeho viera, služba a uväznenie pre Krista.',
    type: 'article',
    url: 'https://prud.sk/watchman-nee',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Watchman Nee - Životopis a služba',
    description: 'Životopis Watchmana Nee, významného kresťanského kazateľa a spisovateľa',
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
    canonical: 'https://prud.sk/watchman-nee',
  },
}

export default function WatchmanNeePage() {
  // Generate JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Watchman Nee - Životopis a služba',
    description:
      'Životopis Watchmana Nee, významného kresťanského kazateľa a spisovateľa. Jeho viera, služba a uväznenie pre Krista.',
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
      '@id': 'https://prud.sk/watchman-nee',
    },
    about: {
      '@type': 'Person',
      name: 'Watchman Nee',
      description: 'Kresťanský kazateľ, učiteľ a spisovateľ',
      birthDate: '1903',
      deathDate: '1972-05-30',
      nationality: 'Chinese',
      occupation: 'Kresťanský kazateľ a spisovateľ',
      knowsAbout: ['Kresťanstvo', 'Biblia', 'Duchovný život', 'Cirkev'],
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
          name: 'Watchman Nee',
          item: 'https://prud.sk/watchman-nee',
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
          <h1 className="text-4xl font-bold text-[#071e46] mb-8 text-center">Watchman Nee</h1>

          {/* Introduction */}
          <div className="mb-8 p-6 bg-[#f8f9fa] rounded-lg border-l-4 border-[#9b7d57]">
            <p className="text-[#191817] text-lg leading-relaxed">
              <strong>Watchman Nee (1903-1972)</strong> bol významný kresťanský kazateľ, učiteľ a
              spisovateľ z Číny. Jeho život bol poznamenaný hlbokou vierou v Krista, službou
              miestnym cirkvám a nakoniec uväznením pre svoju vieru.
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-[#071e46] mb-4 border-b-2 border-[#9b7d57] pb-2">
                ZAČIATKY SLUŽBY
              </h2>
              <p className="text-[#191817] text-[17px] leading-relaxed text-justify">
                Watchman Nee čoskoro po svojej spáse začal milovať Pána a mal veľkú túžbu kázať
                evanjelium svojim spolužiakom a krajanom vhod či nevhod. Vďaka jeho kázaniu boli
                takmer všetci jeho spolužiaci privedení k Pánovi a v roku 1923 nastalo na jeho škole
                prebudenie, ktoré sa široko rozšírilo medzi ľuďmi v jeho meste. Stovky ľudí boli
                zachránené a ich životy sa zmenili. Watchman Nee nenavštevoval žiadnu teologickú
                školu ani biblický inštitút. Väčšinu toho, čo sa naučil o Kristovi, duchovných
                veciach a dejinách cirkvi, získal štúdiom Biblie a čítaním kníh duchovných ľudí.
                Watchman Nee bol nielen skvelým študentom Biblie, ale aj čitateľom duchovnej
                literatúry. Mal pozoruhodný dar vyberať, porozumieť, rozlišovať a zapamätať si ten
                správny materiál. Dokázal okamžite pochopiť hlavné body akejkoľvek knihy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#071e46] mb-4 border-b-2 border-[#9b7d57] pb-2">
                ŽIVÁ VIERA
              </h2>
              <p className="text-[#191817] text-[17px] leading-relaxed text-justify">
                Kvôli pracovnému preťaženiu a nedostatočnej fyzickej starostlivosti ochorel Watchman
                Nee v roku 1924 na tuberkulózu. Situácia bola natoľko vážna, že sa rozšírili
                nepravdivé správy o jeho smrti. Počas svojej choroby sa naučil dôverovať Bohu
                ohľadom svojej existencie a Boh sa oň verne staral. Boh ho milostivo uzdravil z
                tuberkulózy, ale vo svojej zvrchovanosti mu ponechal anginu pectoris. Každú chvíľu
                mohol zomrieť. To ho však spontánne priviedlo k úplnej dôvere v Pána. V každom
                okamihu žil z viery v Boha a po celé roky až do svojej smrti ho Boh zaopatrieval
                svojou milostivou starostlivosťou a životom vzkriesenia. Skrze tieto fyzické
                ťažkosti zakúšal Boha a tešil sa z Neho oveľa viac, ako by bolo možné bez nich.
                Božie uzdravenie, ktoré Watchman Nee zažil, nebolo len zázračným Božím činom, ale
                bolo to pôsobenie života vzkriesenia skrze milosť uplatňovania živej viery vo verné
                Božie Slovo pre budovanie a rast v živote. Nebol to len zázrak Božej moci, bola to
                úplne záležitosť milosti a božského života.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#071e46] mb-4 border-b-2 border-[#9b7d57] pb-2">
                ŽIVOT A DIELO
              </h2>
              <p className="text-[#191817] text-[17px] leading-relaxed text-justify">
                Kedykoľvek bola Watchmanovi Nee položená nejaká otázka, jeho odpoveď bola vždy
                praktická, vecná, jasná, plná pomazania a svetla. Jeho správanie bolo veľmi
                prirodzené a otvorené; bol to človek ľahko prístupný. Mal široké srdce. V duchovných
                otázkach stúpal k výšinám a dotýkal sa hlbín. Mal bohaté znalosti a skúsenosti vo
                veciach týkajúcich sa Božích princípov a Božieho zámeru. Vždy pôsobil príjemným
                dojmom, ale vždy vzbuzoval úctu. Jeho postoj bol mierny a pokojný a jeho slová boli
                plné pomazania. Pri rozhovore s ním nebol cítiť odstup, ale pocit osvieženia a
                podpory. Dojem, ktorý zanechal svojimi slovami a správaním, je nezabudnuteľný.
                Watchman Nee uvidel dôležitú vec týkajúcu sa našej služby: Nezáleží na kvantite, ale
                na kvalite. Skutočná služba je pretiekaním života.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-[#071e46] mb-4 border-b-2 border-[#9b7d57] pb-2">
                UVÄZNENIE
              </h2>
              <p className="text-[#191817] text-[17px] leading-relaxed text-justify mb-4">
                V februári 1949 sa Watchman Nee po dlhých modlitbách a úvahách rozhodol zostať v
                Šanghaji kvôli svojmu bremenu pre miestne cirkvi, spolupracovníkov a Pánovo
                svedectvo v pevninskej Číne. Na jednej strane plne dôveroval Pánovej zvrchovanosti,
                na druhej strane si bol vedomý nebezpečenstva a bol pripravený obetovať sa pre
                Pánovo svedectvo. Na jar 1952 bol pre svoju vieru zatknutý a uväznený a v lete 1956
                bol po dlhom procese odsúdený na pätnásť rokov väzenia. Nikdy však nebol prepustený.
                Počas jeho väznenia boli povolené len príležitostné návštevy jeho manželky. Zomrela
                7. novembra 1971. Watchman Nee bol jej smrťou hlboko zarmútený a úplne odrezaný od
                kontaktu s okolitým svetom. Čoskoro potom, 30. mája 1972, ukončil Watchman Nee svoje
                putovanie po tejto zemi a spočinul v Kristovi, ktorému slúžil aj za cenu svojho
                života. Pod vankúšom zanechal na kúsku papiera niekoľko riadkov písaných veľkým,
                roztrasseným písmom: &quot;Kristus je Syn Boží, ktorý zomrel pre vykúpenie
                hriešnikov a po troch dňoch vstal z mŕtvych. To je najväčšia pravda vo vesmíre.
                Umriem pre svoju vieru v Krista. Watchman Nee.&quot;
              </p>

              <div className="bg-[#edeae4] p-6 rounded-lg border-l-4 border-[#9b7d57]">
                <h3 className="text-lg font-semibold text-[#071e46] mb-3">Pamätné citáty</h3>
                <p className="text-[#191817] text-[17px] leading-relaxed text-justify italic mb-4">
                  &quot;Je dôležité, aby sme prijali Božie usporiadanie našich okolností. Je to
                  výchova Ducha Svätého. Jediný únik z Božieho usporiadania znamená stratu
                  príležitosti na zvýšenie našej kapacity. Veriaci človek nemôže nikdy zostať
                  rovnaký potom, čo prejde utrpením.&quot;
                </p>
                <p className="text-[#191817] text-[17px] leading-relaxed text-justify italic">
                  &quot;Keď som začal slúžiť Pánovi, mal som obavy o svojebytie. Pretože som však
                  mal kráčať po Pánovej ceste, spoliehal som sa na to, že ma hmotne zabezpečí On. V
                  rokoch 1921 a 1922 bolo v Číne len veľmi málo kazateľov, ktorí žili tak, že
                  spoliehali len na Pána. Keď som však vzhliadol k Pánovi, povedal mi: &apos;Ak
                  nedokážeš žiť z viery, nemôžeš pre mňa konať dielo.&apos; Vedel som, že aby som
                  mohol slúžiť živému Bohu, musím konať živé dielo a mať živú vieru. Boh sa postaral
                  o všetky moje potreby a nikdy nesklamal.&quot;
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
