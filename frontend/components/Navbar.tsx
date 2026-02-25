"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
    };

    return (
        <nav className="w-full border-b border-slate-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold text-white tracking-tighter">
                    Form<span className="text-neon-green">Xpert</span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        Dashboard
                    </Link>
                    <Link href="/dashboard/workouts" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        Workouts
                    </Link>
                    {user && (
                        <Link href="/dashboard/profile" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            Profile
                        </Link>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors focus:outline-none"
                            >
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                                    <User className="w-4 h-4" />
                                </div>
                                <span className="hidden sm:inline">{user.username}</span>
                                <ChevronDown className="w-4 h-4" />
                            </button>

                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 z-50">
                                    <Link
                                        href="/dashboard/profile"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        <User className="w-4 h-4" />
                                        Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 text-left"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                                Login
                            </Link>
                            <Link href="/register" className={cn(
                                "text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-slate-200 transition-colors"
                            )}>
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
