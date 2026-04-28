import React from 'react'
import { useNavigate } from 'react-router-dom'

function ContinueBtn() {
    
  return (
    <button  className="w-full mt-8 bg-[#00695C] hover:bg-[#004D40] text-white py-4 rounded-full flex items-center justify-center gap-2 font-semibold transition-all shadow-md active:scale-[0.98]">
            Finalize Registration
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
     </button>
  )
}

export default ContinueBtn
