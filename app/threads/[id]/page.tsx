"use client";

import Navbar from '@/app/_components/navbar';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { onAuthStateChanged } from 'firebase/auth';

const ThreadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [thread, setThread] = useState<Thread | null>(null);
  const [comment, setComment] = useState<string>("");
  const [checkedCommentId, setCheckedCommentId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const fetchThread = async () => {
      if (id) { 
        //find document with id from params, this becomes the docSnap
        const docRef = doc(db, 'threads', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          //if docSnap exists, set the thread to the data of the docSnap(document)
          const threadData = docSnap.data() as Thread;
          setThread(threadData);
          //find the first comment that is checked and set the checkedCommentId to the id of that comment
          const checkedComment = threadData.comments.find(comment => comment.isChecked);
          if (checkedComment) {
            //set the checkedCommentId to the id of the checked comment
            setCheckedCommentId(checkedComment.id);
          }
        } else {
          console.log("No such document!");
        }
      }
    };
  
    fetchThread();
  }, [id]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  const handleAddComment = async () => {
    if (thread && comment && !thread.locked) {
      const newComment: ThreadComment = {
        id: Math.random().toString(36).substring(2, 9),
        thread: thread.id,
        content: comment,
        creator: { userName: "Anonymous", password: "", email: "example@mail.com" },
        isChecked: false,
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

const toggleCheckComment = async (commentId: string) => {
  if (thread) {
    const updatedComments = thread.comments.map(comment => {
      if (comment.id === commentId) {
        // Toggle the isChecked status of the clicked comment
        return { ...comment, isChecked: !comment.isChecked };
      } else if (comment.isChecked) {
        // Uncheck any other previously checked comment
        return { ...comment, isChecked: false };
      }
      return comment;
    });

    const updatedThread = {
      ...thread,
      comments: updatedComments,
    };

    try {
      const docRef = doc(db, 'threads', thread.id);
      await updateDoc(docRef, { comments: updatedThread.comments });
      setThread(updatedThread);
      setCheckedCommentId(prevId => (prevId === commentId ? null : commentId));
    } catch (error) {
      console.error('Error updating comment in Firestore:', error);
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
                    <p className={`rounded p-2 text-teal-900 ${checkedCommentId === comment.id ? 'bg-green-200 border border-green-500' : 'bg-slate-200'}`}>
                      {comment.content}
                      {thread.category === "QNA" && isLoggedIn && (
                        <button
                          className={`ml-2 float-right ${checkedCommentId === comment.id ? 'text-green-500' : 'text-red-500'}`}
                          onClick={() => toggleCheckComment(comment.id)}
                          title={checkedCommentId === comment.id ? 'Uncheck Comment' : 'Check Comment'}
                        >
                          <FontAwesomeIcon icon={faCheck} className='text-2xl' />
                        </button>
                      )}
                    </p>
                    <p className="text-white">{comment.creator.userName}</p>
                  </div>
                ))}
                {thread.locked ? (
                  <div className="mt-7 p-4 bg-red-500 text-white rounded">
                    This thread is locked. No comments can be made.
                  </div>
                ) : (
                  isLoggedIn && (
                    <>
                      <hr className="mt-7" />
                      <div className='relative flex items-center right-5 mt-2 w-[600px]'>
                        <div
                          className="text-black bg-white m-4 p-5 rounded-md w-[800px] h-[80px] border border-white-300"
                          contentEditable
                          onInput={(e) => setComment((e.target as HTMLDivElement).innerText)}
                        />
                        <button
                          className="mt-2 bg-black text-white px-3 rounded"
                          onClick={handleAddComment}
                        >
                          Add Comment
                        </button>
                      </div>
                    </>
                  )
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