import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';


const ListThreads = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hoveredThreadId, setHoveredThreadId] = useState<string | null>(null);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'threads'));
        const threadsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Thread[];
        setThreads(threadsData);
      } catch (error) {
        console.error('Error fetching threads from Firestore:', error);
        setError('Error fetching threads from Firestore.');
      }
    };

    fetchThreads();
  }, []);


  const deleteThread = async (threadId: string) => {
    try {
      await deleteDoc(doc(db, "threads" , threadId))
      console.log("deleting thread" , threadId)
      const updatedThreads = threads.filter(thread => thread.id !== threadId);
      setThreads(updatedThreads);
    } catch (error) {
      console.error('Error deleting thread from Firestore:', error);
      setError('Error deleting thread from Firestore.');
    }
  };

  const toggleLockThread = async (threadId: string) => {
    try {
      const thread = threads.find(thread => thread.id === threadId);
      if (thread) {
        const updatedThread = { ...thread, locked: !thread.locked };
        await updateDoc(doc(db, "threads", threadId), { locked: updatedThread.locked });
        setThreads(threads.map(thread => thread.id === threadId ? updatedThread : thread));
      }
    } catch (error) {
      console.error('Error locking thread in Firestore:', error);
      setError('Error locking thread in Firestore.');
    }
  };
    const handleMouseEnter = (id: string) => {
    setHoveredThreadId(id);
  };

  const handleMouseLeave = () => {
    setHoveredThreadId(null);
  };

  return (
    <main className="border-2 flex items-center justify-center rounded p-10 shadow-xl">
      <div className="w-full">
        <div className="text-white flex items-center justify-center flex-col">
          {error ? (
            <p className="text-red-500 text-xs italic">{error}</p>
          ) : (
            threads.map(thread => (
              <div key={thread.id} className="flex justify-between rounded items-center mb-4 p-4 border border-white w-full max-w-4xl">
                <Link href={`/threads/${thread.id}`}>{thread.title}</Link>
                <p className="mt-2 text-sm">{thread.category}</p>
                <div className="flex items-center">
                  <p className="text-sm text-slate-500">{new Date(thread.creationDate).toLocaleString()}</p>
                  <div
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(thread.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <FontAwesomeIcon
                      icon={thread.locked ? faLockOpen : faLock}
                      className={`ml-2 w-4 h-4 cursor-pointer text-black ${thread.locked ? 'opacity-50' : ''}`}
                      onClick={() => toggleLockThread(thread.id)}
                    />
                    {hoveredThreadId === thread.id && thread.locked && (
                      <div className="absolute top-0 left-0 mt-6 ml-2 p-2 bg-gray-700 text-white text-xs rounded">
                        Open Thread
                      </div>
                    )}
                  </div>
                  <button
                    className="ml-2 text-red-500 text-sm"
                    onClick={() => deleteThread(thread.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default ListThreads;