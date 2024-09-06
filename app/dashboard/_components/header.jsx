"use client";

import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'



function Header() {

    const path = usePathname();
    useEffect(() => {
        console.log(path)
    }, [])


  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-md' >
        <Image src={'/logoazul.png'} width={50} height={50}/>
        <ul className=' hidden md:flex gap-6'>
            <li className={`hover:text-[#0A74DA] hover:font-bold transition-all ${path == '/dashboard'&& 'text-[#0A74DA] font-bold'}`}>Dashboard</li>
            <li className={`hover:text-[#0A74DA] hover:font-bold transition-all ${path == '/dashboard/perguntas'&& 'text-[#0A74DA] font-bold'}`}>Perguntas</li>
            <li className={`hover:text-[#0A74DA] hover:font-bold transition-all ${path == '/dashboard/upgrade'&& 'text-[#0A74DA] font-bold'}`}>Upgrade</li>
            <li className={`hover:text-[#0A74DA] hover:font-bold transition-all ${path == '/dashboard/como'&& 'text-[#0A74DA] font-bold'}`}>Como funciona</li>
        </ul>
        <UserButton/>
    </div>
  )
}

export default Header