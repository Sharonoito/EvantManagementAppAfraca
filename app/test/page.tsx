'use client'

import { createQRCodeEmailTemplate } from '@/lib/email'
import { generateQRCode } from '@/lib/qr-code'
import React, { useEffect, useState } from 'react'

const page = () => {
    const [img,setImg] = useState("")
    const [email,setEmail] = useState("")
    const gen = async () =>{
        const test = await generateQRCode("Sharon")
            setImg(test)
            const emailHTML = createQRCodeEmailTemplate('user.name', test, 'checkInURL')
            setEmail(emailHTML)
        }
    useEffect(()=>{
       gen() 
    },[])
  return (
    <div>
        <img src={img} />
        <div>
            {email}
        </div>
    </div>
  )
}

export default page