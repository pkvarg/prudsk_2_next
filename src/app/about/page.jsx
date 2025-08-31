'use client'
import React, { useLayoutEffect } from 'react'

const About = () => {
  useLayoutEffect(() => {
    window.scrollTo(0, 200)
  })

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-3 md:px-0">
        <div className="my-3 py-8">
          <h1 className="text-[#071e46] font-bold text-2xl md:text-3xl mb-6">O nás</h1>

          <p className="text-[#191817] text-[17px] leading-relaxed mb-8">
            Prúd je neziskovým združením založeným s úmyslom šírenia klasickej kresťanskej literatúry s
            cieľom sprístupnenia týchto publikácií všetkým hľadajúcim ľuďom. Sústreďuje sa na distribúciu
            publikácií Living Stream Ministry, ktoré publikuje hlavne diela Watchmana Nee a Witnessa Lee.
            Našim poslaním je priniesť bohatstvá Božieho Slova všetkým veriacim na Slovensku,
            organizovaním seminárov a konferencií za účelom prezentovania týchto publikácií. Našim cieľom
            je zásobovať duchovnou stravou, ako výživou, všetkých veriacich, aby takto mohli rásť v
            božskom živote pre budovanie Tela Kristovho.
          </p>

          <h3 className="text-[#071e46] font-bold text-xl md:text-2xl mb-4">
            O LIVING STREAM MINISTRY (LSM)
          </h3>
          <p className="text-[#191817] text-[17px] leading-relaxed mb-8">
            LSM je neziskovým združením, ktoré sa venuje hlavne publikovaniu posluhovania – služby
            Watchmana Nee a Witnessa Lee. Rovnako ako títo dvaja služobníci Pána Ježiša Krista verne
            rozvíjali dedičstvo posluhovania, ktoré Pán odovzdal cirkvi, je aj zámerom LSM nasledovať
            ich verný príklad tým, že budú distribuovať bohatstvá Krista pre budovanie Tela Kristovho.
            LSM má jeden cieľ: zásobovať duchovnou stravou ako výživou všetkých veriacich, aby takto
            mohli rásť v božskom živote k budovaniu Tela Kristovho.
          </p>

          <h3 className="text-[#071e46] font-bold text-xl md:text-2xl mb-4">Naša viera</h3>

          <div className="space-y-4">
            <p className="text-[#191817] text-[17px] leading-relaxed">
              Zachovávame všeobecnú vieru, ktorá je zdieľaná všetkými veriacimi kresťanmi, obsah ktorej
              bol ustanovený raz a navždy v Starom a Novom Zákone.
            </p>

            <p className="text-[#191817] text-[17px] leading-relaxed">
              Konkrétne je táto všeobecná, viera zostavená z nasledujúcich faktov, v ktoré veríme, v
              súvislosti s Bibliou, Bohom, Kristom, spásou a večnosťou: Považujeme Bibliu za úplné a
              jediné božské zjavenie.
            </p>

            <p className="text-[#191817] text-[17px] leading-relaxed">
              Pevne veríme, že Boh je večne jeden a tiež večne Otcom, Synom a Duchom – traja, ktorí sú
              odlišní avšak neoddeliteľní.
            </p>

            <p className="text-[#191817] text-[17px] leading-relaxed">
              Veríme, že Kristus je úplný Boh i dokonalý človek. Bez opustenia Svojho božstva bol počatý
              v lone ľudskej panny, žil naozajstným ľudským životom na zemi a zomrel zástupnú a všetko
              zahŕňajúcu smrť na kríži. Po troch dňoch vstal telesne z mŕtvych a vystúpil do nebies.
              Teraz je v sláve, plne Boh a stále plne človek. Očakávame Jeho blízky príchod s Božím
              kráľovstvom, skrze ktoré bude vládnuť nad zemou v miléniu a vo večnosti.
            </p>

            <p className="text-[#191817] text-[17px] leading-relaxed">
              Vyznávame, že tretí z Trojice, Duch, je takisto Bohom. Všetko, čo Otec má a je, je
              vyjadrené Synom a všetko, čo Syn má a je, je uskutočnené ako Duch.
            </p>

            <p className="text-[#191817] text-[17px] leading-relaxed">
              Ďalej veríme, že ľudstvo potrebuje Božiu spásu. Keďže sme boli úplne neschopní naplniť
              ťažké požiadavky Božej spravodlivosti, svätosti a slávy, Kristus všetky požiadavky naplnil
              Svojou smrťou na kríži. Kvôli Kristovej smrti nám Boh odpustil naše hriechy, zmieril nás
              so sebou samým a ospravedlnil nás tým, že Krista učinil našou spravodlivosťou. Na základe
              Kristovho vykúpenia Boh obrodzuje vykúpených Svojím Duchom pre dovŕšenie svoje spásy, aby
              sa mohli stať Jeho deťmi.
            </p>

            <p className="text-[#191817] text-[17px] leading-relaxed">
              Majúc teraz Boží život a prirodzenosť, veriaci vychutnávajú každodennú spásu v Jeho Tele v
              tomto veku a večnú spásu v prichádzajúcom veku a vo večnosti. Vo večnosti budeme prebývať
              s Bohom v Novom Jeruzaleme, dovŕšení Božej spásy Jeho vyvolených.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
