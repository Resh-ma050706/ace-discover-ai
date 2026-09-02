"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface EventItem {
  id: string | number;
  title: string;
  description?: string;
  location?: string;
  eventType?: string;
  registrationDeadline?: string;
  sourceUrl?: string;
  registrationLink?: string;
  status?: string;
}

export default function EventRegistrationPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:5000/api/events");

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();

        const eventList = Array.isArray(data)
          ? data
          : data.events || [];

        setEvents(eventList);
      } catch (err) {
        console.error("Event registration loading error:", err);
        setError(
          "Unable to load events. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  function handleRegister(event: EventItem) {
    const registrationUrl =
      event.registrationLink || event.sourceUrl;

    if (registrationUrl) {
      window.open(
        registrationUrl,
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }

    window.location.href = `/event/${event.id}`;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-purple-600">
            ACE Discover AI
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Event Registration
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Explore available opportunities and register for the events
            that match your interests.
          </p>
        </div>

        {/* BACK TO PROFILE */}
        <div className="mb-6">
          <Link
            href="/profile"
            className="inline-flex items-center rounded-xl border border-purple-200 bg-white px-4 py-2.5 text-sm font-semibold text-purple-700 shadow-sm transition hover:bg-purple-50"
          >
            ← Back to Profile
          </Link>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="rounded-3xl border border-purple-100 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />

            <p className="font-medium text-gray-600">
              Loading available events...
            </p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="font-semibold text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl bg-purple-600 px-5 py-2.5 font-semibold text-white transition hover:bg-purple-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* NO EVENTS */}
        {!loading && !error && events.length === 0 && (
          <div className="rounded-3xl border border-purple-100 bg-white p-10 text-center shadow-sm">
            <div className="mb-4 text-5xl">
              📅
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              No events available
            </h2>

            <p className="mt-2 text-gray-600">
              There are currently no events available for registration.
            </p>
          </div>
        )}

        {/* EVENT LIST */}
        {!loading && !error && events.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">

            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                {/* EVENT TYPE */}
                {event.eventType && (
                  <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
                    {event.eventType}
                  </span>
                )}

                {/* TITLE */}
                <h2 className="mt-4 text-2xl font-bold text-gray-900">
                  {event.title}
                </h2>

                {/* DESCRIPTION */}
                {event.description && (
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                    {event.description}
                  </p>
                )}

                {/* DETAILS */}
                <div className="mt-5 space-y-3">

                  {event.location && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="text-lg">📍</span>
                      <span>{event.location}</span>
                    </div>
                  )}

                  {event.registrationDeadline && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="text-lg">📅</span>
                      <span>
                        Deadline:{" "}
                        {new Date(
                          event.registrationDeadline
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {event.status && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="text-lg">✅</span>
                      <span>{event.status}</span>
                    </div>
                  )}

                </div>

                {/* ACTIONS */}
                <div className="mt-6 flex flex-wrap gap-3">

                  <Link
                    href={`/event/${event.id}`}
                    className="flex-1 rounded-xl border border-purple-200 px-5 py-3 text-center font-semibold text-purple-700 transition hover:bg-purple-50"
                  >
                    View Details
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleRegister(event)}
                    className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 px-5 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    Register Now →
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}