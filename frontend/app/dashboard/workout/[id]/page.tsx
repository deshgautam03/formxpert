"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import PoseDetector from "@/components/PoseDetector";
import { AlertCircle, CheckCircle, XCircle, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Mock data - in a real app this would come from an API or shared constant
const workoutsData: Record<string, { name: string; instructions: string[] }> = {
    "1": {
        name: "Squat",
        instructions: [
            "Keep your back straight",
            "Lower hips until parallel",
            "Keep knees aligned with toes",
            "Return to standing position"
        ]
    },
    "2": {
        name: "Pushup",
        instructions: [
            "Start in a high plank position",
            "Lower your body until chest nearly touches floor",
            "Keep elbows at 45-degree angle",
            "Push back up to starting position"
        ]
    },
    "3": {
        name: "Plank",
        instructions: [
            "Maintain a straight line from head to heels",
            "Engage your core",
            "Hold the position",
            "Don't let your hips sag"
        ]
    },
    "4": {
        name: "Lunge",
        instructions: [
            "Step forward with one leg",
            "Lower hips until both knees are at 90 degrees",
            "Keep front knee behind toe",
            "Push back to starting position"
        ]
    },
    "5": {
        name: "Bicep Curl",
        instructions: [
            "Stand with dumbbells in hand",
            "Keep elbows close to torso",
            "Curl weights while contracting biceps",
            "Lower weights slowly"
        ]
    },
    "6": {
        name: "Shoulder Press",
        instructions: [
            "Hold weights at shoulder level",
            "Press weights overhead",
            "Extend arms fully but don't lock elbows",
        ]
    },
    "7": {
        name: "Sitting Posture",
        instructions: [
            "Sit comfortably with your side to the camera",
            "Ensure your ear, shoulder, and hip are visible",
            "Keep your back straight and head up",
            "The system tracks your good posture time"
        ]
    }
};

export default function WorkoutSessionPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const { token, refreshUser, logout } = useAuth();



    const [feedback, setFeedback] = useState("Get ready...");
    const [isCorrect, setIsCorrect] = useState(true);
    const [reps, setReps] = useState(0);
    const [workout, setWorkout] = useState(workoutsData["1"]); // Default to Squat
    const [startTime] = useState(Date.now());
    const [mistakes, setMistakes] = useState<string[]>([]);
    const [totalFrames, setTotalFrames] = useState(0);
    const [goodFrames, setGoodFrames] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (id && workoutsData[id]) {
            setWorkout(workoutsData[id]);
        }
    }, [id]);

    const handleFeedback = (msg: string, correct: boolean) => {
        setFeedback(msg);
        setIsCorrect(correct);
        setTotalFrames(prev => prev + 1);
        if (correct) {
            setGoodFrames(prev => prev + 1);
        } else {
            if (!mistakes.includes(msg)) {
                setMistakes(prev => [...prev, msg]);
            }
        }
    };

    const handleRep = () => {
        setReps(prev => prev + 1);
    };

    const handleEndSession = async () => {
        if (!token) return;
        setIsSaving(true);

        const duration = Math.round((Date.now() - startTime) / 1000);
        const accuracyScore = totalFrames > 0 ? Math.round((goodFrames / totalFrames) * 100) : 0;

        try {
            const res = await fetch('http://localhost:5000/api/workouts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    type: workout.name,
                    reps,
                    accuracyScore,
                    duration,
                    mistakes
                })
            });

            if (res.ok) {
                await refreshUser(); // Update streak in context
                router.push("/dashboard");
            } else if (res.status === 401) {
                console.error("Session expired or unauthorized");
                logout(); // Logout user if token is invalid
                // router.push("/login") is handled by logout() usually, but let's be safe
            } else {
                console.error("Failed to save workout", res.status, res.statusText);
                setIsSaving(false);
            }
        } catch (error) {
            console.error("Error saving workout:", error);
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">{workout.name} Session</h1>
                <div className="flex items-center gap-4">
                    <div className="px-6 py-3 bg-slate-900 rounded-lg border border-slate-800">
                        <span className="text-slate-400 text-sm uppercase tracking-wider">
                            {workout.name === "Sitting Posture" ? "Time (s)" : "Reps"}
                        </span>
                        <p className="text-3xl font-bold text-neon-green">{reps}</p>
                    </div>
                    <button
                        onClick={handleEndSession}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-4 bg-neon-green text-black rounded-lg hover:bg-[#b3ff00] transition-colors font-bold disabled:opacity-50"
                    >
                        {isSaving ? (
                            "Saving..."
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                End Session
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <PoseDetector onFeedback={handleFeedback} onRep={handleRep} exerciseType={workout.name} />
                </div>

                <div className="space-y-6">
                    <div className={`p-6 rounded-2xl border ${isCorrect ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50'} transition-colors`}>
                        <div className="flex items-center gap-3 mb-2">
                            {isCorrect ? <CheckCircle className="text-green-500" /> : <AlertCircle className="text-red-500" />}
                            <h3 className={`text-xl font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                                {isCorrect ? "Good Form" : "Correction Needed"}
                            </h3>
                        </div>
                        <p className="text-white text-lg">{feedback}</p>
                    </div>

                    <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                        <h3 className="text-white font-bold mb-4">Instructions</h3>
                        <ul className="space-y-2 text-slate-400 list-disc list-inside">
                            {workout.instructions.map((instruction, index) => (
                                <li key={index}>{instruction}</li>
                            ))}
                        </ul>
                    </div>

                    {mistakes.length > 0 && (
                        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                            <h3 className="text-white font-bold mb-4">Mistakes Detected</h3>
                            <ul className="space-y-2 text-red-400 list-disc list-inside">
                                {mistakes.slice(-3).map((mistake, index) => (
                                    <li key={index}>{mistake}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
