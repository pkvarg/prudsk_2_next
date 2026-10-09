import LegalSections from '../components/LegalSections'

export const metadata = {
  title: 'Obchodné podmienky | Prúd',
}

const sections = [
  {
    id: 'predavajuci',
    title: '1. Predávajúci',
    body: [
      'Prevádzkovateľom e-shopu prud.sk a predávajúcim je občianske združenie Prúd, Špieszova 3362/5, 841 04 Bratislava – Karlova Ves, IČO: 36 076 589, DIČ: 2022028173, registrované na Ministerstve vnútra Slovenskej republiky pod č. VVS/1-900/90-26215-1. Predávajúci nie je platiteľom DPH.',
      'Kontakt: eshop@prud.sk, tel. +421 904 060 262.',
      'Tieto obchodné podmienky upravujú práva a povinnosti predávajúceho a kupujúceho pri nákupe v e-shope prud.sk. Vzťahy neupravené týmito podmienkami sa riadia zákonom č. 40/1964 Zb., Občiansky zákonník, a ak je kupujúci spotrebiteľ, aj zákonom č. 108/2024 Z. z. o ochrane spotrebiteľa. Ustanovenia o odstúpení od zmluvy a ďalšie ustanovenia určené spotrebiteľom sa nevzťahujú na kupujúcich, ktorí nakupujú v rámci svojho podnikania.',
    ],
  },
  {
    id: 'konto',
    title: '2. Používateľské konto',
    body: [
      'Pred nákupom je potrebné sa zaregistrovať, a to e-mailom a heslom alebo cez účet Google. Kupujúci zodpovedá za správnosť údajov v konte a za ochranu svojho hesla. Zrušenie konta môže kedykoľvek požiadať e-mailom na eshop@prud.sk.',
    ],
  },
  {
    id: 'objednavka',
    title: '3. Objednávka a uzavretie zmluvy',
    body: [
      'Tovar zobrazený v e-shope nie je návrhom na uzavretie zmluvy. Objednávku kupujúci odošle tlačidlom „Objednávka s povinnosťou platby“; pred odoslaním môže skontrolovať a opraviť tovar, adresu aj spôsob platby.',
      'Kúpna zmluva je uzavretá potvrdením objednávky, ktoré predávajúci zašle na e-mail kupujúceho. Zmluva sa uzatvára v slovenskom jazyku. Objednávky a faktúry predávajúci archivuje a kupujúci ich nájde vo svojom konte v časti Objednávky.',
      'Predávajúci môže objednávku odmietnuť najmä vtedy, ak je tovar vypredaný alebo ak bola pri tovare zjavná chyba v cene; kupujúceho o tom bez zbytočného odkladu informuje a prípadnú platbu vráti.',
    ],
  },
  {
    id: 'ceny',
    title: '4. Ceny a doprava',
    body: [
      'Ceny sú uvedené v eurách a sú konečné. Predávajúci nie je platiteľom DPH, preto ceny DPH neobsahujú. Rozhodujúca je cena platná v čase odoslania objednávky.',
      [
        'doprava v rámci Slovenskej republiky: 4,50 €',
        'pri objednávke nad 100 €: doprava zadarmo',
        'doprava do zahraničia: podľa skutočných nákladov; cenu predávajúci oznámi kupujúcemu pred odoslaním tovaru a kupujúci môže v takom prípade objednávku bez sankcie zrušiť',
      ],
    ],
  },
  {
    id: 'platba',
    title: '5. Platba',
    body: [
      [
        'bankovým prevodom vopred – údaje na platbu dostane kupujúci v potvrdení objednávky; tovar odosielame po pripísaní platby na účet',
        'v hotovosti pri prevzatí tovaru (len pri doručení na Slovensku)',
      ],
      'Pri objednávkach do zahraničia je možná len platba prevodom vopred. Za tovar vystavuje predávajúci faktúru, ktorú kupujúci dostane e-mailom.',
    ],
  },
  {
    id: 'dodanie',
    title: '6. Dodanie tovaru',
    body: [
      'Tovar odosielame prostredníctvom poštovej alebo prepravnej služby na adresu uvedenú v objednávke. Tovar na sklade odosielame bez zbytočného odkladu, najneskôr do 30 dní od uzavretia zmluvy, ak nebolo dohodnuté inak.',
      'Kupujúci by mal pri prevzatí skontrolovať neporušenosť zásielky a prípadné poškodenie bez odkladu oznámiť dopravcovi aj predávajúcemu.',
    ],
  },
  {
    id: 'elektronicke-publikacie',
    title: '7. Elektronické publikácie (PDF)',
    body: [
      'Niektoré publikácie sú dostupné aj vo formáte PDF na stiahnutie. Prístup k nim sprístupňuje predávajúci registrovaným používateľom. Cena je uvedená pri publikácii a platí za jedného používateľa; ak chce kupujúci publikáciu poskytnúť ďalším osobám, uhradí cenu za každú z nich. Platba sa uskutočňuje bankovým prevodom podľa údajov alebo QR kódu uvedeného pri publikácii.',
      'Publikácie sú určené len na osobné použitie a nie sú voľne šíriteľné.',
      'Pred stiahnutím kupujúci výslovne súhlasí so začatím poskytovania digitálneho obsahu pred uplynutím lehoty na odstúpenie od zmluvy a berie na vedomie, že stiahnutím stráca právo na odstúpenie od zmluvy.',
    ],
  },
  {
    id: 'odstupenie',
    title: '8. Odstúpenie od zmluvy',
    body: [
      'Spotrebiteľ má právo odstúpiť od zmluvy uzavretej na diaľku bez uvedenia dôvodu do 14 dní od prevzatia tovaru. Odstúpenie môže oznámiť formulárom na stránke prud.sk/odstupenie, e-mailom na eshop@prud.sk alebo listom na adresu predávajúceho. Lehota je zachovaná, ak je odstúpenie odoslané počas jej plynutia.',
      'Tovar je potrebné vrátiť predávajúcemu najneskôr do 14 dní od odstúpenia; priame náklady na vrátenie tovaru znáša kupujúci. Predávajúci vráti kupujúcemu všetky prijaté platby vrátane nákladov na doručenie v najlacnejšej ponúkanej výške do 14 dní od odstúpenia, rovnakým spôsobom, akým ich prijal, alebo prevodom na účet uvedený kupujúcim. Predávajúci nie je povinný vrátiť platbu skôr, ako mu je tovar doručený alebo kým kupujúci nepreukáže, že ho odoslal.',
      'Kupujúci zodpovedá za zníženie hodnoty tovaru, ktoré vzniklo zaobchádzaním s tovarom inak, než je potrebné na zistenie jeho povahy a vlastností.',
      'Odstúpiť nemožno okrem iného pri zvukových alebo obrazových záznamoch dodaných v zapečatenom obale, ak kupujúci obal porušil, pri novinách a periodikách, pri tovare upravenom podľa želania kupujúceho a pri elektronických publikáciách podľa časti 7, ak sa ich stiahnutie začalo s výslovným súhlasom kupujúceho.',
    ],
  },
  {
    id: 'reklamacie',
    title: '9. Zodpovednosť za vady (reklamácie)',
    body: [
      'Predávajúci zodpovedá kupujúcemu-spotrebiteľovi za vady, ktoré má tovar pri prevzatí, a za vady, ktoré sa prejavia do 24 mesiacov od prevzatia.',
      'Reklamáciu možno uplatniť e-mailom na eshop@prud.sk alebo listom; vhodné je pripojiť číslo objednávky, opis vady a fotografiu. Predávajúci vydá potvrdenie o uplatnení reklamácie, určí spôsob jej vybavenia bez zbytočného odkladu a vybaví ju najneskôr do 30 dní od jej uplatnenia.',
      'Kupujúci môže požadovať výmenu tovaru za nový bez vady alebo opravu; ak to nie je možné alebo vhodné, primeranú zľavu alebo odstúpenie od zmluvy. Účelne vynaložené náklady spojené s oprávnenou reklamáciou hradí predávajúci.',
    ],
  },
  {
    id: 'recenzie',
    title: '10. Recenzie',
    body: [
      'Recenzie tovaru zverejnené v e-shope predávajúci moderuje, ale neoveruje, či pochádzajú od spotrebiteľov, ktorí tovar skutočne kúpili.',
    ],
  },
  {
    id: 'spory',
    title: '11. Sťažnosti a alternatívne riešenie sporov',
    body: [
      'Sťažnosti vybavuje predávajúci na adrese eshop@prud.sk.',
      'Ak spotrebiteľ nie je spokojný s vybavením reklamácie alebo sa domnieva, že predávajúci porušil jeho práva, môže sa obrátiť na predávajúceho so žiadosťou o nápravu. Ak predávajúci žiadosť zamietne alebo na ňu neodpovie do 30 dní, spotrebiteľ môže podať návrh na alternatívne riešenie sporu subjektu alternatívneho riešenia sporov, najmä Slovenskej obchodnej inšpekcii, Ústredný inšpektorát, odbor alternatívneho riešenia spotrebiteľských sporov, Bajkalská 21/A, 827 99 Bratislava, ars@soi.sk.',
      'Dozor nad dodržiavaním predpisov na ochranu spotrebiteľa vykonáva Slovenská obchodná inšpekcia, Inšpektorát SOI pre Bratislavský kraj, Bajkalská 21/A, P. O. BOX 5, 820 07 Bratislava, www.soi.sk.',
    ],
  },
  {
    id: 'osobne-udaje',
    title: '12. Osobné údaje',
    body: [
      'Spracúvanie osobných údajov kupujúcich opisuje stránka Bezpečnosť a súkromie (prud.sk/safety-privacy).',
    ],
  },
  {
    id: 'zaverecne',
    title: '13. Záverečné ustanovenia',
    body: [
      'Tieto obchodné podmienky sú účinné od 9. 10. 2026. Predávajúci ich môže meniť; na zmluvy uzavreté pred zmenou sa vzťahuje znenie platné v čase odoslania objednávky.',
    ],
  },
]

export default function TradeRules() {
  return <LegalSections title="Obchodné podmienky" effective="Účinné od 9. 10. 2026" sections={sections} />
}
