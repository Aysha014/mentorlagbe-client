
export default async function PaymentSuccess({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Invalid payment session</h1>
          <a href="/pricing" className="mt-4 inline-block text-blue-600">
            Return to Pricing
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8faf9] p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <div className="mb-4 text-5xl">✓</div>
        <h1 className="text-2xl font-bold text-gray-900">
          Payment Successful!
        </h1>
        <p className="mt-3 text-gray-600">
          Thank you for upgrading to MentorLagbe Pro. Your subscription is
          being activated.
        </p>
        <a
          href="/dashboard"
          className="mt-6 inline-block rounded-lg bg-teal-700 px-6 py-3 font-semibold text-white"
        >
          Go to Dashboard
        </a>
      </div>
    </main>
  );
}
