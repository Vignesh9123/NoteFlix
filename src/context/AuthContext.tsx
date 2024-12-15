"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext<{ user: any; setUser: any }>({ user: null, setUser: null });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const user = localStorage.getItem("user");
        if(user) {
            setUser(JSON.parse(user));
        }
    }, []);
    return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}