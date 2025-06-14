'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const WitnessLee = () => {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4">
      <button
        className="inline-flex items-center px-4 my-8 py-2 bg-[#2bb2e6] !text-white rounded hover:bg-[#218334] transition-colors duration-200"
        onClick={() => router.back()}
      >
        ← Zpět
      </button>

      <div className="my-3 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#071e46] mb-8 text-center">Witness Lee</h1>

        <div className="space-y-8">
          <section>
            <p className="text-[#191817] text-[17px] leading-relaxed text-justify">
              Witness Lee se narodil v roce 1905 v severní Číně a vyrůstal v křesťanské rodině. V
              devatenácti letech byl zcela uchvácen Kristem a okamžitě se rozhodl zasvětit svůj
              život kázání evangelia. Na počátku své služby se setkal se známým kazatelem, učitelem
              a spisovatelem Watchmanem Neem. Witness Lee spolupracoval s Watchmanem Neem pod jeho
              vedením. Počátkem roku 1934 mu Watchman Nee svěřil vedení svého nakladatelství
              Shanghai Gospel Book Room.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-[#071e46] mb-4 border-b-2 border-[#9b7d57] pb-2">
              TCHAJ-WAN
            </h3>
            <p className="text-[#191817] text-[17px] leading-relaxed text-justify">
              Těsně před komunistickým převratem v roce 1949 poslal Watchman Nee Witnesse Leeho a
              další, kteří s ním spolupracovali v Číně, na Tchaj-wan, aby zajistili, že věci, které
              jim Pán svěřil, nepodlehnou zkáze. Watchman Nee pověřil Witnesse Leeho, aby pokračoval
              ve vydavatelské práci v zahraničí. Tak vzniklo nakladatelství Taiwan Gospel Book Room.
              Od té doby je Taiwan Gospel Book Room všeobecně uznávaným vydavatelem děl Watchmana
              Neeho mimo Čínu. Krátce nato se projevilo hojné Pánovo požehnání. Z 350 věřících,
              kteří právě uprchli z pevninské Číny, se místní církve během pěti let rozrostly na 20
              000 věřících.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-[#071e46] mb-4 border-b-2 border-[#9b7d57] pb-2">
              SPOJENÉ STÁTY
            </h3>
            <p className="text-[#191817] text-[17px] leading-relaxed text-justify">
              V roce 1962 byl Witness Lee veden Pánem, aby přijel do Spojených států, kde se usadil
              v Los Angeles. Během své pětatřicetileté služby ve Spojených státech neúnavně sloužil
              na týdenních shromážděních a víkendových konferencích a pronesl několik tisíc
              poselství. Z těchto promluv bylo vydáno více než 400 knih. Mnohé z nich byly přeloženy
              do více než čtrnácti jazyků. Svou poslední konferenci vedl v únoru 1997 ve věku
              jedenadevadesáti let.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-[#071e46] mb-4 border-b-2 border-[#9b7d57] pb-2">
              DÍLO
            </h3>
            <p className="text-[#191817] text-[17px] leading-relaxed text-justify">
              Zanechává po sobě bohatý výklad biblické pravdy. Jeho hlavní dílo Studium života v
              Bibli obsahuje více než 25 000 stran komentářů ke všem biblickým knihám, které jsou
              zpracovány z hlediska potěšení a zkušenosti věřících s božským životem v Kristu skrze
              Ducha Svatého. Pod vedením Witnesse Leeho byla do angličtiny přeložena celá Bible
              (Recovery Version) a byl také šéfredaktorem čínského překladu Nového zákona. Recovery
              Version byla přeložena i do dalších jazyků. Sestavil rozsáhlé poznámky pod čarou,
              osnovy a odkazy, které se týkají duchovních témat. Ve Spojených státech je možné
              poslouchat jeho poselství na křesťanských rozhlasových stanicích. Witness Lee založil
              v roce 1965 neziskovou společnost Living Stream Ministry se sídlem v Anaheimu v
              Kalifornii, která oficiálně zastupuje službu Witnesse Leeho a Watchmana Neeho.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-[#071e46] mb-4 border-b-2 border-[#9b7d57] pb-2">
              SLUŽBA
            </h3>
            <div className="bg-[#edeae4] p-6 rounded-lg border-l-4 border-[#9b7d57]">
              <p className="text-[#191817] text-[17px] leading-relaxed text-justify">
                Witness Lee ve své službě zdůrazňuje prožívání Krista jako života a praktickou
                jednotu věřících jako Těla Kristova. Tím, že zdůrazňoval důležitost péče o oba tyto
                aspekty, vedl místní církve, které měl na starosti, k růstu v křesťanském životě a
                funkčnosti. Witness Lee byl neochvějně přesvědčen, že Božím cílem není úzkoprsé
                sektářství, ale Tělo Kristovo. V reakci na toto přesvědčení se věřící začali
                jednoduše scházet jako církev ve svých městech. V nedávné minulosti vznikly nové
                místní církve v Rusku a v mnoha východoevropských zemích.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default WitnessLee
