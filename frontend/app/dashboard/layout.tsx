"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem("token");
        // Allow access to workouts without login, but protect other routes
        if (!token && !pathname.startsWith('/dashboard/workouts')) {
            router.push("/login");
        }
    }, [router, pathname]);

    return (
        <div className="flex min-h-[calc(100vh-64px)]">
            <Sidebar />
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
