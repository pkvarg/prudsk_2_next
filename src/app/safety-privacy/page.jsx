import LegalSections from '../components/LegalSections'

export const metadata = {
  title: 'Bezpečnosť a súkromie | Prúd',
}

// Section ids double as anchors, e.g. /safety-privacy#cookies from the cookie banner.
const sections = [
  {
    id: 'prevadzkovatel',
    title: '1. Prevádzkovateľ',
    body: [
      'Prevádzkovateľom osobných údajov je občianske združenie Prúd, Špieszova 3362/5, 841 04 Bratislava – Karlova Ves, IČO: 36 076 589 (ďalej len „prevádzkovateľ“).',
      'Kontakt v otázkach osobných údajov: eshop@prud.sk, tel. +421 904 060 262.',
    ],
  },
  {
    id: 'konto-a-objednavky',
    title: '2. Používateľské konto a objednávky',
    body: [
      'Údaje: meno a priezvisko, e-mail, heslo (uložené v zašifrovanej podobe), doručovacia a fakturačná adresa, telefón (nepovinne), pri firmách názov, IČO, DIČ a IČ DPH, obsah objednávok a obľúbený tovar.',
      'Účel a právny základ: vedenie konta, vybavenie a doručenie objednávky a komunikácia o nej – plnenie zmluvy (čl. 6 ods. 1 písm. b) GDPR); vystavenie faktúry a vedenie účtovníctva – plnenie zákonnej povinnosti (čl. 6 ods. 1 písm. c) GDPR).',
      'Doba uchovávania: údaje konta do jeho zrušenia; objednávky a faktúry 10 rokov podľa zákona č. 431/2002 Z. z. o účtovníctve.',
      'Prihlásenie cez Google: ak zvolíte prihlásenie cez Google, dostaneme od spoločnosti Google vaše meno a e-mail. Google sa tým dozvie, že sa prihlasujete na prud.sk; za svoje spracúvanie zodpovedá Google (policies.google.com/privacy).',
    ],
  },
  {
    id: 'elektronicke-publikacie',
    title: '3. Elektronické publikácie',
    body: [
      'Ak vám prevádzkovateľ sprístupní elektronické publikácie, evidujeme, ktorú publikáciu a kedy ste si stiahli, a kedy ste naposledy videli oznámenie o nových publikáciách. Slúži to na vybavenie zmluvy a kontrolu úhrad (čl. 6 ods. 1 písm. b) GDPR). Tieto záznamy uchovávame počas existencie vášho konta.',
      'Ak na úhradu použijete tlačidlo platby v mobile, otvorí sa platobná služba payme.sk; údaje o platbe spracúva vaša banka a poskytovateľ tejto služby.',
    ],
  },
  {
    id: 'novinky',
    title: '4. E-maily o novinkách',
    body: [
      'Ak pri objednávke zaškrtnete súhlas, posielame vám najviac dvakrát ročne e-mail o novinkách a akciách. Právnym základom je váš súhlas (čl. 6 ods. 1 písm. a) GDPR). Súhlas môžete kedykoľvek odvolať v profile po prihlásení alebo e-mailom na eshop@prud.sk; e-mail potom z rozosielania vyradíme.',
    ],
  },
  {
    id: 'formulare',
    title: '5. Kontaktný formulár a odstúpenie od zmluvy',
    body: [
      'Kontaktný formulár: meno, e-mail, telefón (nepovinne) a správa; spracúvame ich, aby sme vám odpovedali (oprávnený záujem, čl. 6 ods. 1 písm. f) GDPR, prípadne rokovanie o zmluve). Správy uchovávame najviac 2 roky od poslednej komunikácie.',
      'Formulár na odstúpenie od zmluvy: číslo objednávky, meno, kontaktné údaje, adresa, číslo účtu na vrátenie peňazí a vracaný tovar; spracúvame ich, aby sme vybavili vaše odstúpenie a vrátili platbu (plnenie zákonnej povinnosti, čl. 6 ods. 1 písm. c) GDPR). Uchovávame ich počas premlčacej doby, spravidla 3 roky, a v rozsahu účtovných dokladov 10 rokov.',
      'Ochrana pred spamom: ak formulár vyhodnotí odoslanie ako automatický spam, zaznamenáme IP adresu, údaje o prehliadači a dôvod vyhodnotenia (oprávnený záujem na ochrane webu). Tieto záznamy mažeme po 90 dňoch; IP adresy opakovane zablokované pre spam môžeme uchovávať dlhšie.',
    ],
  },
  {
    id: 'recenzie',
    title: '6. Recenzie',
    body: [
      'Ak napíšete recenziu tovaru, zverejníme ju spolu s vaším menom, ako je uvedené vo vašom konte. Recenziu môžete kedykoľvek dať vymazať e-mailom na eshop@prud.sk.',
    ],
  },
  {
    id: 'navsteva',
    title: '7. Návšteva webu',
    body: [
      'Pri každej návšteve spracúva poskytovateľ hostingu technické údaje potrebné na doručenie stránky a ochranu pred útokmi: IP adresu, typ prehliadača a čas požiadavky (oprávnený záujem na bezpečnom fungovaní webu). Tieto záznamy sa uchovávajú len krátko, spravidla niekoľko týždňov.',
    ],
  },
  {
    id: 'cookies',
    title: '8. Cookies a meranie návštevnosti',
    body: [
      'Nevyhnutné (bez súhlasu):',
      [
        'CookieConsent – zapamätá si vašu voľbu v lište cookies, 365 dní',
        'prihlasovacie cookies (Auth.js) – udržia vás prihlásených, do odhlásenia alebo vypršania relácie',
        'cart-storage, user-storage a audio-player-storage (úložisko prehliadača) – obsah košíka a rozpracovanej objednávky, údaje prihláseného používateľa a nastavenie prehrávača',
        'ebook_modal_shown (úložisko prehliadača počas relácie) – aby sa oznámenie o elektronických publikáciách nezobrazovalo opakovane',
        'contact_form_submissions, register_form_submissions, withdrawal_form_submissions (úložisko prehliadača) – časy odoslania formulárov kvôli ochrane pred spamom, 1 hodina',
      ],
      'Meranie návštevnosti (len s vaším súhlasom): Umami – nástroj na meranie návštevnosti na serveri v Nemecku (Contabo GmbH), ktorý prevádzkuje Pictusweb s.r.o. Nepoužíva cookies, neukladá IP adresu a nevytvára profil návštevníka; vidno len súhrnné štatistiky. Spustí sa až po kliknutí na „Súhlasím“. Ak meranie odmietnete, prehliadač si to zapamätá (umami.disabled).',
      'Písma sú súčasťou webu a nenačítavajú sa od Google. Nepoužívame Google Analytics, reklamné ani sledovacie cookies.',
      'Súhlas môžete kedykoľvek zmeniť alebo odvolať odkazom „Nastavenia cookies“ v pätičke webu. Pravidlá pre cookies vychádzajú z § 109 ods. 8 zákona č. 452/2021 Z. z. o elektronických komunikáciách.',
    ],
  },
  {
    id: 'videa',
    title: '9. Videá z YouTube',
    body: [
      'Videá sú uložené na YouTube (Google Ireland Ltd. / Google LLC). Kým nekliknete na „Prehrať video“, s YouTube sa nenadviaže žiadne spojenie. Po kliknutí sa video načíta z youtube-nocookie.com a Google získa vašu IP adresu a údaje o prehliadači a môže uložiť vlastné cookies. Za toto spracúvanie zodpovedá Google ako samostatný prevádzkovateľ.',
    ],
  },
  {
    id: 'prijemcovia',
    title: '10. Kto má k údajom prístup',
    body: [
      'Údaje nepredávame. Prístup k nim majú len títo príjemcovia, v rozsahu potrebnom pre ich službu:',
      [
        'Pictusweb s.r.o., Nábrežná 4895/42, 940 02 Nové Zámky – vývoj a prevádzka e-shopu vrátane hostingu, odosielania e-mailov a merania návštevnosti',
        'Contabo GmbH (Nemecko) – servery',
        'Google (Google Workspace) – e-mailové schránky prud.sk a odosielanie e-mailov s potvrdením objednávok a faktúrami; prihlásenie cez Google a videá, ak ich použijete',
        'poštové a prepravné služby – meno, adresa a telefón na doručenie zásielky',
        'banka prevádzkovateľa – pri platbe prevodom a vracaní peňazí',
        'osoby zabezpečujúce vedenie účtovníctva a orgány verejnej moci, ak to ukladá zákon',
      ],
    ],
  },
  {
    id: 'prenos',
    title: '11. Prenos údajov mimo EÚ',
    body: [
      'Google je spoločnosť s materskou spoločnosťou v USA. Prenos sa uskutočňuje len s primeranými zárukami podľa kapitoly V GDPR – na základe rámca EÚ – USA na ochranu osobných údajov (EU-U.S. Data Privacy Framework) alebo štandardných zmluvných doložiek Európskej komisie.',
    ],
  },
  {
    id: 'prava',
    title: '12. Vaše práva',
    body: [
      'Máte právo na prístup k svojim údajom, ich opravu a vymazanie, na obmedzenie spracúvania, na prenosnosť údajov, právo namietať proti spracúvaniu na základe oprávneného záujmu a právo kedykoľvek odvolať súhlas. Svoje údaje môžete upraviť aj sami po prihlásení v profile. Žiadosti vybavujeme na eshop@prud.sk bez zbytočného odkladu, najneskôr do 1 mesiaca.',
      'Ak sa domnievate, že vaše údaje spracúvame nezákonne, môžete podať návrh na Úrad na ochranu osobných údajov Slovenskej republiky, Hraničná 12, 820 07 Bratislava 27, www.dataprotection.gov.sk.',
    ],
  },
  {
    id: 'zmeny',
    title: '13. Zmeny',
    body: [
      'Tieto zásady aktualizujeme, keď sa zmenia používané služby alebo spôsob spracúvania. Toto znenie je účinné od 9. 10. 2026.',
    ],
  },
]

export default function SafetyPrivacy() {
  return (
    <LegalSections
      title="Bezpečnosť a súkromie"
      effective="Účinné od 9. 10. 2026"
      intro="Tu nájdete, aké osobné údaje e-shop prud.sk spracúva, prečo, ako dlho, kto k nim má prístup a aké máte práva podľa nariadenia (EÚ) 2016/679 (GDPR) a zákona č. 18/2018 Z. z. o ochrane osobných údajov."
      sections={sections}
    />
  )
}
