"use client"
import AdminSidebar from '@/components/AdminSidebar'
import LoadingCompo from '@/components/LoadingCompo'
import { base_url } from '@/components/store/config'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const layout = ({ children }: LayoutProps<"/">) => {
const [loading,setLoading]=useState(true)
 const routes = useRouter()

const fetchAdmin = async()=>{
setLoading(true)
  try {
    const response = await axios.get(`${base_url}/auth/admin-verify`,{
      withCredentials:true
    })
    const data = await response.data
    if(data.success){
setLoading(false)
    }else{
routes.push("/login")
    }
  } catch (error) {
routes.push("/login")

  }
}



useEffect(()=>{
fetchAdmin()
},[])

if(loading){
  return (
    <div className='h-screen flex items-center justify-center'>

<LoadingCompo />

      </div>
  )
}

  return (
    <div className=' h-screen p-0 m-0 flex'>
      <div className=''>
      <AdminSidebar />
      </div> 
      
      <div className='flex-1 '>
      {children}

      </div>
      
      </div>
  )
}

export default layout