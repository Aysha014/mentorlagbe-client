
"use client";

import { useCallback, useEffect, useState } from "react";
import { token } from "@/lib/auth-client";
import {
  RefreshCw,
  CreditCard,
  DollarSign,
  Receipt,
  Crown,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Transaction {
  id: string;
  userName: string;
  email: string;
  role: string;
  planName: string;
  amount: number;
  transactionId: string;
  paymentDate: string | null;
  status: string;
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch transaction data
  const loadTransactions = useCallback(async () => {
    try {
      const { data: tokenData, error: tokenError } = await token();

      if (tokenError || !tokenData?.token) {
        throw new Error(
          "Authentication token not found. Please sign in again."
        );
      }

      if (!API_URL) {
        throw new Error("API URL is not configured.");
      }

      const response = await fetch(`${API_URL}/admin/transactions`, {
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
        throw new Error(
          result.message || "Failed to load transactions."
        );
      }

      setTransactions(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data loading
useEffect(() => {
  const timer = setTimeout(() => {
    void loadTransactions();
  }, 0);

  return () => clearTimeout(timer);
}, [loadTransactions]);

  // Manual refresh
  const fetchTransactions = useCallback(() => {
    setLoading(true);
    setError("");
    void loadTransactions();
  }, [loadTransactions]);

  const totalRevenue = transactions.reduce(
    (sum, transaction) =>
      sum + (Number(transaction.amount) || 0),
    0
  );

  const successfulPayments = transactions.filter((transaction) =>
    ["paid", "succeeded", "success", "completed"].includes(
      (transaction.status || "").toLowerCase()
    )
  ).length;

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const statusStyle = (status: string) => {
    const value = status.toLowerCase();

    if (
      ["paid", "succeeded", "success", "completed"].includes(value)
    ) {
      return "bg-green-50 text-green-700";
    }

    if (["failed", "cancelled", "canceled"].includes(value)) {
      return "bg-red-50 text-red-700";
    }

    return "bg-amber-50 text-amber-700";
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-teal-700">
            ADMINISTRATION
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Transactions
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Monitor subscription payments and platform revenue.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchTransactions}
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

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Transactions"
          value={transactions.length.toString()}
          icon={<Receipt size={21} />}
          color="blue"
        />

        <StatCard
          title="Successful Payments"
          value={successfulPayments.toString()}
          icon={<CreditCard size={21} />}
          color="green"
        />

        <StatCard
          title="Recorded Revenue"
          value={formatAmount(totalRevenue)}
          icon={<DollarSign size={21} />}
          color="amber"
        />
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}

          <button
            type="button"
            onClick={fetchTransactions}
            className="ml-2 font-bold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Payment History */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2 className="font-bold text-slate-900">
              Payment History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {transactions.length} transaction records
            </p>
          </div>

          <CreditCard className="text-teal-700" size={23} />
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
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center">
            <Receipt className="mx-auto text-slate-400" size={38} />

            <h3 className="mt-4 font-semibold text-slate-800">
              No transactions yet
            </h3>

            <p className="mt-1 px-4 text-sm text-slate-500">
              Stripe subscription payment records will appear here
              after successful payments are saved.
            </p>
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
                    <th className="px-5 py-4 font-semibold">Amount</th>
                    <th className="px-5 py-4 font-semibold">
                      Transaction ID
                    </th>
                    <th className="px-5 py-4 font-semibold">Date</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">
                          {transaction.userName}
                        </p>

                        <p className="mt-1 break-all text-xs text-slate-500">
                          {transaction.email || "N/A"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm capitalize text-slate-600">
                        {transaction.role || "N/A"}
                      </td>

                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1.5 text-sm capitalize text-slate-600">
                          <Crown size={15} className="text-amber-500" />
                          {transaction.planName || "N/A"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                        {formatAmount(transaction.amount)}
                      </td>

                      <td className="max-w-40 px-5 py-4">
                        <span
                          title={transaction.transactionId}
                          className="block truncate text-xs text-slate-500"
                        >
                          {transaction.transactionId || "N/A"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {transaction.paymentDate
                          ? new Date(
                              transaction.paymentDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle(
                            transaction.status || ""
                          )}`}
                        >
                          {transaction.status || "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 p-4 md:hidden">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="space-y-3 rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">
                        {transaction.userName}
                      </p>

                      <p className="mt-1 break-all text-xs text-slate-500">
                        {transaction.email || "N/A"}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle(
                        transaction.status || ""
                      )}`}
                    >
                      {transaction.status || "Pending"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-400">Role</p>
                      <p className="mt-1 capitalize text-slate-700">
                        {transaction.role || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Plan</p>
                      <p className="mt-1 capitalize text-slate-700">
                        {transaction.planName || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Amount</p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {formatAmount(transaction.amount)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Payment Date
                      </p>
                      <p className="mt-1 text-slate-700">
                        {transaction.paymentDate
                          ? new Date(
                              transaction.paymentDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <p className="text-xs text-slate-400">
                      Transaction ID
                    </p>

                    <p className="mt-1 break-all text-xs text-slate-600">
                      {transaction.transactionId || "N/A"}
                    </p>
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
  value: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "amber";
}) {
  const styles = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-slate-500">{title}</p>

        <div className={`rounded-xl p-2.5 ${styles[color]}`}>
          {icon}
        </div>
      </div>

      <p className="mt-4 wrap-break-word text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}
