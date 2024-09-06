'use client'
import { UserButton } from '@clerk/nextjs'
import React from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'

function Dashboard() {
  return (
    <div className='p-10'>
      <header className='mb-6'>
        <h2 className='font-bold text-2xl'>Dashboard</h2>
        <h2 className='text-gray-500'>Crie e comece sua simulação de entrevista</h2>
      </header>

      

      <AddNewInterview />
      <InterviewList/>
      
    </div>

    
  )
}

export default Dashboard
