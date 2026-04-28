import React from 'react'

function InfoCard({Title, Icon, Value, message}) {
  return (
    <div className='bg-white p-4 rounded-lg shadow-md w-50 '>
    <div>
      <div>{Title}</div>
      <div>{Icon}</div>
      </div>
        <div>{Value}</div>
        <p>{message}</p>
    </div>
  )
}

export default InfoCard
