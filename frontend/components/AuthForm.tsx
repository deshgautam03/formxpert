"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface AuthFormProps {
    type: "login" | "register";
}

export default function AuthForm({ type }: AuthFormProps) {
    const router = useRouter();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        fullName: "",
        location: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const endpoint = type === "login" ? "/api/auth/login" : "/api/auth/register";
            // Note: In a real app, this would point to the backend URL
            // For now we'll simulate a delay or use a relative path if proxy is set up
            // Assuming backend is on port 5000, we might need a full URL or proxy
            const backendUrl = process.env.NODE_ENV === "production" 
                ? "https://formxpert-backend.onrender.com" 
                : "http://localhost:5000";

            const res = await fetch(`${backendUrl}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.msg || "Something went wrong");
            }

            // Store token
            await login(data.token);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tighter text-white">
                    {type === "login" ? "Welcome Back" : "Create Account"}
                </h1>
                <p className="text-slate-400">
                    {type === "login"
                        ? "Enter your credentials to access your account"
                        : "Enter your details to start your fitness journey"}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {type === "register" && (
                    <>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Full Name</label>
                            <input
                                suppressHydrationWarning
                                type="text"
                                className="w-full px-4 py-2 bg-black border border-slate-800 rounded-lg focus:ring-2 focus:ring-neon-green focus:border-transparent outline-none text-white transition-all"
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Location</label>
                            <input
                                suppressHydrationWarning
                                type="text"
                                className="w-full px-4 py-2 bg-black border border-slate-800 rounded-lg focus:ring-2 focus:ring-neon-green focus:border-transparent outline-none text-white transition-all"
                                placeholder="New York, USA"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Username</label>
                            <input
                                suppressHydrationWarning
                                type="text"
                                required
                                className="w-full px-4 py-2 bg-black border border-slate-800 rounded-lg focus:ring-2 focus:ring-neon-green focus:border-transparent outline-none text-white transition-all"
                                placeholder="johndoe"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                    </>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Email</label>
                    <input
                        suppressHydrationWarning
                        type="email"
                        required
                        className="w-full px-4 py-2 bg-black border border-slate-800 rounded-lg focus:ring-2 focus:ring-neon-green focus:border-transparent outline-none text-white transition-all"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Password</label>
                    <input
                        suppressHydrationWarning
                        type="password"
                        required
                        className="w-full px-4 py-2 bg-black border border-slate-800 rounded-lg focus:ring-2 focus:ring-neon-green focus:border-transparent outline-none text-white transition-all"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg">
                        {error}
                    </div>
                )}

                <button
                    suppressHydrationWarning
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 font-bold text-black bg-neon-green rounded-lg hover:bg-[#b3ff00] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (type === "login" ? "Sign In" : "Sign Up")}
                </button>
            </form>

            <div className="text-center text-sm text-slate-400">
                {type === "login" ? (
                    <>
                        Don't have an account?{" "}
                        <Link href="/register" className="text-neon-green hover:underline">
                            Sign up
                        </Link>
                    </>
                ) : (
                    <>
                        Already have an account?{" "}
                        <Link href="/login" className="text-neon-green hover:underline">
                            Sign in
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
