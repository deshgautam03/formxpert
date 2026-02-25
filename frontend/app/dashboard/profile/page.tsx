"use client";

import { useState, useEffect } from "react";
import { User, Mail, Calendar, MapPin, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        location: "",
        joinDate: ""
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    router.push("/login");
                    return;
                }

                // Assuming backend is on port 5000
                const res = await fetch("http://127.0.0.1:5000/api/auth/me", {
                    headers: {
                        "x-auth-token": token
                    }
                });

                if (!res.ok) {
                    if (res.status === 401) {
                        localStorage.removeItem("token");
                        router.push("/login");
                        return;
                    }
                    const errorText = await res.text();
                    console.error(`Profile fetch error: ${res.status} ${res.statusText}`, errorText);
                    throw new Error(`Failed to fetch profile: ${res.status} ${errorText}`);
                }

                const data = await res.json();
                setFormData({
                    fullName: data.fullName || "",
                    email: data.email || "",
                    location: data.location || "",
                    joinDate: new Date(data.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                });
            } catch (err) {
                console.error(err);
                setMessage({ type: "error", text: "Failed to load profile" });
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage({ type: "", text: "" });

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://127.0.0.1:5000/api/auth/me", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": token || ""
                },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    location: formData.location,
                    email: formData.email
                })
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error(`Profile update error: ${res.status} ${res.statusText}`, errorText);
                throw new Error(`Failed to update profile: ${res.status} ${errorText}`);
            }

            setMessage({ type: "success", text: "Profile updated successfully" });
        } catch (err) {
            console.error(err);
            setMessage({ type: "error", text: "Failed to update profile" });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-neon-green animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-white">My Profile</h1>

            {message.text && (
                <div className={`p-4 rounded-lg ${message.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="md:col-span-1 space-y-6">
                    <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col items-center text-center">
                        <div className="w-32 h-32 rounded-full bg-slate-800 mb-4 flex items-center justify-center">
                            <User className="w-16 h-16 text-slate-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white">{formData.fullName || "User"}</h2>
                        <p className="text-slate-400">Fitness Enthusiast</p>
                        <button className="mt-4 w-full py-2 px-4 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors">
                            Edit Avatar
                        </button>
                    </div>
                </div>

                {/* Details Form */}
                <div className="md:col-span-2">
                    <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-6">
                        <h3 className="text-xl font-bold text-white mb-4">Personal Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Full Name</label>
                                <div className="flex items-center px-4 py-3 bg-black border border-slate-800 rounded-lg">
                                    <User className="w-5 h-5 text-slate-500 mr-3" />
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="bg-transparent text-white outline-none w-full"
                                        placeholder="Enter full name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Email</label>
                                <div className="flex items-center px-4 py-3 bg-black border border-slate-800 rounded-lg">
                                    <Mail className="w-5 h-5 text-slate-500 mr-3" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="bg-transparent text-white outline-none w-full"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Location</label>
                                <div className="flex items-center px-4 py-3 bg-black border border-slate-800 rounded-lg">
                                    <MapPin className="w-5 h-5 text-slate-500 mr-3" />
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="bg-transparent text-white outline-none w-full"
                                        placeholder="Enter location"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Join Date</label>
                                <div className="flex items-center px-4 py-3 bg-black border border-slate-800 rounded-lg">
                                    <Calendar className="w-5 h-5 text-slate-500 mr-3" />
                                    <input type="text" value={formData.joinDate} disabled className="bg-transparent text-slate-500 outline-none w-full cursor-not-allowed" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-800 flex justify-end">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-6 py-3 bg-neon-green text-black font-bold rounded-lg hover:bg-[#b3ff00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
