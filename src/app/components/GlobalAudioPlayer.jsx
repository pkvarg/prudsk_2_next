// 'use client'
// import React, { useRef, useState } from 'react'
// import usePlayerStore from '@/store/playerStore'

// const GlobalAudioPlayer = () => {
//   const { currentAudio, stopAudio } = usePlayerStore()
//   const [isMinimized, setIsMinimized] = useState(false)
//   const iframeRef = useRef(null)

//   if (!currentAudio) return null

//   return (
//     <div className="fixed bottom-4 right-4 z-50">
//       <div
//         className={`bg-white rounded-lg shadow-2xl border border-gray-200 ${
//           isMinimized ? 'w-80' : 'max-w-md w-120'
//         }`}
//       >
//         <div className="p-4 bg-[#071e46] text-white rounded-t-lg">
//           <div className="flex justify-between items-start">
//             <div className="flex-1 mr-2">
//               <p className="text-xs opacity-75 mb-1">{currentAudio.subcategory}</p>
//               <h4 className="text-sm font-semibold line-clamp-2">{currentAudio.audioTitle}</h4>
//             </div>
//             <div className="flex items-center space-x-2 flex-shrink-0">
//               <button
//                 onClick={() => setIsMinimized(!isMinimized)}
//                 className="text-white hover:text-gray-300 text-lg"
//               >
//                 {isMinimized ? '↗' : '-'}
//               </button>
//               <button onClick={stopAudio} className="text-white hover:text-gray-300 text-xl">
//                 ×
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Always render iframe, just hide it when minimized */}
//         <div className={`${isMinimized ? 'hidden' : 'p-4'}`}>
//           <div className="bg-gray-100 rounded">
//             <iframe
//               ref={iframeRef}
//               key={currentAudio.id}
//               src={currentAudio.mp3file}
//               className="w-full h-full rounded"
//               allow="autoplay; encrypted-media"
//               title={currentAudio.audioTitle}
//               frameBorder="0"
//             />
//           </div>
//         </div>

//         {/* Keep iframe alive but hidden when minimized */}
//         {isMinimized && (
//           <div style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}>
//             <iframe
//               src={currentAudio.mp3file}
//               allow="autoplay; encrypted-media"
//               title={currentAudio.audioTitle}
//               frameBorder="0"
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default GlobalAudioPlayer

'use client'
import React, { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import usePlayerStore from '@/store/playerStore'

const GlobalAudioPlayer = () => {
  const { currentAudio, stopAudio } = usePlayerStore()
  const [isMinimized, setIsMinimized] = useState(false)
  const iframeRef = useRef(null)
  const router = useRouter()

  const handleTitleClick = () => {
    if (currentAudio?.category) {
      if (currentAudio?.category === 'Studium života') {
        router.push(`/life-study`)
      } else {
        router.push(`/words-of-life`)
      }
    }
  }

  if (!currentAudio) return null

  return (
    <div className="fixed bottom-4 right-2 lg:right-4 z-50">
      <div
        className={`bg-white rounded-lg shadow-2xl border border-gray-200 ${
          isMinimized ? 'w-80' : 'w-full max-w-md lg:w-120'
        }`}
      >
        <div className="p-4 bg-[#071e46] text-white rounded-t-lg">
          <div className="flex justify-between items-start">
            <div
              className="flex-1 mr-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleTitleClick}
              title="Přejít na stránku s nahrávkami"
            >
              <p className="text-xs opacity-75 mb-1">{currentAudio.subcategory}</p>
              <h4 className="!text-[12.5px] font-semibold line-clamp-2">
                {currentAudio.audioTitle}
              </h4>
            </div>
            <div className="cursor-pointer">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:text-gray-300 cursor-pointer"
              >
                {isMinimized ? (
                  <span className="text-[22.5px] mr-2">↗</span>
                ) : (
                  <span className="text-[35px] mr-1 font-extralight">-</span>
                )}
              </button>
              <button
                onClick={stopAudio}
                className="text-white hover:text-gray-300 text-[30px] cursor-pointer"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* Always render iframe, just hide it when minimized */}
        <div className={`${isMinimized ? 'hidden' : 'p-4'}`}>
          <div className="bg-gray-100 rounded">
            <span className="text-red-500 text-[12.5px] fixed right-24 mt-5">
              Stáhnout mp3 &rarr;
            </span>
            <iframe
              ref={iframeRef}
              key={currentAudio.id}
              src={currentAudio.mp3file}
              className="w-full h-full rounded"
              allow="autoplay; encrypted-media"
              title={currentAudio.audioTitle}
              frameBorder="0"
            />
          </div>
        </div>

        {/* Keep iframe alive but hidden when minimized */}
        {isMinimized && (
          <div style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}>
            <iframe
              src={currentAudio.mp3file}
              allow="autoplay; encrypted-media"
              title={currentAudio.audioTitle}
              frameBorder="0"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default GlobalAudioPlayer
