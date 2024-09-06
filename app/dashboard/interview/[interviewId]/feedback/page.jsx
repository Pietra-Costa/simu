'use client';
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

function Feedback({ params }) {
    const [feedbackList, setFeedbackList] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const router = useRouter()

    useEffect(() => {
        if (params.interviewId) {
            GetFeedback()
        }
    }, [params.interviewId])

    const GetFeedback = async () => {
        try {
            setLoading(true)
            const result = await db
                .select()
                .from(UserAnswer)
                .where(eq(UserAnswer.mockIdRef, params.interviewId))
                .orderBy(UserAnswer.id)

            console.log(result)
            setFeedbackList(result) // Atualiza o estado com os resultados
        } catch (error) {
            console.error('Erro ao buscar feedback:', error)
            setError('Erro ao buscar feedback.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='p-10'>
            <h2 className='text-2xl font-bold text-[#0A74DA]'>Parabéns! Você finalizou sua entrevista</h2>
            <h2 className='font-bold text-1xl'>Aqui está o feedback da sua entrevista :)</h2>
           

            <h2 className='font-sm'>Aqui está a sua resposta, ideias de resposta gerada por IA, além do seu feedback</h2>

            {loading && <p>Carregando feedback...</p>}
            {error && <p>{error}</p>}
            {feedbackList.length > 0 && !loading && !error ? (
                feedbackList.map((item, index) => (
                    <Collapsible key={index}>
                        <CollapsibleTrigger className='text-left p-2 bg-[#f5f5f5] rounded-lg my-2 flex justify-between items-center min-h-[80px] w-full'>
                            <span className='flex-1'>{item.question || "Questão"}</span>
                            <ChevronsUpDown className='h-5 w-5' />
                        </CollapsibleTrigger>
                        <CollapsibleContent className='flex flex-col gap-2'>
                            <p className='p-3 bg-[#e0f7fa] rounded-lg min-h-[100px] w-full'>
                                <strong>Resposta do usuário:</strong> {item.userAns || "Não disponível"}
                            </p>
                            <p className='p-3 bg-[#e8f5e9] rounded-lg min-h-[100px] w-full'>
                                <strong>Feedback:</strong> {item.feedback || "Não disponível"}
                            </p>
                        </CollapsibleContent>
                    </Collapsible>
                ))
            ) : (
                !loading && !error && <p>Não há feedback disponível.</p>
            )}
            
            <Button onClick={() => router.replace('/dashboard')} className='bg-[#0A74DA] text-white hover:border hover:text-black'>
                Voltar ao Home
            </Button>
        </div>
    )
}

export default Feedback
