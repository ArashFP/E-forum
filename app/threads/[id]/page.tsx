"use client";

import Navbar from '@/app/_components/navbar';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

const ThreadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [thread, setThread] = useState<Thread | null>(null);
  const [comment, setComment] = useState<string>("");

  const router = useRouter()

  useEffect(() => {
    const fetchThread = async () => {
      if (id) {
        const docRef = doc(db, 'threads', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setThread(docSnap.data() as Thread);
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchThread();
  }, [id]);

  const handleAddComment = async () => {
    if (thread && comment && !thread.locked) {
      const newComment: ThreadComment = {
        id: Math.random().toString(36).substring(2, 9), // Generate a random string ID
        thread: thread.id,
        content: comment,
        creator: { userName: "Anonymous", password: "", email: "example@mail.com" },
      };

      const updatedThread = {
        ...thread,
        comments: [...thread.comments, newComment],
      };

      try {
        const docRef = doc(db, 'threads', thread.id);
        await updateDoc(docRef, { comments: updatedThread.comments });
        setThread(updatedThread);
        setComment("");
      } catch (error) {
        console.error('Error updating thread in Firestore:', error);
      }
    }
  };

  if (!thread) {
    return <p className="text-red-500 text-center text-8xl">Thread not found.</p>;
  }

  return (
    <div className="bg-gray-700 h-screen font-serif">
      <Navbar />
      <main className="flex items-center justify-center p-10">
        <div className="grid-cols-1 bg-gray-400 md:grid-cols-2">
          <div className="flex items-center justify-center flex-col">
            <div className="w-[700px]  shadow-xl border-opacity-50 mt-3 p-9 rounded">
              <h1 className="font-bold text-center mt-7 text-5xl text-white">{thread.title}</h1>
              <p className="font-bold text-start text-2xl mt-10 py-3 text-white">{thread.description}</p>
              <p className="text-sm m-2 text-right text-gray-500 font-bold">{new Date(thread.creationDate).toLocaleString()}</p>
              <hr className="mt-4" />
              <div className="my-4 p-9">
                {thread.comments.map(comment => (
                  <div key={comment.id} className="mb-4">
                    <p className="bg-slate-200 rounded p-2 text-teal-900">{comment.content}</p>
                    <p className="text-white">{comment.creator.userName}</p>
                  </div>
                ))}
                {!thread.locked && (
                  <>
                    <hr className="mt-7" />
                    <div className='relative flex items-center right-5 mt-2 w-[600px]'>
                      <div
                        className="text-white m-4 p-5 rounded-md w-[800px] h-[80px] border border-white-300"
                        contentEditable
                        onInput={(e) => setComment((e.target as HTMLDivElement).innerText)}
                      />
                      <button
                        className="mt-2 bg-blue-500 text-white px-3 rounded"
                        onClick={handleAddComment}
                      >
                        Add Comment
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ThreadDetail;