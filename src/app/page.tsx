'use client';

import { useState } from 'react';
import clsx from 'clsx';
import styles from '@/app/ui/home.module.scss';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [data, setData] = useState('');
  const [isLoading, setLoadinig] = useState(false);

  const handleEvaluate = async () => {
    try {
      setLoadinig(true);
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body: prompt }),
      });

      const responseData = await response.json();
      if (response.ok) {
        console.log(responseData);
        setData(responseData.text);
      } else {
        console.error(responseData.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadinig(false);
    }
  };

  return (
    <main className='flex min-h-screen flex-col items-center p-12'>
      <div className='max-w-5xl w-full flex-col items-center justify-center text-sm lg:flex'>
        <p className='text-3xl mb-4 font-bold text-gray-600'>Code Evaluator</p>
        <div className='relative flex items-center w-full rounded-lg focus-within:shadow-md bg-transparent overflow-hidden'>
          <textarea
            className={clsx(
              'peer h-full w-full outline-none bg-gray-100 text-sm text-gray-700 p-4',
              styles.codeTextarea
            )}
            placeholder='Enter your code...'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>
        </div>
        <button
          className={clsx(
            'bg-blue-500 text-white px-5 py-3 mt-7 hover:bg-blue-600 m-2',
            {
              'disabled:opacity-50 disabled:cursor-not-allowed':
                isLoading || !prompt,
            }
          )}
          disabled={isLoading || !prompt}
          onClick={handleEvaluate}
        >
          Evaluate
        </button>

        {data && !isLoading && (
          <div
            className={clsx(
              'bg-transparent border-2 border-gray-300 rounded mt-7 p-4',
              styles.markDown
            )}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{data}</ReactMarkdown>
          </div>
        )}

        {isLoading && (
          <div className='bg-transparent border-2 border-gray-300 rounded mt-7 p-4'>
            <div className='animate-pulse'>
              <div className='flex-1 space-y-4 py-1'>
                <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                <div className='space-y-2'>
                  <div className='h-4 bg-gray-200 rounded'></div>
                  <div className='h-4 bg-gray-200 rounded w-5/6'></div>
                </div>
              </div>
              <div className='flex-1 space-y-4 py-1 mt-4'>
                <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                <div className='space-y-2'>
                  <div className='h-4 bg-gray-200 rounded'></div>
                </div>
              </div>
              <div className='flex-1 space-y-4 py-1 mt-6'>
                <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                <div className='space-y-1'>
                  <div className='h-4 bg-gray-200 rounded'></div>
                  <div className='h-4 bg-gray-200 rounded w-4/5'></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
