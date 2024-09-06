'use client';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAi.Modal';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
    const [userAnswer, setUserAnswer] = useState('');
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false,
    });

    useEffect(() => {
        results.forEach(result => {
            setUserAnswer(prevAns => prevAns + result?.transcript);
        });
    }, [results]);

    useEffect(() => {
        if (!isRecording && userAnswer.length > 10) {
            UpdateUserAnswer();
        }
    }, [isRecording, userAnswer]);

    const StartStopRecording = async () => {
        if (isRecording) {
            stopSpeechToText();
        } else {
            startSpeechToText();
        }
    };

    const UpdateUserAnswer = async () => {
        console.log('Atualizando resposta do usuário:', userAnswer);
        setLoading(true);
    
        const feedbackPrompt = `Pergunta: ${mockInterviewQuestion[activeQuestionIndex]?.pergunta}, resposta do usuário: ${userAnswer}. Dependendo da pergunta e da resposta, dê uma avaliação para a resposta e um feedback do que pode melhorar em 3 a 5 linhas em JSON com campo de avaliação e de feedback.`;
    
        try {
            console.log('Enviando prompt para o chatSession:', feedbackPrompt);
            const result = await chatSession.sendMessage(feedbackPrompt);
            console.log('Resultado da resposta:', result);
    
            // Verifique o formato da resposta
            const responseText = await result.response.text();
            console.log('Resposta do chatSession:', responseText);
            const mockJsonResp = responseText.replace('```json', '').replace('```', '');
            console.log('JSON de resposta:', mockJsonResp);
    
            const JsonFeedbackResp = JSON.parse(mockJsonResp);
            console.log('Feedback JSON:', JsonFeedbackResp);
    
            // Inserir no banco de dados
            const resp = await db.insert(UserAnswer).values({
                mockIdRef: interviewData?.mockId,
                question: mockInterviewQuestion[activeQuestionIndex]?.pergunta,
                userAns: userAnswer,
                feedback: JsonFeedbackResp?.feedback,
                rating: JsonFeedbackResp?.rating,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('YYYY-MM-DD')
            });
    
            console.log('Resposta gravada no banco de dados:', resp);
    
            if (resp) {
                toast('Resposta gravada com sucesso');
            }
            
            // Limpar o campo de resposta do usuário
            setUserAnswer('');
            setResults([])
            
        } catch (error) {
            console.error('Erro ao processar a resposta:', error);
            toast('Erro ao processar sua resposta');
        } finally {
            setLoading(false);
        }
    };

    const [isWebcamActive, setIsWebcamActive] = useState(false);

    const handleUserMedia = () => {
        setIsWebcamActive(true);
    };

    const handleUserMediaError = () => {
        setIsWebcamActive(false);
    };

    return (
        <div className='mt-5 relative flex flex-col justify-center items-center bg-[#f5f5f5] rounded mb-5'>
            {!isWebcamActive && (
                <Image
                    src='/webcam.png'
                    alt='Webcam Background'
                    width={200}
                    height={200}
                    className='absolute z-10'
                />
            )}
            <div className='relative'>
                <Webcam
                    style={{
                        height: '300px',
                        width: '100%',
                        zIndex: 1
                    }}
                    onUserMedia={handleUserMedia}
                    onUserMediaError={handleUserMediaError}
                />
                <div className='flex flex-col gap-4 mt-5 mb-5'>
                    <Button
                        disabled={loading}
                        onClick={StartStopRecording}
                        className='bg-[#0A74DA] text-white rounded-xl hover:bg-white hover:text-black'
                    >
                        {isRecording ? (
                            <>
                                <h2 className='text-red-600 flex gap-2'>
                                    <Mic className='inline-block mr-2' />
                                    Gravando...
                                </h2>
                            </>
                        ) : (
                            'Gravar resposta'
                        )}
                    </Button>

                    
                </div>
            </div>
        </div>
    );
}

export default RecordAnswerSection;
