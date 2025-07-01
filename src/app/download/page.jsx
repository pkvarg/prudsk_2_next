'use client'
import React, { useState, useEffect } from 'react'
import { Download, FileText, AlertCircle } from 'lucide-react'

const DownloadPage = () => {
  const [pdfUrl, setPdfUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Configuration - change these values as needed
  const PDF_FILENAME = 'tajomstvo.pdf' // Change to your PDF filename
  const PDF_TITLE = 'Tajomstvo ľudského života'
  const PDF_DESCRIPTION = `Leták ${PDF_TITLE} ke stažení.`

  useEffect(() => {
    // Set the PDF URL from public folder
    const url = `/${PDF_FILENAME}`
    setPdfUrl(url)

    // Check if PDF exists by trying to fetch it
    fetch(url, { method: 'HEAD' })
      .then((response) => {
        if (response.ok) {
          setLoading(false)
        } else {
          setError('PDF file not found')
          setLoading(false)
        }
      })
      .catch(() => {
        setError('Error loading PDF file')
        setLoading(false)
      })
  }, [])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = PDF_FILENAME
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Načítání PDF...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Chyba při načítání</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Ujistěte se, že soubor "{PDF_FILENAME}" je umístěn ve složce public.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-2 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{PDF_TITLE}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">{PDF_DESCRIPTION}</p>
        </div>

        {/* PDF Preview and Download Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-1 lg:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Náhled</h2>
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
              >
                <Download className="h-5 w-5 mr-2" />
                Stáhnout PDF
              </button>
            </div>

            {/* PDF Preview */}
            <div className="lg:border lg:rounded-lg lg:bg-gray-100 lg:p-4">
              <div className="w-full" style={{ height: '600px' }}>
                <iframe
                  src={`${pdfUrl}#page=1&toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full h-full border-0 rounded"
                  title="PDF Preview"
                  onError={() => setError('Chyba při zobrazování PDF náhledu')}
                >
                  <p className="text-center text-gray-500 mt-8">
                    Váš prohlížeč nepodporuje zobrazení PDF souborů.{' '}
                    <button onClick={handleDownload} className="text-blue-600 hover:underline">
                      Klikněte zde pro stažení
                    </button>
                  </p>
                </iframe>
              </div>
            </div>

            {/* Download Info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Download className="h-5 w-5 text-blue-600 mt-0.5" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-900">Ke stažení</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Klikněte na tlačítko "Stáhnout PDF" pro uložení dokumentu do vašeho zařízení.
                    Soubor bude stažen ve formátu PDF.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Máte problémy se stažením?{' '}
            <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
              Kontaktujte nás
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default DownloadPage
