'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { chatSession } from '@/utils/GeminiAi.Modal';
import { LoaderCircle } from 'lucide-react';
import { MockInterview } from '@/utils/schema';
import { db } from '@/utils/db';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobExperience, setJobExperience] = useState('');
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState('');
  const router = useRouter();
  const { user } = useUser();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const InputPrompt = `Cargo: ${jobPosition}, descrição da vaga: ${jobDesc} e experiencia: ${jobExperience}, crie ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} perguntas e respostas em JSON`;

    try {
      const result = await chatSession.sendMessage(InputPrompt);
      const MockJsonResp = (result.response.text()).replace('```json','').replace('```','');
      console.log(JSON.parse(MockJsonResp));
      setJsonResponse(MockJsonResp);

      if (MockJsonResp) {
        const resp = await db.insert(MockInterview).values({
          mockId: uuidv4(),
          jsonMockResp: MockJsonResp,
          jobPosition: jobPosition,
          jobDesc: jobDesc,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format('DD-MM-YYYY')
        }).returning({ mockId: MockInterview.mockId });

        console.log('ID:', resp[0]?.mockId);

        if (resp[0]?.mockId) {
          // Redireciona para a página da entrevista usando o ID gerado
          router.push(`/dashboard/interview/${resp[0]?.mockId}`);
        } else {
          console.error('Erro ao obter o ID da nova entrevista');
        }
      } else {
        console.error('Erro ao criar o MockJsonResp');
      }
    } catch (error) {
      console.error('Erro ao criar a entrevista:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='p-10 rounded-lg bg-[#f5f5f5] hover:scale-105 hover:shadow-md cursor-pointer transition-all' onClick={() => setOpenDialog(true)}>
        <h2 className='text-lg text-center'>
          + Adicionar
        </h2>
      </div>
      <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
        <DialogContent
          style={{
            backgroundColor: 'white'
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxSizing: 'border-box',
            }}
          >
            <DialogHeader>
              <DialogTitle className='font-bold text-2xl'>Nos conte mais sobre sua entrevista</DialogTitle>
              <DialogDescription>
                <form onSubmit={onSubmit}>
                  <div>
                    <h2 className='w-full'>Adicione detalhes sobre cargo, stacks e tempo de experiência</h2>
                    <div className='mt-7 my-2'>
                      <label>Cargo</label>
                      <Input placeholder='Ex.: Full Stack' required onChange={(event) => setJobPosition(event.target.value)} />
                    </div>
                    <div className='mt-7 my-2'>
                      <label>Descrição da vaga (stacks)</label>
                      <Textarea placeholder='Ex.: HTML, CSS, React...' required onChange={(event) => setJobDesc(event.target.value)} />
                    </div>
                    <div className='mt-7 my-2'>
                      <label>Tempo de experiência</label>
                      <Input placeholder='Ex.: 1, 5' type='number' required onChange={(event) => setJobExperience(event.target.value)} />
                    </div>
                  </div>
                  <div className='flex gap-5 justify-end mt-5'>
                    <Button type='button' variant='ghost' onClick={() => setOpenDialog(false)}>Cancelar</Button>
                    <Button type='submit' disabled={loading} className='bg-[#0A74DA] text-white hover:text-black'>
                      {loading ? <><LoaderCircle className='animate-spin' /> Criando perguntas com IA</> : 'Começar entrevista'}
                    </Button>
                  </div>
                </form>
              </DialogDescription>
            </DialogHeader>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
