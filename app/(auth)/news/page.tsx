"use client"

import CreateNews from '@/components/CreateNews'
import GetNews from '@/components/GetNews'
import React, { useState } from 'react'

const page = () => {
const [showCreate,setShowCreate]=useState(false)


  return (
    <div>

{showCreate &&  <CreateNews   setShowCreate={setShowCreate}/> }
{!showCreate &&  <GetNews   setShowCreate={setShowCreate}/> }





    </div>
  )
}

export default page