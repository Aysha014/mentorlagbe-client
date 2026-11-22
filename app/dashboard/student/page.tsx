
"use client";

import { useEffect, useState } from "react";
import { BookOpen, CheckCircle, Clock, CreditCard } from "lucide-react";
import { token } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface DashboardStats {
    total: number;
    accepted: number;
    pending: number;
    plan: string;
}

export default function StudentDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        total: 0,
        accepted: 0,
        pending: 0,
        plan: "Free",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const tokenResult = await token();
                const accessToken = tokenResult.data?.token;

                if (!accessToken) {
                    throw new Error("Please sign in again.");
                }

                const response = await fetch(`${API_URL}/student/dashboard`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to load dashboard.");
                }

                setStats({
                    total: data.data?.totalAppliedTuitions ?? 0,
                    accepted: data.data?.acceptedApplications ?? 0,
                    pending: data.data?.pendingApplications ?? 0,
                    plan: data.data?.currentPlan ?? "Free",
                });
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Something went wrong."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const cards = [
        {
            label: "Total Applied Tuitions",
            value: stats.total,
            icon: BookOpen,
            color: "bg-blue-50 text-blue-600",
        },
        {
            label: "Accepted Applications",
            value: stats.accepted,
            icon: CheckCircle,
            color: "bg-green-50 text-green-600",
        },
        {
            label: "Pending Applications",
            value: stats.pending,
            icon: Clock,
            color: "bg-amber-50 text-amber-600",
        },
        {
            label: "Current Plan",
            value: stats.plan,
            icon: CreditCard,
            color: "bg-purple-50 text-purple-600",
        },
    ];

    return (
        <div className="mx-auto max-w-7xl space-y-8">
            <div>
                <p className="text-sm font-medium text-teal-700">
                    Student Dashboard
                </p>
                <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                    Overview
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                    Track your tuition applications and subscription.
                </p>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.label}
                            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-500">
                                    {card.label}
                                </p>
                                <div className={`rounded-xl p-3 ${card.color}`}>
                                    <Icon size={21} />
                                </div>
                            </div>

                            <p className="mt-5 text-3xl font-bold text-gray-900">
                                {loading ? "..." : card.value}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
