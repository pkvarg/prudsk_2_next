'use client'
import React, { useLayoutEffect } from 'react'

const SafetyPrivacy = () => {
  useLayoutEffect(() => {
    window.scrollTo(0, 200)
  })

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-3 md:px-0">
        <div className="my-3 py-8">
          <h1 className="text-[#071e46] font-bold text-2xl md:text-3xl mb-6">
            Bezpečnosť a súkromie
          </h1>

          <h3 className="text-[#071e46] font-bold text-xl md:text-2xl mb-4">
            Ochrana osobných údajov na prud.sk
          </h3>

          <p className="text-[#191817] text-[17px] leading-relaxed mb-6">
            Prevádzkovateľom internetovej stránky prud.sk je: Občianske združenie Prúd (ďalej len
            "Prevádzkovateľ"), Špieszova 5, 841 04 Bratislava, admin@prud.sk
          </p>

          <p className="text-[#191817] text-[17px] leading-relaxed mb-6">
            IČO: 360 765 89, DIČ: 202 202 8173.
          </p>

          <p className="text-[#191817] text-[17px] leading-relaxed mb-6">
            Ochrana fyzických osôb v súvislosti so spracúvaním osobných údajov patrí medzi základné
            práva. V článku 8 ods. 1 Charty základných práv Európskej únie a v článku 16 ods. 1
            Zmluvy o fungovaní Európskej únie sa stanovuje, že každý má právo na ochranu osobných
            údajov, ktoré sa ho týkajú.
          </p>

          <p className="text-[#191817] text-[17px] leading-relaxed mb-6">
            Aby sme Vám mohli poskytnúť všetky služby, potrebujeme o Vás vedieť základné informácie.
          </p>

          <p className="text-[#191817] text-[17px] leading-relaxed mb-6">
            Niektoré z nich majú povahu osobných údajov v zmysle zákona o ochrane osobných údajov a
            zmeny a doplnení niektorých zákonov, ktorému bolo v zbierke zákonov pridelené číslo
            18/2018 Z.z. a ktorým sa 25.05.2018 (ďalej len "zákon"). My sa týmto zákonom pri
            používaní Vašich údajov riadime.
          </p>

          <h4 className="text-[#071e46] font-semibold text-lg mb-3">
            Právny základ spracúvania osobných údajov:
          </h4>

          <p className="text-[#191817] text-[17px] leading-relaxed mb-4">
            a) spracúvanie osobných údajov je nevyhnutné podľa osobitného predpisu alebo
            medzinárodnej zmluvy, ktorou je Slovenská republika viazaná. Predovšetkým podľa zákona
            č. 222/2004 Z.z. o dani z pridanej hodnoty v znení neskorších predpisov
          </p>

          <p className="text-[#191817] text-[17px] leading-relaxed mb-4">
            b) spracúvanie osobných údajov je nevyhnutné na plnenie zmluvy a na základe oprávneného
            záujmu zákazníka. Prevádzkovateľ teda spracúva osobné údaje dotknutých osôb, za účelom
            vytvorenia príležitosti uzatvárať zmluvy uzavreté na diaľku alebo mimo prevádzkových
            priestorov na základe súhlasu so spracovaním osobných údajov dotknutých osôb. Pred
            nakupovaním v obchode je potrebné zaregistrovať sa. Pri registrácii a nakupovaní je
            potrebné poskytnúť nasledovné informácie o Vás:
          </p>

          <ul className="text-[#191817] text-[17px] leading-relaxed mb-6 ml-6 space-y-2">
            <li className="list-disc">
              meno a priezvisko, presná adresa vrátane krajiny (teda adresa, ktorá ma byť uvedená na
              faktúre)
            </li>
            <li className="list-disc">
              Vaša e-mailová adresa (slúži na Vašu identifikáciu v systéme a na komunikáciu s Vami v
              súvislosti s existujúcou objednávkou, prípadne informáciami o nových produktoch).
            </li>
            <li className="list-disc">
              voliteľne ďalšie adresy (ak si želáte doručiť zásielku na inú adresu ako je fakturačná)
            </li>
            <li className="list-disc">
              voliteľne telefónne číslo (pre rýchlejší kontakt s Vami)
            </li>
            <li className="list-disc">
              ak nakupujete ako firma / živnostník, naviac: obchodný názov, IČO a IČ DPH (pre
              vystavenie faktúry a správne zaúčtovanie).
            </li>
          </ul>

          <p className="text-[#191817] text-[17px] leading-relaxed mb-6">
            Tieto údaje sú uchovávané v databáze na našom serveri, aby ste ich nemuseli nanovo
            zapisovať pri každej návšteve. Vaše údaje spracovávame pre účely vybavenia a doručenia
            vašej objednávky. Tieto údaje sú taktiež nutné pre náš účtovný a fakturačný systém. Svoje
            údaje a ďalšie nastavenia môžete kedykoľvek zmeniť resp. aktualizovať prostredníctvom
            e-mailu alebo po prihlásení na našej stránke v sekcii Používateľský účet. V prípade, že
            si želáte zrušiť svoju registráciu, požiadajte nás o to e-mailom. Vaše konto bude zrušené.
          </p>

          <p className="text-[#191817] text-[17px] leading-relaxed mb-6">
            V našom obchode nezadávate žiadne informácie, ktoré by sa priamo týkali práce s peniazmi.
            Platba za objednaný tovar prebehne až pri doručení tovaru na vami uvedenú adresu a to
            dobierkou prostredníctvom Slovenskej pošty, prípadne kuriérskej alebo doručovateľskej
            spoločnosti. Alternatívnym spôsobom úhrady je platba vopred prevodom na náš účet (262 075
            3192/1100) , prípadne v hotovosti pri osobnom prebratí objednaného tovaru.
          </p>

          <p className="text-[#191817] text-[17px] leading-relaxed mb-6">
            Počas Vašej návštevy sú na našom serveri uchovávané dočasné informácie, ktoré sú potrebné
            pre správne fungovanie obchodu (napr. čo ste vložili do nákupného košíka, kedy ste na
            stránku prišli, odkiaľ ste na stránku prišli).
          </p>

          <p className="text-[#191817] text-[17px] leading-relaxed mb-6">
            Kedykoľvek po prihlásení sa na stránke www.prud.sk, si môžete svoje osobné údaje
            skontrolovať a v prípade potreby zmeniť v časti "Upraviť".
          </p>

          <p className="text-[#191817] text-[17px] leading-relaxed mb-6">
            Vaše osobné údaje nezverejňujeme, nesprístupňujeme, neposkytujeme žiadnym iným subjektom,
            s výnimkou organizácií, s ktorými je spolupráca nevyhnutná pre správne vybavenie Vašej
            objednávky. Sú to najmä: Slovenská pošta, doručovateľské a kuriérske služby, či niektorí
            vydavatelia a dodávatelia, keď si to vyžaduje povaha objednaného produktu. Tieto údaje sú
            však vždy poskytnuté jednorazovo pre vybavenie Vašej konkrétnej objednávky. Databázu
            osobných údajov chránime pred ich poškodením, zničením, stratou a zneužitím.
          </p>

          <p className="text-[#191817] text-[17px] leading-relaxed mb-6">
            Registráciou nám udeľujete súhlas so spracovaním svojich osobných údajov uvedených v
            objednávke za účelom vybavenia objednávky a dodania tovaru, a to na dobu nevyhnutnú na
            plnenie zmluvy. V súlade s § 28 zákona máte právo požadovať informáciu o spracovaní
            vašich osobných údajov, a zoznam osobných údajov, ktoré sú predmetom spracovania, právo
            na opravu nesprávnych, neúplných alebo neaktuálnych osobných údajov, právo na likvidáciu
            osobných údajov, ak účel ich spracovania skončil, právo na základe bezplatnej písomnej
            žiadosti namietať voči využívaniu svojich osobných údajov na marketingové účely.
          </p>

          <p className="text-[#191817] text-[17px] leading-relaxed mb-6">
            Vaše osobné údaje sme oprávnení spracovávať aj po skončení pôvodného účelu spracovania
            len v nevyhnutnom rozsahu pre účely štatistiky, účtovníctva a prieskumu, a poskytnúť
            tretím stranám alebo verejnosti súhrnné štatistické informácie o zákazníkoch,
            návštevnosti, obrate a ďalšie údaje, avšak v anonymizovanej podobe tak, že na ich základe
            nebude možné nijakým spôsobom identifikovať našich zákazníkov.
          </p>

          <p className="text-[#191817] text-[17px] leading-relaxed mb-4 font-medium">
            Na zachovaní vášho súkromia nám záleží!
          </p>

          <p className="text-[#191817] text-[17px] leading-relaxed">Tím Prúd.sk</p>
        </div>
      </div>
    </div>
  )
}

export default SafetyPrivacy
