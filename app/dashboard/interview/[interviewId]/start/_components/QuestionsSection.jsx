import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';
import RecordAnswerSection from './RecordAnswerSection';

// Ajuste para desestruturar a prop corretamente
function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex }) {


  const textToSpeach = (text) =>{
    if('speechSynthesis' in window){
      const speech = new SpeechSynthesisUtterance (text)
      window.speechSynthesis.speak(speech)
    } else{
      alert('Desculpe, seu navegador não suporta tal função')
    }
  }

  return mockInterviewQuestion && (
    <div className='p-5 rounded-3xl'>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5'>
            {Array.isArray(mockInterviewQuestion) && mockInterviewQuestion.length > 0 ? (
                mockInterviewQuestion.map((pergunta, index) => (
                    <h2
                      key={index}
                      className={`cursor-pointer border text-center p-2 rounded-xl ${activeQuestionIndex === index ? 'bg-[#0A74DA] text-white' : ''}`}
                    >
                      Pergunta #{index + 1}
                    </h2>
                ))
            ) : (
                <p>Nenhuma pergunta disponível.</p>
            )}
        </div>
        <div className='bg-[#f5f5f5] mt-5 rounded-xl p-5'>
            {mockInterviewQuestion[activeQuestionIndex] && (
              <h2 className='text-xl'>{mockInterviewQuestion[activeQuestionIndex]?.pergunta}
               <Volume2 className='cursor-pointer mt-5' onClick={()=>textToSpeach(mockInterviewQuestion[activeQuestionIndex]?.pergunta)}/></h2>
             
            )}
              <div className='flex flex-col rounded-lg p-4 mb-4 mt-10 bg-blue-200'>
                  <div className='flex gap-2  text-blue-600 mb-2'>
                      <Lightbulb />
                      <strong>Nota:</strong>
                  </div>
                  <h2 className='text-blue-600'>{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
              </div>
        </div>
        
        
    </div>
  );
}

export default QuestionsSection;
