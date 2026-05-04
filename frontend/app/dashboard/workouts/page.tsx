"use client";

import { Search, Play } from "lucide-react";

const workouts = [
    { id: 1, name: "Squat", category: "Legs", difficulty: "Beginner", image: "/images/exercises/squat.jpg" },
    { id: 2, name: "Push Up", category: "Chest", difficulty: "Beginner", image: "/images/exercises/push-up.jpg" },
    { id: 3, name: "Plank", category: "Core", difficulty: "Intermediate", image: "/images/exercises/plank.jpg" },
    { id: 4, name: "Lunge", category: "Legs", difficulty: "Beginner", image: "/images/exercises/lunge.jpg" },
    { id: 5, name: "Bicep Curl", category: "Arms", difficulty: "Beginner", image: "/images/exercises/bicep-curl.jpg" },
    { id: 6, name: "Shoulder Press", category: "Shoulders", difficulty: "Intermediate", image: "/images/exercises/shoulder-press.jpg" },
    { id: 7, name: "Sitting Posture", category: "Posture", difficulty: "Beginner", image: "/images/exercises/shoulder-press.jpg" },
];

import { useRouter } from "next/navigation";

export default function WorkoutsPage() {
    const router = useRouter();

    const handleStartWorkout = (workoutId: number) => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        router.push(`/dashboard/workout/${workoutId}`);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-white">Workout Library</h1>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search exercises..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-neon-green outline-none"
                        suppressHydrationWarning
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workouts.map((workout) => (
                    <div key={workout.id} className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-neon-green/50 transition-all">
                        <div className="aspect-video bg-slate-800 relative">
                            {/* Placeholder for image */}
                            <img
                                src={workout.image}
                                alt={workout.name}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-3 items-center justify-center">
                                <button
                                    onClick={() => handleStartWorkout(workout.id)}
                                    className="flex items-center gap-2 px-6 py-3 bg-neon-green text-black font-bold rounded-full transform scale-90 group-hover:scale-100 transition-transform hover:bg-[#b3ff00]"
                                    suppressHydrationWarning
                                >
                                    <Play className="w-5 h-5" /> Start
                                </button>
                                {/* Only show View Details for hardcoded squat and pushup for now since that's what we have data for, or route generic IDs */}
                                <button
                                    onClick={() => router.push(`/exercises/${workout.name.toLowerCase().replace(' ', '')}`)}
                                    className="flex items-center gap-2 px-6 py-3 bg-slate-800 text-white font-bold rounded-full transform scale-90 group-hover:scale-100 transition-transform hover:bg-slate-700"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium px-2 py-1 bg-slate-800 text-slate-300 rounded">{workout.category}</span>
                                <span className="text-xs font-medium text-neon-blue">{workout.difficulty}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white">{workout.name}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
