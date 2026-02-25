"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    _id: string;
    username: string;
    email: string;
    fullName: string;
    currentStreak: number;
    bestStreak: number;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (token: string) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            fetchUser(storedToken);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async (authToken: string) => {
        try {
            const res = await fetch('http://localhost:5000/api/auth/me', {
                headers: {
                    'x-auth-token': authToken
                }
            });
            if (res.ok) {
                const userData = await res.json();
                setUser(userData);
            } else {
                logout();
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (newToken: string) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        await fetchUser(newToken);
        router.push('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        router.push('/login');
    };

    const refreshUser = async () => {
        if (token) {
            await fetchUser(token);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
