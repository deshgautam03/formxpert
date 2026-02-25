"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Trophy, Calendar, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function DashboardPage() {
    const { user, token } = useAuth();
    const [workouts, setWorkouts] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalWorkouts: 0,
        avgAccuracy: 0,
        totalReps: 0
    });

    useEffect(() => {
        if (token) {
            fetch('http://localhost:5000/api/workouts', {
                headers: { 'x-auth-token': token }
            })
                .then(res => res.json())
                .then(data => {
                    setWorkouts(data);

                    // Calculate stats
                    const total = data.length;
                    const reps = data.reduce((acc: number, curr: any) => acc + (curr.reps || 0), 0);
                    const accuracy = total > 0
                        ? Math.round(data.reduce((acc: number, curr: any) => acc + (curr.accuracyScore || 0), 0) / total)
                        : 0;

                    setStats({
                        totalWorkouts: total,
                        avgAccuracy: accuracy,
                        totalReps: reps
                    });
                })
                .catch(err => console.error(err));
        }
    }, [token]);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-slate-400">Welcome back, {user?.username || 'Athlete'}.</p>
                </div>
                <Link href="/dashboard/workouts" className="px-4 py-2 bg-neon-green text-black font-bold rounded-lg hover:bg-[#b3ff00] transition-colors">
                    Start Workout
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<Activity className="text-neon-blue" />}
                    label="Total Workouts"
                    value={stats.totalWorkouts.toString()}
                    trend="Keep going!"
                />
                <StatCard
                    icon={<Trophy className="text-yellow-500" />}
                    label="Avg. Accuracy"
                    value={`${stats.avgAccuracy}%`}
                    trend={stats.avgAccuracy > 80 ? "Great form!" : "Needs improvement"}
                />
                <StatCard
                    icon={<Calendar className="text-purple-500" />}
                    label="Current Streak"
                    value={`${user?.currentStreak || 0} Days`}
                    trend={`Best: ${user?.bestStreak || 0} Days`}
                />
                <StatCard
                    icon={<TrendingUp className="text-neon-green" />}
                    label="Total Reps"
                    value={stats.totalReps.toString()}
                    trend="Lifetime reps"
                />
            </div>

            {/* Recent Activity & Charts Placeholder */}
            {/* Recent Activity & Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">Performance Trend</h3>
                        <Link href="/dashboard/analytics" className="text-sm text-neon-green hover:underline">View Analytics</Link>
                    </div>
                    <div className="h-64 w-full min-w-0 relative">
                        {workouts.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={[...workouts].reverse()}>
                                    <defs>
                                        <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#a3ff00" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#a3ff00" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={[0, 100]}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                                        itemStyle={{ color: '#a3ff00' }}
                                        formatter={(value: number) => [`${value}%`, 'Accuracy']}
                                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="accuracyScore"
                                        stroke="#a3ff00"
                                        fillOpacity={1}
                                        fill="url(#colorAccuracy)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-500">
                                <p>No workout data available</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4">Recent Workouts</h3>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                        {workouts.length > 0 ? workouts.slice(0, 5).map((workout, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                                <div>
                                    <p className="font-medium text-white">{workout.type}</p>
                                    <p className="text-xs text-slate-400">
                                        {new Date(workout.date).toLocaleDateString()} • {workout.reps} Reps
                                    </p>
                                </div>
                                <span className={`font-bold ${workout.accuracyScore >= 80 ? 'text-neon-green' : 'text-yellow-500'}`}>
                                    {workout.accuracyScore}%
                                </span>
                            </div>
                        )) : (
                            <p className="text-slate-500 text-center py-4">No workouts yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, trend }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-slate-800 rounded-lg">{icon}</div>
                <span className="text-xs font-medium text-slate-400">{trend}</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{value}</h3>
            <p className="text-sm text-slate-400">{label}</p>
        </motion.div>
    );
}
