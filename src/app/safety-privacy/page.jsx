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
            Bezpečnost a soukromí
          </h1>

          <h3 className="text-[#071e46] font-bold text-xl md:text-2xl mb-4">
            Ochrana osobních údajů na proudzivota.cz
          </h3>

          <p className="text-[#191817] text-[17px] leading-relaxed mb-6">
            Abychom vám mohli poskytnout všechny služby, potřebujeme o vás znát základní informace.
            Některé z nich mají povahu osobních údajů.
          </p>

          <p className="text-[#191817] text-[17px] leading-relaxed mb-6">
            Správcem osobních údajů na proudzivota.cz podle čl. 4 bod 7 nařízení Evropského
            parlamentu a Rady (EU) 2016/679 o ochraně fyzických osob v souvislosti se zpracováním
            osobních údajů a o volném pohybu těchto údajů je Distribuce Proud – Adam Surjomartono,
            IČO: 68368844, se sídlem Hnězdenská 586, 18100 Praha 8 (dále jen: „provozovatel").
          </p>

          <p className="text-[#191817] text-[17px] leading-relaxed mb-4">
            Zpracování osobních údajů je nezbytné pro plnění smlouvy a na základě oprávněného zájmu
            zákazníka. Správce tedy zpracovává osobní údaje subjektů údajů za účelem vytvoření
            možnosti uzavřít smlouvy uzavřené na dálku nebo mimo obchodní prostory na základě
            souhlasu se zpracováním osobních údajů subjektů údajů. Před nákupem v obchodě je nutné
            se zaregistrovat. Při registraci a nakupování je potřebné o sobě uvést následující
            údaje:
          </p>

          <ul className="text-[#191817] text-[17px] leading-relaxed mb-6 ml-6 space-y-2">
            <li className="list-disc">
              Jméno a příjmení, přesná adresa včetně země (tj. adresa, která bude uvedena na
              faktuře).
            </li>
            <li className="list-disc">
              Vaše e-mailová adresa (slouží k identifikaci v systému a ke komunikaci s vámi ohledně
              stávající objednávky nebo informací o nových produktech).
            </li>
            <li className="list-disc">
              Volitelně další adresy (pokud chcete doručovat na jinou než fakturační adresu).
            </li>
            <li className="list-disc">Volitelně telefonní číslo (pro rychlejší kontakt s vámi).</li>
            <li className="list-disc">
              Pokud nakupujete jako firma / živnostník, navíc: název firmy, DIČ a IČ DPH (kvůli
              fakturaci a správnému zaúčtování).
            </li>
          </ul>

          <p className="text-[#191817] text-[17px] leading-relaxed mb-6">
            Tyto údaje jsou uloženy v databázi na našem serveru, takže je nemusíte při každé
            návštěvě znovu zadávat. Vaše údaje zpracováváme za účelem zpracování a doručení vaší
            objednávky. Tyto údaje jsou rovněž nezbytné pro náš účetní a fakturační systém. Své
            údaje a další nastavení můžete kdykoli změnit nebo aktualizovat prostřednictvím e-mailu
            nebo po přihlášení do sekce Uživatelský účet na našich webových stránkách. Pokud si
            přejete zrušit svou registraci, požádejte nás o to e-mailem. Váš účet bude zrušen.
          </p>

          <p className="text-[#191817] text-[17px] leading-relaxed mb-6">
            V našem obchodě nezadáváte žádné informace, které přímo souvisejí s prací s penězi.
            Platba za objednané zboží proběhne až po doručení zboží na vámi uvedenou adresu na
            dobírku prostřednictvím Slovenské pošty, případně kurýrní nebo doručovací společnosti.
            Alternativním způsobem platby je platba předem převodem na náš účet nebo v hotovosti při
            osobním odběru objednaného zboží.
          </p>

          <p className="text-[#191817] text-[17px] leading-relaxed mb-6">
            Během vaší návštěvy se na našem serveru ukládají dočasné informace, které jsou nezbytné
            pro správné fungování obchodu (např. co jste vložili do nákupního košíku, kdy jste na
            stránky přišli, odkud jste na stránky přišli).
          </p>

          <p className="text-[#191817] text-[17px] leading-relaxed mb-6">
            Kdykoli po přihlášení na www.proudzivota.cz můžete zkontrolovat své osobní údaje a v
            případě potřeby je změnit v části „Upravit".
          </p>

          <p className="text-[#191817] text-[17px] leading-relaxed mb-6">
            Vaše osobní údaje nezveřejňujeme, nesdílíme ani neposkytujeme žádným dalším subjektům, s
            výjimkou organizací, s nimiž je spolupráce nezbytná pro řádné vyřízení vaší objednávky.
            Jedná se zejména o: Českou poštu, doručovací a kurýrní služby nebo některé vydavatele a
            dodavatele, pokud to vyžaduje povaha objednaného produktu. Tyto údaje jsou však vždy
            poskytovány jednorázově za účelem vyřízení vaší konkrétní objednávky. Databázi osobních
            údajů chráníme před poškozením, zničením, ztrátou a zneužitím.
          </p>

          <p className="text-[#191817] text-[17px] leading-relaxed mb-6">
            Registrací nám udělujete souhlas se zpracováním vašich osobních údajů uvedených v
            objednávce za účelem vyřízení objednávky a dodání zboží, a to po dobu nezbytnou k plnění
            smlouvy. Máte právo požadovat informace o zpracování svých osobních údajů a seznam
            osobních údajů, které jsou předmětem zpracování, právo na opravu nesprávných, neúplných
            nebo neaktuálních osobních údajů, právo na likvidaci osobních údajů, pokud skončil účel
            jejich zpracování, právo vznést na základě bezplatné písemné žádosti námitku proti
            použití vašich osobních údajů pro marketingové účely.
          </p>

          <p className="text-[#191817] text-[17px] leading-relaxed mb-6">
            Vaše osobní údaje jsme oprávněni zpracovávat po skončení původního účelu zpracování
            pouze v rozsahu nezbytném pro statistické, účetní a výzkumné účely a pro poskytování
            souhrnných statistických informací o zákaznících, návštěvnosti, obratu a dalších údajů
            třetím stranám nebo veřejnosti, avšak v anonymizované podobě tak, aby na základě těchto
            informací nebylo možné naše zákazníky jakkoli identifikovat.
          </p>

          <p className="text-[#191817] text-[17px] leading-relaxed mb-4 font-medium">
            Vaše soukromí je pro nás důležité!
          </p>

          <p className="text-[#191817] text-[17px] leading-relaxed">Distribuce Proud</p>
        </div>
      </div>
    </div>
  )
}

export default SafetyPrivacy
