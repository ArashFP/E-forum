'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/config'; 

const CreateThread = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ThreadCategory>('Thread'); 
  const [creator, setCreator] = useState<User>({ userName: 'defaultUser', password: 'defaultPassword', email: "default@mail.com" }); 

  const router = useRouter();

  const handleCreateThread = async () => {
    try {
      const docRef = await doc(collection(db, 'threads'));
      await setDoc(docRef, {
        id: docRef.id,
        title,
        category,
        creationDate: new Date().toISOString(),
        description,
        creator,
        comments: [],
        locked: false,
      })
      console.log('Thread saved to Firestore:');
      console.log(docRef.id)
      router.push('/');
    } catch (error) {
      console.error('Error saving thread to Firestore:', error);
    }
  };

  return (
    <main className="bg-gray-400 border-2 border-black flex items-center justify-center p-10 shadow-xl">
      <div className="w-[800px] grid-cols-1 bg-blue md:grid-cols-2">
        <div className="bg-gray-400 h-full text-black pt-5 items-center justify-center">
          <div className="mx-auto w-full p-6 rounded">
            <h1 className="text-2xl font-bold mb-4">Create new thread:</h1>
            <form onSubmit={(e) => { e.preventDefault(); handleCreateThread(); }}>
              <div className="mb-4">
                <label htmlFor="title" className="block mt-4 text-lg text-black">Title:</label>
                <input
                  className="mt-2 mb-4 bg-transparent rounded-full border border-black p-2 w-full"
                  type="text"
                  id="title"
                  placeholder="Thread name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="Category" className="block mt-4 text-lg text-black">Category:</label>
                <select
                  className="mt-2 mb-4 bg-white rounded-full border border-black p-2"
                  id="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ThreadCategory)}
                >
                  <option className="bg-gray-500" value="Thread">Thread</option>
                  <option className="bg-gray-500" value="QNA">QNA</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="content" className="block mt-4 text-lg text-black">Content:</label>
                <textarea
                  className="mt-2 mb-4 bg-transparent rounded-lg w-full h-32 border p-2 border-black"
                  id="content"
                  placeholder="Write your content here"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <button type="submit" className="w-full mt-6 text-black border-black border-2 h-12 rounded-full hover:bg-white">Create new thread</button>
              </div> 
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CreateThread;