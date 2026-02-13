'use client'
import React, { useLayoutEffect } from 'react'
import Link from 'next/link'

const Give2Percent = () => {
  useLayoutEffect(() => {
    window.scrollTo(0, 200)
  }, [])

  return (
    <div className="container mx-auto px-3 md:px-0 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-[#071e46] mb-6 text-center">
        Darujte 2% zo svojich daní občianskemu združeniu Prúd
      </h1>

      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-6">
        <p className="text-[#191817] leading-relaxed mb-4">
          Tento rok sme prijímateľom 2%. Podporte, prosím, aktivity OZ Prúd darovaním 2% z dane.
          Získané finančné prostriedky budú použité na prezentáciu a propagáciu kvalitnej
          kresťanskej literatúry, organizovanie konferencií, seminárov a školení, využívanie
          technológií www a iných služieb internetu.
        </p>
        <p className="text-[#191817] leading-relaxed font-semibold text-lg">
          Ďakujeme za vašu podporu!
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 md:p-8 mb-8">
        <h2 className="text-2xl font-bold text-[#071e46] mb-4">Údaje o prijímateľovi</h2>
        <div className="space-y-2 text-[#191817]">
          <p>
            <strong>Obchodné meno (názov):</strong> Prúd
          </p>
          <p>
            <strong>Právna forma:</strong> Občianske združenie
          </p>
          <p>
            <strong>IČO:</strong> 36076589
          </p>
          <p>
            <strong>Sídlo:</strong> Špieszova 5, 841 04 Bratislava
          </p>
        </div>
      </div>

      {/* Downloadable files section */}
      <div className="bg-blue-50 rounded-lg p-6 md:p-8 mb-8">
        <h2 className="text-2xl font-bold text-[#071e46] mb-4">Stiahnuteľné prílohy</h2>
        <div className="space-y-3">
          <Link
            href="/give_2percent/Príloha č. 1_Žiadosť o vykonanie ročného zúčtovania preddavkov.pdf"
            target="_blank"
            className="block p-4 bg-white rounded hover:bg-blue-100 transition-colors border border-blue-200"
          >
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0017.414 6L14 2.586A2 2 0 0012.586 2H8z" />
              </svg>
              <span className="text-[#071e46] font-medium">
                Príloha č. 1 - Žiadosť o vykonanie ročného zúčtovania preddavkov
              </span>
            </div>
          </Link>

          <Link
            href="/give_2percent/Príloha č. 2_Potvrdenie o zaplatení dane.pdf"
            target="_blank"
            className="block p-4 bg-white rounded hover:bg-blue-100 transition-colors border border-blue-200"
          >
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0017.414 6L14 2.586A2 2 0 0012.586 2H8z" />
              </svg>
              <span className="text-[#071e46] font-medium">
                Príloha č. 2 - Potvrdenie o zaplatení dane
              </span>
            </div>
          </Link>

          <Link
            href="/give_2percent/Príloha č. 3_Vyhlásenie o poukázaní podielu zaplatenej dane z príjmov FO.pdf"
            target="_blank"
            className="block p-4 bg-white rounded hover:bg-blue-100 transition-colors border border-blue-200"
          >
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0017.414 6L14 2.586A2 2 0 0012.586 2H8z" />
              </svg>
              <span className="text-[#071e46] font-medium">
                Príloha č. 3 - Vyhlásenie o poukázaní podielu zaplatenej dane z príjmov FO
              </span>
            </div>
          </Link>

          <Link
            href="/give_2percent/Príloha č. 3a_Poučenie k Vyhláseniu o poukázaní podielu zaplatenej dane z príjmov FO.pdf"
            target="_blank"
            className="block p-4 bg-white rounded hover:bg-blue-100 transition-colors border border-blue-200"
          >
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0017.414 6L14 2.586A2 2 0 0012.586 2H8z" />
              </svg>
              <span className="text-[#071e46] font-medium">
                Príloha č. 3a - Poučenie k Vyhláseniu o poukázaní podielu zaplatenej dane z príjmov
                FO
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Physical persons - employees */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#071e46] mb-4">
          Postup pre fyzické osoby – zamestnancov
        </h2>
        <ul className="list-disc list-inside space-y-3 text-[#191817] leading-relaxed">
          <li>
            Do <strong>16.02.2026</strong> požiadajte svojho zamestnávateľa o vykonanie ročného
            zúčtovania zaplatených preddavkov na daň (príloha č. 1 Žiadosť o vykonanie ročného
            zúčtovania preddavkov).
          </li>
          <li>
            Po vykonaní zúčtovania požiadajte zamestnávateľa, aby Vám vystavil tlačivo Potvrdenie o
            zaplatení dane za rok 2025 (príloha č. 2 Potvrdenie o zaplatení dane).
          </li>
          <li>
            Vyplňte Vyhlásenie o poukázaní 2% z dane pre OZ Prúd (príloha č. 3 Vyhlásenie o
            poukázaní dane) podľa poučenia (príloha č. 3a Poučenie k Vyhláseniu o poukázaní dane).
          </li>
          <li>
            Z Potvrdenia o zaplatení dane zistíte potrebné údaje na vyplnenie Vyhlásenia o poukázaní
            dane, t. j. dátum zaplatenia dane a sumu zaplatenej dane na výpočet príslušných percent:
            <ol className="list-decimal list-inside ml-6 mt-2 space-y-2">
              <li>
                <strong>2% zo svojej zaplatenej dane</strong> - ide o maximálnu sumu, ktorú môžete
                poukázať v prípade, že ste v minulom roku neboli dobrovoľníkom, alebo ste
                dobrovoľnícky odpracovali menej ako 40 hodín. Minimálna výška tejto sumy je však 3
                €.
              </li>
              <li>
                <strong>3% zo svojej zaplatenej dane</strong> – týka sa len osôb, ktoré v minulom
                roku dobrovoľnícky odpracovali minimálne 40 hodín. Potvrdenie o tom od organizácie,
                resp. organizácií, v ktorých ste pôsobili, je povinnou prílohou k vyhláseniu a
                potvrdeniu o zaplatení dane.
              </li>
            </ol>
          </li>
          <li>
            Vyplnené Vyhlásenie o poukázaní 2% a tlačivo Potvrdenie o zaplatení dane (dobrovoľníci s
            počtom aspoň 40 odpracovaných hodín za minulý rok aj s potvrdením od príslušnej
            organizácie, resp. organizácií) doručte do <strong>30.04.2026</strong> na Daňový úrad
            podľa miesta svojho trvalého bydliska, nie podľa sídla zamestnávateľa.
          </li>
          <li>
            Poukázaním 2% podielu zaplatenej dane OZ Prúd neobmedzíte možnosť poukázania 2% podielu
            zaplatenej dane svojim rodičom, ktorí sú poberateľmi dôchodku.
          </li>
        </ul>
      </div>

      {/* Volunteers warning */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
        <h3 className="text-xl font-bold text-[#071e46] mb-3">Dobrovoľníci, pozor!</h3>
        <p className="text-[#191817] leading-relaxed">
          V prípade, že fyzická osoba (zamestnanec alebo živnostník) pre akúkoľvek neziskovú
          organizáciu alebo jednotlivca (prijímateľa dobrovoľníckej činnosti) počas minulého roka
          odpracovala ako dobrovoľník aspoň 40 hodín a táto organizácia/jednotlivec o tom vydá
          Potvrdenie o výkone dobrovoľníckej činnosti, môže fyzická osoba venovať až{' '}
          <strong>3% zo svojej dane!</strong>V tom prípade vo Vyhlásení vypočítajte 3% zo svojej
          dane a k Vyhláseniu priložte okrem Potvrdenia o zaplatení dane aj Potvrdenie o výkone
          dobrovoľníckej činnosti. Dobrovoľník nemusel odpracovať 40 hodín výlučne v prospech
          jedinej organizácie/jednotlivca. Počet minimálne 40 hodín tak môže „vyskladať" aj z
          viacerých Potvrdení od viacerých organizácií/jednotlivcov.
        </p>
      </div>

      {/* Physical persons - self-filing */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#071e46] mb-4">
          Postup pre fyzické osoby, ktoré si samy podávajú daňové priznanie
        </h2>
        <ul className="list-disc list-inside space-y-3 text-[#191817] leading-relaxed">
          <li>
            V Daňovom priznaní fyzických osôb TYP A - VIII. oddiel a v Daňovom priznaní fyzických
            osôb TYP B – XII. oddiel tlačiva vyplňte údaje pre OZ Prúd, ktoré nájdete v úvode tohto
            článku a sumu Vami vypočítaných percent z dane:
            <ol className="list-decimal list-inside ml-6 mt-2 space-y-2">
              <li>
                <strong>2% zo svojej zaplatenej dane</strong> - ide o maximálnu sumu, ktorú môžete
                poukázať v prípade, že ste v minulom roku neboli dobrovoľníkom, alebo ste
                dobrovoľnícky odpracovali menej ako 40 hodín. Minimálna výška tejto sumy je však 3
                €.
              </li>
              <li>
                <strong>3% zo svojej zaplatenej dane</strong> – týka sa len osôb, ktoré v minulom
                roku dobrovoľnícky odpracovali minimálne 40 hodín. V tlačive označte políčko „Spĺňam
                podmienky na poukázanie 3% z dane" a potvrdenie o tom od organizácie, resp.
                organizácií, v ktorých ste pôsobili, priložte ako Prílohu k daňovému priznaniu.
              </li>
              <li>
                <strong>Nezabudnite sa podpísať!</strong>
              </li>
            </ol>
          </li>
          <li>
            Daňové priznanie fyzických osôb TYP A a TYP B si môžete stiahnuť na webovej stránke{' '}
            <a
              href="https://www.financnasprava.sk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              www.financnasprava.sk
            </a>
          </li>
          <li>
            Riadne vyplnené daňové priznanie (ak ste v minulom roku odpracovali ako dobrovoľník
            minimálne 40 hodín aj potvrdenie od organizácie, resp. organizácií) doručte v lehote,
            ktorú máte na podanie daňového priznania (do <strong>31.03.2026</strong>) na Váš daňový
            úrad buď elektronicky cez portál Finančnej správy, alebo ak nemáte povinnosť
            elektronickej komunikácie, tak podľa Vášho bydliska. V tomto termíne aj zaplaťte daň z
            príjmov.
          </li>
          <li>
            Ak chcete oznámiť, že ste pre OZ Prúd poukázali 2% alebo 3% z Vašej dane, zaškrtnite vo
            Vyhlásení súhlas so zaslaním Vašich údajov (daňový úrad nám zašle Vaše meno a adresu,
            nie poukázanú sumu).
          </li>
          <li>
            Správca dane po kontrole údajov a splnení všetkých zákonných podmienok je povinný
            previesť podiely zaplatenej dane, ktoré ste poukázali, na účet občianskeho združenia
            Prúd do troch mesiacov po lehote na podanie vyhlásenia.
          </li>
        </ul>
      </div>

      {/* Legal entities */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#071e46] mb-4">Postup pre právnické osoby</h2>
        <ul className="list-disc list-inside space-y-3 text-[#191817] leading-relaxed">
          <li>
            Vypočítajte si 1% (2%) z dane z príjmov právnickej osoby. Je to maximálna suma, ktorú
            môžete poukázať v prospech prijímateľa/prijímateľov. Môžete poukázať aj menej ako 1%
            (2%), musí však byť splnená podmienka minimálne 8 € na jedného prijímateľa.
            <ol className="list-decimal list-inside ml-6 mt-2 space-y-2">
              <li>
                V prípade, že právnická osoba (firma) v roku 2025 alebo najneskôr v lehote na
                podanie tohto daňového priznania
                <strong> NEDAROVALA</strong> finančné prostriedky najmenej vo výške zodpovedajúcej
                0,5% zaplatenej dane ním určeným daňovníkom, ktorí nie sú založení alebo zriadení na
                podnikanie (aj inej organizácii, nemusí byť iba prijímateľovi), tak môže poukázať
                iba <strong>1% z dane</strong>. V daňovom priznaní vyznačí, že poukazuje iba 1% z
                dane.
              </li>
              <li>
                V prípade, že právnická osoba (firma) v roku 2025 alebo najneskôr v lehote na
                podanie tohto daňového priznania
                <strong> DAROVALA</strong> finančné prostriedky najmenej vo výške zodpovedajúcej
                0,5% zaplatenej dane ním určeným daňovníkom, ktorí nie sú založení alebo zriadení na
                podnikanie (aj inej organizácii, nemusí byť iba prijímateľovi), tak môže poukázať
                <strong> 2% z dane</strong>. V daňovom priznaní označí, že poukazuje 2% z dane.
              </li>
            </ol>
          </li>
          <li>
            V daňovom priznaní pre právnické osoby – časť VI. Vyhlásenie o poukázaní podielu
            zaplatenej dane z príjmov právnickej osoby vyplníte v prospech jedného alebo viacerých
            prijímateľov podielu zaplatenej dane.
          </li>
          <li>
            Údaje o občianskom združení Prúd, ktoré potrebujete uviesť do daňového priznania nájdete
            v úvode tohto článku.
          </li>
          <li>
            Riadne vyplnené daňové priznanie odošlite elektronicky v lehote, ktorú máte na podanie
            daňového priznania a v tomto termíne aj zaplaťte daň z príjmov.
          </li>
          <li>
            Ak chcete oznámiť, že ste pre OZ Prúd poukázali 2% alebo 3% z Vašej dane, zaškrtnite vo
            Vyhlásení súhlas so zaslaním Vašich údajov (daňový úrad nám zašle Vaše meno a adresu,
            nie poukázanú sumu).
          </li>
          <li>
            Správca dane po kontrole údajov a splnení všetkých podmienok je povinný previesť podiely
            zaplatenej dane, ktoré ste poukázali, na účet občianskeho združenia Prúd do troch
            mesiacov po lehote na podanie vyhlásenia.
          </li>
          <li>
            Okrem daňového priznania už nepodávate na poukázanie 1% (2%) z dane žiadne iné tlačivá,
            ako napríklad kópie darovacích zmlúv, atď. – tie sú dôležité až pri prípadnej kontrole.
          </li>
        </ul>
      </div>

      {/* Thank you section */}
      <div className=" rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-2">ĎAKUJEME za Vašu podporu!</h2>
      </div>
    </div>
  )
}

export default Give2Percent
