import { Send } from 'lucide-react'
import React from 'react'

type Props = {}

export default function Chat({}: Props) {
  return (
    <div className='flex flex-col items-center justify-center w-full h-full px-12 py-5'>
        <div className='h-full w-full'>
            <div className='bg-blue-400 w-4/5 py-2 px-1 rounded-xl mb-4'>
                system message
            </div>
            <div className='bg-blue-400 w-4/5 py-2 px-1 rounded-xl mb-4 ml-auto'>
                user message
            </div>
        </div>
        <div className='mt-auto w-full flex items-center bg-transparent border rounded-xl border-1 border-white px-2'>
            <input type='text' placeholder='Ask Away!' className='w-full h-12 px-2 bg-transparent focus:outline-none' />
            <Send  className='cursor-pointer hover:scale-125 transition-all duration-200'/>
        </div>
    </div>
  )
}