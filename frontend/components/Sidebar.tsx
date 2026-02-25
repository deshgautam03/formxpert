"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, User, Dumbbell, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: Dumbbell, label: "Workouts", href: "/dashboard/workouts" },
    { icon: BarChart2, label: "Analytics", href: "/dashboard/analytics" },
    { icon: User, label: "Profile", href: "/dashboard/profile" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-black/50 min-h-[calc(100vh-64px)]">
            <div className="p-4 space-y-2">
                {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-neon-green/10 text-neon-green"
                                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </div>

            <div className="mt-auto p-4 border-t border-slate-800">
                {/* Sign Out moved to Navbar */}
            </div>
        </aside>
    );
}
