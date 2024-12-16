"use client";
import { createContext, useContext, useState, useEffect } from "react";
import Loader from "@/components/loader";
import { IUser } from "@/types";
const AuthContext = createContext<{ user: IUser|null; setUser: any }>({ user: null, setUser: null });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
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
    }, []);
    return <AuthContext.Provider value={{ user, setUser }}>{loading ? <Loader /> : children}</AuthContext.Provider>;
}