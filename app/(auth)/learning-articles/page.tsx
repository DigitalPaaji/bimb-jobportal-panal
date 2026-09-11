"use client"
import ArticlesCompo from '@/components/ArticlesCompo'
import CrearteArticle from '@/components/CrearteArticle'
import React, { useState } from 'react'

const page = () => {
 const [createArticle,setCreateArticle]=useState(false)



return (
    <div>


{createArticle && <CrearteArticle setCreateArticle={setCreateArticle} />}


{!createArticle && <ArticlesCompo setCreateArticle={setCreateArticle} />}



    </div>
  )
}

export default page