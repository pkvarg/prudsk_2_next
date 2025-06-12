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

          <p className="text-[#9b7d57] text-[17px] leading-relaxed mb-8">
            Distribuce Proud se zaměřuje na šíření křesťanské literatury s cílem zpřístupnit ji všem
            hledajícím lidem. Konkrétně se jedná o distribuci publikací společnosti Living Stream
            Ministry, která vydává především díla Watchmana Neeho a Witnesse Leeho. Naším posláním
            je přinášet bohatství Božího slova všem věřícím v zemi, včetně pořádání seminářů a
            konferencí za účelem prezentace těchto publikací. Naším cílem je dodávat duchovní pokrm
            jako výživu všem věřícím, aby mohli růst v božském životě pro budování Těla Kristova.
          </p>

          <h3 className="text-[#071e46] font-bold text-xl md:text-2xl mb-4">
            O LIVING STREAM MINISTRY (LSM)
          </h3>
          <p className="text-[#9b7d57] text-[17px] leading-relaxed mb-8">
            LSM je nezisková společnost, která se věnuje především vydávání služby Watchmana Neeho a
            Witnesse Leeho. Stejně jako tito dva služebníci Pána Ježíše Krista věrně rozvíjeli odkaz
            služby, který Pán předal církvi, je záměrem LSM následovat jejich věrný příklad a šířit
            Kristovo bohatství pro budování Těla Kristova. LSM má jediný cíl: dodávat duchovní pokrm
            jako výživu všem věřícím, aby mohli růst v božském životě pro budování Těla Kristova.
          </p>

          <h3 className="text-[#071e46] font-bold text-xl md:text-2xl mb-4">Naše víra</h3>

          <div className="space-y-4">
            <p className="text-[#9b7d57] text-[17px] leading-relaxed">
              Naše víra je založena na svaté Bibli, která je Božím Slovem.
            </p>

            <p className="text-[#9b7d57] text-[17px] leading-relaxed">
              Bibli považujeme za úplné a jedinečné božské zjevení.
            </p>

            <p className="text-[#9b7d57] text-[17px] leading-relaxed">
              Pevně věříme, že Bůh je navěky jeden a zároveň je navěky Otec, Syn a Duch, přičemž ti
              tři jsou odlišní, ale neoddělitelní.
            </p>

            <p className="text-[#9b7d57] text-[17px] leading-relaxed">
              Věříme, že Kristus je úplný Bůh i dokonalý člověk. Aniž by se vzdal svého božství, byl
              počat v lůně lidské panny, žil opravdovým lidským životem na zemi a zemřel zástupnou a
              všezahrnující smrtí na kříži. Po třech dnech tělesně vstal z mrtvých a vystoupil do
              nebes. Nyní je ve slávě, plně Bůh, a přece stále plně člověk. Vyhlížíme Jeho blízký
              návrat s Božím královstvím, jehož prostřednictvím bude vládnout zemi během tisíciletí
              a ve věčnosti.
            </p>

            <p className="text-[#9b7d57] text-[17px] leading-relaxed">
              Vyznáváme, že třetí z Trojice, Duch, je stejně Bohem. Vše, co má a čím je Otec, je
              vyjádřeno v Synu, a vše, co má a čím je Syn, se stává skutečností v Duchu.
            </p>

            <p className="text-[#9b7d57] text-[17px] leading-relaxed">
              Dále věříme, že lidstvo potřebuje Boží spásu. Ačkoli jsme byli zcela neschopní naplnit
              těžké požadavky Boží spravedlnosti, svatosti a slávy, Kristus všechny požadavky
              naplnil skrze svou smrt na kříži. Díky Kristově smrti nám Bůh odpustil naše hříchy,
              smířil nás sám se sebou a ospravedlnil nás tím, že učinil Krista naší spravedlností.
              Na základě Kristova vykoupení Bůh znovuzrozuje vykoupené svým Duchem, aby završil svou
              spásu, aby se mohli stát Jeho dětmi.
            </p>

            <p className="text-[#9b7d57] text-[17px] leading-relaxed">
              Věřící, kteří nyní mají Boží život a přirozenost, se těší z každodenní spásy v Jeho
              Těle v tomto věku a z věčné spásy v budoucím věku a ve věčnosti. Ve věčnosti budeme
              přebývat spolu s Bohem v Novém Jeruzalémě, završení Boží spásy Jeho vyvolených.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
