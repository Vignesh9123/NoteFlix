"use client";
import { createContext, useContext, useState, useEffect } from "react";
import Loader from "@/components/loader";
import { IUser } from "@/types";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/config/firebase";
import { getAnalytics } from "firebase/analytics";
import { usePathname } from "next/navigation";
const AuthContext = createContext<{ user: IUser|null; setUser: any, loading: boolean|null}>({ user: null, setUser: null, loading: null });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    useEffect(() => {
        const awaitDelay = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
            const checkAuth = async () => {
                setLoading(true);
                await awaitDelay();
                
            const response = await fetch("/api/user/me",
                {
                    credentials: "include",
                }
            );
            if(response.ok) {
                const userResponse = await response.json();
                setUser(userResponse.user);
            }
            setLoading(false);
        };
        checkAuth();
        const app = initializeApp(firebaseConfig);
        getAnalytics(app);
    }, []);
    return <AuthContext.Provider value={{ user, setUser, loading }}>{(loading && pathname !== "/") ? <Loader /> : children}</AuthContext.Provider>;
}