
"use client";

import { useCallback, useEffect, useState } from "react";
import { Star, MessageSquare, Send, CalendarDays } from "lucide-react";
import { token } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Application {
  id: string;
  tuitionId: string;
  status: string;
  tuition: {
    id: string;
    title: string;
    tutorName: string;
    tutorEmail: string;
  };
}

interface Review {
  studentId: string;
  studentName: string;
  tuitionId: string;
  tuitionTitle: string;
  tutorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function StudentReviewsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getAccessToken = async () => {
    const tokenResult = await token();
    const accessToken = tokenResult.data?.token;

    if (!accessToken) {
      throw new Error("Please sign in again.");
    }

    return accessToken;
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const accessToken = await getAccessToken();

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const [applicationsResponse, reviewsResponse] = await Promise.all([
        fetch(`${API_URL}/student/applications`, { headers }),
        fetch(`${API_URL}/student/reviews`, { headers }),
      ]);

      const [applicationsResult, reviewsResult] = await Promise.all([
        applicationsResponse.json(),
        reviewsResponse.json(),
      ]);

      if (!applicationsResponse.ok) {
        throw new Error(
          applicationsResult.message || "Failed to load applications."
        );
      }

      if (!reviewsResponse.ok) {
        throw new Error(
          reviewsResult.message || "Failed to load submitted reviews."
        );
      }

      setApplications(
        (Array.isArray(applicationsResult.data)
          ? applicationsResult.data
          : []
        ).filter(
          (application: Application) =>
            application.status?.toLowerCase() === "accepted"
        )
      );

      setReviews(
        Array.isArray(reviewsResult.data) ? reviewsResult.data : []
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchData();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchData]);

  const submitReview = async (application: Application) => {
    const tuitionId = application.tuitionId;
    const rating = ratings[tuitionId] || 0;
    const comment = comments[tuitionId]?.trim() || "";

    if (rating < 1 || rating > 5) {
      setError("Please select a rating from 1 to 5 stars.");
      return;
    }

    if (!comment) {
      setError("Please write a review.");
      return;
    }

    try {
      setSending(tuitionId);
      setError("");
      setSuccess("");

      const accessToken = await getAccessToken();

      const response = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tuitionId,
          rating,
          comment,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit review.");
      }

      setSuccess("Your review was submitted successfully.");

      setComments((previous) => ({
        ...previous,
        [tuitionId]: "",
      }));

      await fetchData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSending(null);
    }
  };

  const reviewedTuitionIds = new Set(
    reviews.map((review) => review.tuitionId)
  );

  const pendingReviewApplications = applications.filter(
    (application) => !reviewedTuitionIds.has(application.tuitionId)
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <p className="text-sm font-medium text-teal-700">
          Student Dashboard
        </p>

        <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
          My Reviews
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          View your submitted reviews and share new experiences with tutors.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border bg-white p-10 text-center text-gray-500">
          Loading your reviews...
        </div>
      ) : (
        <>
          {/* Previously submitted reviews */}
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Submitted Reviews
              </h2>

              <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700">
                {reviews.length} Reviews
              </span>
            </div>

            {reviews.length === 0 ? (
              <div className="rounded-2xl border border-gray-100 bg-white px-6 py-10 text-center">
                <MessageSquare
                  className="mx-auto text-gray-300"
                  size={38}
                />

                <h3 className="mt-3 font-semibold text-gray-800">
                  No reviews submitted yet
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Your submitted reviews will appear here.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {reviews.map((review, index) => (
                  <div
                    key={`${review.tuitionId}-${index}`}
                    className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {review.tuitionTitle || "Tuition"}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Tutor:{" "}
                          <span className="font-medium text-gray-700">
                            {review.tutorName || "Tutor"}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={18}
                            className={
                              star <= review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300"
                            }
                          />
                        ))}

                        <span className="ml-1 text-sm font-semibold text-gray-700">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>

                    <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                      {review.comment}
                    </p>

                    <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4 text-xs text-gray-400">
                      <CalendarDays size={15} />

                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )
                        : "Date unavailable"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* New review submission */}
          <section className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Write a Review
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Review tutors whose applications have been accepted.
              </p>
            </div>

            {pendingReviewApplications.length === 0 ? (
              <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center">
                <Star className="mx-auto text-gray-300" size={36} />

                <p className="mt-3 text-sm font-medium text-gray-700">
                  No new reviews to submit.
                </p>
              </div>
            ) : (
              <div className="grid gap-5">
                {pendingReviewApplications.map((application) => {
                  const tuitionId = application.tuitionId;

                  return (
                    <div
                      key={application.id}
                      className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
                    >
                      <h3 className="text-lg font-bold text-gray-900">
                        {application.tuition?.title || "Tuition"}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Tutor:{" "}
                        <span className="font-medium text-gray-700">
                          {application.tuition?.tutorName || "Tutor"}
                        </span>
                      </p>

                      <div className="mt-5 space-y-4 border-t border-gray-100 pt-5">
                        <div>
                          <p className="mb-2 text-sm font-semibold text-gray-700">
                            Your Rating
                          </p>

                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() =>
                                  setRatings((previous) => ({
                                    ...previous,
                                    [tuitionId]: star,
                                  }))
                                }
                                aria-label={`Rate ${star} stars`}
                                className="transition hover:scale-110"
                              >
                                <Star
                                  size={28}
                                  className={
                                    star <= (ratings[tuitionId] || 0)
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-gray-300"
                                  }
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Your Review
                          </label>

                          <textarea
                            value={comments[tuitionId] || ""}
                            onChange={(event) =>
                              setComments((previous) => ({
                                ...previous,
                                [tuitionId]: event.target.value,
                              }))
                            }
                            placeholder="Share your experience with this tutor..."
                            rows={4}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                          />
                        </div>

                        <button
                          onClick={() => submitReview(application)}
                          disabled={sending === tuitionId}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Send size={16} />

                          {sending === tuitionId
                            ? "Submitting..."
                            : "Submit Review"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
