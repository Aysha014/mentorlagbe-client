
"use client";

import { useCallback, useEffect, useState } from "react";
import { token } from "@/lib/auth-client";
import {
  Users,
  RefreshCw,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Crown,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type UserRole = "student" | "tutor" | "admin";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan: string;
  createdAt: string | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const { data: tokenData, error: tokenError } = await token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Authentication token not found. Please sign in again.");
      }

      const response = await fetch(`${API_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
        cache: "no-store",
      });

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error("Server returned an invalid response.");
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load users.");
      }

      setUsers(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateRole = async (user: User, newRole: UserRole) => {
    if (user.role === newRole) return;

    const confirmed = window.confirm(
      `Change ${user.name}'s role from ${user.role} to ${newRole}?`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(user.id);
      setError("");
      setMessage("");

      const { data: tokenData, error: tokenError } = await token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Authentication token not found. Please sign in again.");
      }

      const response = await fetch(
        `${API_URL}/admin/users/${user.id}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update user role.");
      }

      setUsers((previous) =>
        previous.map((item) =>
          item.id === user.id ? { ...item, role: newRole } : item
        )
      );

      setMessage(`${user.name}'s role updated to ${newRole}.`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update user role."
      );
      await fetchUsers();
    } finally {
      setUpdatingId("");
    }
  };

  const totalStudents = users.filter(
    (user) => user.role === "student"
  ).length;

  const totalTutors = users.filter(
    (user) => user.role === "tutor"
  ).length;

  const totalAdmins = users.filter(
    (user) => user.role === "admin"
  ).length;

  const roleStyle = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-purple-50 text-purple-700";
      case "tutor":
        return "bg-teal-50 text-teal-700";
      default:
        return "bg-blue-50 text-blue-700";
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-teal-700">
            ADMINISTRATION
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Manage Users
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            View registered users and manage their account roles.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon={<GraduationCap size={21} />}
          color="blue"
        />
        <StatCard
          title="Total Tutors"
          value={totalTutors}
          icon={<BookOpen size={21} />}
          color="teal"
        />
        <StatCard
          title="Total Admins"
          value={totalAdmins}
          icon={<ShieldCheck size={21} />}
          color="purple"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
          <button
            onClick={fetchUsers}
            className="ml-2 font-bold underline"
          >
            Retry
          </button>
        </div>
      )}

      {message && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {message}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2 className="font-bold text-slate-900">Registered Users</h2>
            <p className="mt-1 text-sm text-slate-500">
              {users.length} users found
            </p>
          </div>
          <Users className="text-teal-700" size={23} />
        </div>

        {loading ? (
          <div className="space-y-4 p-5">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="mx-auto text-slate-400" size={38} />
            <h3 className="mt-4 font-semibold text-slate-800">
              No users found
            </h3>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">User</th>
                    <th className="px-5 py-4 font-semibold">Role</th>
                    <th className="px-5 py-4 font-semibold">Plan</th>
                    <th className="px-5 py-4 font-semibold">Joined</th>
                    <th className="px-5 py-4 font-semibold">Manage Role</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">
                          {user.name}
                        </p>
                        <p className="mt-1 break-all text-xs text-slate-500">
                          {user.email}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${roleStyle(user.role)}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1.5 text-sm capitalize text-slate-600">
                          {user.plan === "pro" && (
                            <Crown size={15} className="text-amber-500" />
                          )}
                          {user.plan || "free"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={user.role}
                          disabled={updatingId === user.id}
                          onChange={(e) =>
                            updateRole(user, e.target.value as UserRole)
                          }
                          className="w-full max-w-36 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-teal-600 disabled:opacity-50"
                        >
                          <option value="student">Student</option>
                          <option value="tutor">Tutor</option>
                          <option value="admin">Admin</option>
                        </select>
                        {updatingId === user.id && (
                          <p className="mt-1 text-xs text-teal-700">
                            Updating...
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 p-4 md:hidden">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="space-y-3 rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">
                        {user.name}
                      </p>
                      <p className="mt-1 break-all text-xs text-slate-500">
                        {user.email}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${roleStyle(user.role)}`}
                    >
                      {user.role}
                    </span>
                  </div>

                  <div className="flex flex-wrap justify-between gap-2 text-sm text-slate-500">
                    <span className="capitalize">
                      Plan: {user.plan || "free"}
                    </span>
                    <span>
                      Joined:{" "}
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>

                  <div>
                    <label
                      htmlFor={`role-${user.id}`}
                      className="mb-1.5 block text-xs font-semibold text-slate-600"
                    >
                      Change Role
                    </label>
                    <select
                      id={`role-${user.id}`}
                      value={user.role}
                      disabled={updatingId === user.id}
                      onChange={(e) =>
                        updateRole(user, e.target.value as UserRole)
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-teal-600 disabled:opacity-50"
                    >
                      <option value="student">Student</option>
                      <option value="tutor">Tutor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "blue" | "teal" | "purple";
}) {
  const styles = {
    blue: "bg-blue-50 text-blue-700",
    teal: "bg-teal-50 text-teal-700",
    purple: "bg-purple-50 text-purple-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={`rounded-xl p-2.5 ${styles[color]}`}>
          {icon}
        </div>
      </div>
      <p className="mt-4 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
