'use client';
import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <Image
            src="/foto1.jpg"
            alt="Descrição da imagem"
            layout='fill'
            objectFit='cover'
          />
          <div className="hidden lg:relative lg:block lg:p-12">
            <a className="block text-white" href="#">
              <span className="sr-only">Home</span>
            </a>
            <div className="relative bg-gray-800 bg-opacity-50 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-300 sm:text-3xl md:text-4xl">
                Welcome to SimuTalk
              </h2>
              <p className="mt-4 leading-relaxed text-gray-200">
                Faça login para acessar o SimuTalk, onde você pode praticar e melhorar suas habilidades para entrevistas de emprego. Prepare-se para o sucesso com simulações realistas e feedback valioso!
              </p>
            </div>
          </div>
        </section>

        <main
          className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-10 lg:py-12 xl:col-span-6"
        >
          <div className="max-w-xl lg:max-w-3xl">
            <div className="relative -mt-16 block lg:hidden">
              <a
                className="inline-flex size-16 items-center justify-center rounded-full bg-white text-blue-600 sm:size-20"
                href="#"
              >
                <span className="sr-only">Home</span>
              </a>

              <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                Welcome to SimuTalk
              </h1>

              <p className="mt-4 leading-relaxed text-gray-500">
                Faça login para acessar o SimuTalk, onde você pode praticar e melhorar suas habilidades para entrevistas de emprego. Prepare-se para o sucesso com simulações realistas e feedback valioso!
              </p>
            </div>

            <SignIn 
              afterSignInUrl='/dashboard' // Redireciona para o dashboard após o login
            />          
          </div>
        </main>
      </div>
    </section>
  )
}
