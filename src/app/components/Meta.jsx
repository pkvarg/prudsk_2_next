// components/Meta.jsx
import Head from 'next/head'
import React from 'react'

const Meta = ({ title, description, keywords }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Head>
  )
}

Meta.defaultProps = {
  title: 'Prúd života',
  description: 'Prinášať bohatstvo Božieho slova všetkému Božiemu ľudu',
  keywords:
    'kresťanské knihy, kresťanská literatúra, duchovné knihy, duchovná literatúra, Boh, trojjediný Boh, Kristus, Ježiš Kristus, Duch, Duch Svätý, Život, Štúdium života, Biblia, svätá Biblia, štúdium Biblie, Písmo, Sväté písmo, kresťanstvo, kresťania, cirkev, Cirkev, miestna cirkev, miestne cirkvi',
}

export default Meta
