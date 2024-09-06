'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

// Desestruture a prop 'interview' para obter 'jobPosition'
function InterviewItemCard({ interview }) {
  // Verifique se interview e jobPosition estão definidos
  const jobPosition = interview?.jobPosition || 'Posição não disponível';
  const jobExperience = interview?.jobExperience || 'Experiência não disponível';
  const createdAt = interview?.createdAt || 'Data não disponível';

  const router=useRouter()

  const onStart=()=>{
        router.push('/dashboard/interview/'+interview?.mockId)
  }

  const onFeedbackPress=()=>{
    router.push('/dashboard/interview/'+interview.mockId+"/feedback")
  }

  return (
    <div className='shadow-sm rounded-lg p-3 border mt-5'>
      <h2 className='font-bold text-[#0A74DA] mb-2'>{jobPosition}</h2>
      <h2 className='text-gray-700 mb-2'>{jobExperience} anos de experiência</h2>
      <h2 className='text-gray-500'>{`Criado em: ${createdAt}`}</h2>
      <div className='mt-2 flex  gap-2'>
      
        <Button onClick={onFeedbackPress} size='sm' variant='outline'  >Feedback</Button>
      
        <Button onClick={onStart} size='sm' className='bg-[#0A74DA] text-white hover:text-black'>Começar</Button>
       
      </div>
    </div>
  );
}

export default InterviewItemCard;
