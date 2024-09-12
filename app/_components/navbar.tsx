"use client"

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config"; 

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.firstName || "Username");
        } else {
          setUserName("Username");
        }
      } else {
        setIsLoggedIn(false);
        setUserName(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      setIsLoggedIn(false);
      setUserName(null);
    }).catch((error) => {
      console.error("Error signing out: ", error);
    });
  };

  return (
    <div className="flex justify-between bg-slate-200">
      <ul className="flex justify-center items-center text-teal-700 text-lg font-serif py-8 px-4 gap-x-3 bg-slate-200 font-bold">
        <Link href="/">
          Home
        </Link>
        <Link href="/create">
          Create
        </Link>
      </ul>
      <h1 className="flex items-center text-teal-700 text-6xl font-bold">
        Tech Hub
      </h1>
      <ul className="flex justify-center items-center text-teal-700 text-lg font-serif py-8 px-4 gap-x-3 bg-slate-200 font-bold">
        {isLoggedIn ? (
          <>
            <p>{userName}</p>
            <a href="#" onClick={handleLogout}>
              Logout
            </a>
          </>
        ) : (
          <>
            <Link href="/sign-up">
              Sign-Up
            </Link>
            <Link href="/sign-in">
              Login
            </Link>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;