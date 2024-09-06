'use client'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { Lightbulb, WebcamIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function Interview({ params }) {
    const [interviewData, setInterviewData] = useState(null)
    const [webCamEnabled, setWebCamEnabled] = useState(false)
    const [loading, setLoading] = useState(true) // Adiciona um estado de carregamento

    useEffect(() => {
        if (params.interviewId) {
            GetInterviewDetails(params.interviewId)
        }
    }, [params.interviewId])

    const GetInterviewDetails = async (interviewId) => {
        try {
            const result = await db.select().from(MockInterview)
                .where(eq(MockInterview.mockId, interviewId))
            
            if (result.length > 0) {
                setInterviewData(result[0])
            } else {
                setInterviewData(null)
            }
        } catch (error) {
            console.error("Erro ao buscar detalhes da entrevista:", error)
            setInterviewData(null)
        } finally {
            setLoading(false) 
        }
    }

    return (
        <div className='my-10 flex flex-col items-center'>
            <h2 className='font-bold text-2xl mb-6'>
                Vamos começar!
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                <div className='flex flex-col gap-6'>
                    {loading ? (
                        <p>Carregando detalhes da entrevista...</p>
                    ) : interviewData ? (
                        <div className='flex flex-col gap-3 bg-[#f5f5f5] p-5 rounded-xl'>
                            <h2><strong>Cargo:</strong> {interviewData.jobPosition}</h2>
                            <h2><strong>Descrição das Stacks:</strong> {interviewData.jobDesc}</h2>
                            <h2><strong>Experiência:</strong> {interviewData.jobExperience}</h2>
                        </div>
                    ) : (
                        <p>Detalhes da entrevista não encontrados.</p>
                    )}
                    
                    <div className='flex flex-col items-start bg-yellow-100 rounded-xl p-4'>
                        <div className='flex items-center mb-1 text-yellow-500'>
                            <Lightbulb className='mr-2' /> 
                            <h2>Informação</h2>
                        </div>
                        <h2 className='text-yellow-500'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
                    </div>

                    <div className='flex justify-start'>
                        <Link href={'/dashboard/interview/'+params.interviewId+'/start'}>
                            <Button className='bg-[#0A74DA] text-white hover:text-black'>
                                Começar
                            </Button>
                        </Link>
                    </div>
                </div>
                
                <div className='flex flex-col items-center'>
                    {webCamEnabled ? (
                        <Webcam
                            onUserMedia={() => setWebCamEnabled(true)}
                            onUserMediaError={() => setWebCamEnabled(false)}
                            mirrored={true}
                            style={{
                                height: 315,
                                width: 315
                            }}
                        />
                    ) : (
                        <WebcamIcon className='h-72 my-0 w-full p-10 mb-7 bg-[#f5f5f5] rounded-lg' />
                    )}
                    <Button variant='ghost'
                        className='bg-[#0A74DA] text-white w-full hover:text-black'
                        onClick={() => setWebCamEnabled(true)}
                    >
                        Ligue a câmera e o microfone
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Interview
