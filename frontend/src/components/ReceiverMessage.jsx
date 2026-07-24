import React, { useEffect, useRef } from 'react'
import dp from "../assets/dp.webp"
import { useSelector } from 'react-redux'
import { mediaUrl } from '../utils/mediaUrl'

function ReceiverMessage({image,message}) {
  let scroll=useRef()
  let {selectedUser}=useSelector(state=>state.user)
  const imageSrc = mediaUrl(image)
  const avatarSrc = mediaUrl(selectedUser?.image) || dp
  const hasImage = Boolean(imageSrc && String(imageSrc).trim())
  const hasMessage = Boolean(message && String(message).trim())

  useEffect(()=>{
    scroll?.current?.scrollIntoView({behavior:"smooth"})
  },[message,image])
  
  const handleImageScroll=()=>{
    scroll?.current?.scrollIntoView({behavior:"smooth"})
  }

  if (!hasImage && !hasMessage) {
    return null
  }

  return (
    <div className='flex items-start gap-[10px]' >
      <div className='w-[40px] h-[40px] rounded-full overflow-hidden flex justify-center items-center bg-white cursor-pointer shadow-gray-500 shadow-lg ' >
        <img src={avatarSrc} alt="" className='h-[100%]'/>
      </div>
      <div ref={scroll} className='w-fit max-w-[500px] px-[20px] py-[10px]  bg-[rgb(23,151,194)] text-white text-[19px] rounded-tl-none rounded-2xl relative left-0  shadow-gray-400 shadow-lg gap-[10px] flex flex-col'>
        {hasImage && <img src={imageSrc} alt="" className='w-[150px] rounded-lg' onLoad={handleImageScroll}/>}
        {hasMessage && <span>{message}</span>}
      </div>
    </div>
  )
}

export default ReceiverMessage
