'use client'

import { auth } from "@/firebase/config"
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updateProfile, User } from "firebase/auth"
import { createContext, useContext ,useEffect, useState, ReactNode } from "react"
import toast from "react-hot-toast"

interface AuthContextType {
    user: User | null;
    authLoaded: boolean;
    register: (values: { email: string; password: string }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthContextProviderProps {
    children: ReactNode;
}

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [authLoaded, setAuthLoaded] = useState(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, _user => {
            setUser(_user);
            setAuthLoaded(true);
        });

        return () => unsub();
    }, []);

    const register = async (values: { email: string; password: string }): Promise<void> => {
        const toastId = toast.loading('Creating account...');
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);

            if (!userCredential.user) {
                throw new Error('Something went wrong, please try again later.');
            }
            console.log(userCredential);
        } catch (error) {
            console.error(error);
        } finally {
            toast.dismiss(toastId);
        }
    };

    return (
        <AuthContext.Provider value={{ user, authLoaded, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;

export const useAuth = () => {
  const context = useContext(AuthContext)
  if(!context) throw new Error('useAuth must be inside an AuthcontextProvider')

  return context
}