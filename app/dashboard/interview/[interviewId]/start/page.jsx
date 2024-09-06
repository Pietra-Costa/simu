'use client';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function StartInterview({ params }) {
    const [interviewData, setInterviewData] = useState(null);
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState(null);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const router = useRouter(); // Inicializa o useRouter

    useEffect(() => {
        if (params.interviewId) {
            GetInterviewDetails(params.interviewId);
        }
    }, [params.interviewId]);

    const GetInterviewDetails = async (interviewId) => {
        try {
            const result = await db.select().from(MockInterview)
                .where(eq(MockInterview.mockId, interviewId));

            // Verifica se o resultado não está vazio
            if (result.length > 0) {
                const data = result[0];
                console.log('Dados da entrevista:', data);

                // Verifica se jsonMockResp existe no resultado
                if (data.jsonMockResp) {
                    const jsonMockResp = JSON.parse(data.jsonMockResp);
                    console.log('JSON Mock Response:', jsonMockResp);
                    setMockInterviewQuestion(jsonMockResp);
                } else {
                    console.error('jsonMockResp não encontrado no resultado');
                }

                setInterviewData(data);
            } else {
                console.error('Nenhum resultado encontrado para o interviewId:', interviewId);
            }
        } catch (error) {
            console.error('Erro ao buscar detalhes da entrevista:', error);
        }
    };

    // Função para redirecionar para a página de feedback
    const handleRedirectToFeedback = () => {
        const feedbackUrl = `/dashboard/interview/${interviewData?.mockId}/feedback`;
        router.push(feedbackUrl);
    };

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2'>
                <QuestionsSection
                    mockInterviewQuestion={mockInterviewQuestion}
                    activeQuestionIndex={activeQuestionIndex}
                />
                <RecordAnswerSection
                    mockInterviewQuestion={mockInterviewQuestion}
                    activeQuestionIndex={activeQuestionIndex}
                    interviewData={interviewData}
                />
            </div>
            <div className='flex justify-end gap-6'>
                {activeQuestionIndex > 0 && (
                    <Button
                        onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
                        className="bg-[#0A74DA] text-white hover:text-black"
                    >
                        Questão anterior
                    </Button>
                )}
                {activeQuestionIndex < (mockInterviewQuestion?.length - 1) && (
                    <Button
                        onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
                        className="bg-[#0A74DA] text-white hover:text-black"
                    >
                        Próxima questão
                    </Button>
                )}
                {activeQuestionIndex === (mockInterviewQuestion?.length - 1) && interviewData?.mockId && (
                    <Button
                        onClick={handleRedirectToFeedback}
                        className="bg-[#0A74DA] text-white hover:text-black"
                    >
                        Finalizar entrevista
                    </Button>
                )}
            </div>
        </div>
    );
}

export default StartInterview;
