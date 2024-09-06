'use client';

import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import InterviewItemCard from './InterviewItemCard';

function InterviewList() {
    const { user } = useUser();
    const [interviews, setInterviews] = useState([]);

    useEffect(() => {
        if (user) {
            GetInterviewList();
        }
    }, [user]);

    const GetInterviewList = async () => {
        try {
            const result = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.createdBy, user?.primaryEmailAddress.emailAddress))
                .orderBy(desc(MockInterview.id));

            console.log(result);
            setInterviews(result);
        } catch (error) {
            console.error('Erro ao buscar a lista de entrevistas:', error);
        }
    };

    return (
        <div>
            <h2 className='font-medium text-lg mt-5'>Entrevistas anteriores</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {interviews.map((interview) => (
                    <InterviewItemCard
                        key={interview.id} // Use o identificador único
                        interview={interview}
                    />
                ))}
            </div>
        </div>
    );
}

export default InterviewList;
