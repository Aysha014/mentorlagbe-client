
import Link from "next/link";

export default function PaymentCancel() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8faf9] p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          Payment Cancelled
        </h1>
        <p className="mt-3 text-gray-600">
          Your payment was not completed. You can try again whenever you're ready.
        </p>
        <Link
          href="/pricing"
          className="mt-6 inline-block rounded-lg bg-teal-700 px-6 py-3 font-semibold text-white"
        >
          Return to Pricing
        </Link>
      </div>
    </main>
  );
}
