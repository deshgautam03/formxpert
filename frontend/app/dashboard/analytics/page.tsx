"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AnalyticsPage() {
    const { token } = useAuth();
    const [workouts, setWorkouts] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        if (token) {
            fetch('http://localhost:5000/api/workouts', {
                headers: { 'x-auth-token': token }
            })
                .then(res => res.json())
                .then(data => {
                    setWorkouts(data);

                    // Process data for charts (last 7 workouts)
                    const processed = data.slice(0, 7).reverse().map((w: any) => ({
                        date: new Date(w.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                        accuracy: w.accuracyScore,
                        reps: w.reps
                    }));
                    setChartData(processed);
                })
                .catch(err => console.error(err));
        }
    }, [token]);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Analytics</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Accuracy Chart */}
                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-6">Accuracy Trend</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="date" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Line type="monotone" dataKey="accuracy" stroke="#a3ff00" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Reps Chart */}
                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-6">Reps per Session</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="date" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="reps" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Detailed History Table */}
            <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                <h3 className="text-xl font-bold text-white mb-6">Workout History</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-800 text-slate-400">
                                <th className="pb-4">Date</th>
                                <th className="pb-4">Exercise</th>
                                <th className="pb-4">Reps</th>
                                <th className="pb-4">Accuracy</th>
                                <th className="pb-4">Duration</th>
                                <th className="pb-4">Mistakes</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-300">
                            {workouts.map((workout, i) => (
                                <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                                    <td className="py-4">{new Date(workout.date).toLocaleDateString()}</td>
                                    <td className="py-4 font-medium text-white">{workout.type}</td>
                                    <td className="py-4">{workout.reps}</td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${workout.accuracyScore >= 80 ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                                            }`}>
                                            {workout.accuracyScore}%
                                        </span>
                                    </td>
                                    <td className="py-4">{workout.duration}s</td>
                                    <td className="py-4 text-sm text-slate-500 max-w-xs truncate">
                                        {workout.mistakes && workout.mistakes.length > 0 ? workout.mistakes.join(", ") : "None"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
