"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type EventData = {
  id: string;
  title: string;
  description?: string;
  location?: string;
  matchPercentage: number;
  eligibilityStatus: string;
  matchReasons: string[];
  missingRequirements: string[];
  registrationDeadline: string;
  suggestedNextAction: string;
  registrationLink: string;
};

export default function EventDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [event, setEvent] = useState<EventData | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const { id } = await params;

        const response = await fetch("/mockSearchResponse.json");

        if (!response.ok) {
          throw new Error("Failed to load event data");
        }

        const data = await response.json();

        const selectedEvent = data.results?.find(
          (item: EventData) => item.id === id
        );

        if (selectedEvent) {
          setEvent(selectedEvent);

          const savedEvents = JSON.parse(
            localStorage.getItem("savedOpportunities") || "[]"
          );

          setSaved(savedEvents.includes(id));
        }
      } catch (error) {
        console.error("Event loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [params]);

  const handleSave = () => {
    if (!event) return;

    const savedEvents = JSON.parse(
      localStorage.getItem("savedOpportunities") || "[]"
    );

    if (saved) {
      const updated = savedEvents.filter(
        (id: string) => id !== event.id
      );

      localStorage.setItem(
        "savedOpportunities",
        JSON.stringify(updated)
      );

      setSaved(false);
    } else {
      const updated = [...savedEvents, event.id];

      localStorage.setItem(
        "savedOpportunities",
        JSON.stringify(updated)
      );

      setSaved(true);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          <p className="animate-pulse text-lg font-semibold text-purple-600">
            Loading event details...
          </p>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 px-6">
        <div className="rounded-2xl bg-white p-10 text-center shadow-lg">
          <div className="text-5xl">🔍</div>

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Event Not Found
          </h1>

          <p className="mt-2 text-gray-500">
            Sorry, we could not find this opportunity.
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700"
          >
            ← Back to Search
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">

      {/* HEADER */}
      <header className="border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-2xl font-bold text-purple-700">
              ACE Discover AI
            </h1>

            <p className="text-sm text-gray-500">
              Your Personal Opportunity Finder
            </p>
          </div>

          <Link
            href="/"
            className="rounded-xl border border-purple-200 px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-50"
          >
            ← Back
          </Link>

        </div>
      </header>

      {/* EVENT DETAILS */}
      <section className="mx-auto max-w-4xl px-6 py-12">

        {/* TOP CARD */}
        <div className="rounded-3xl bg-white p-8 shadow-xl">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

            <div>
              <div className="mb-3 inline-block rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
                🎯 Opportunity Details
              </div>

              <h2 className="text-3xl font-bold text-gray-900">
                {event.title}
              </h2>

              {event.location && (
                <p className="mt-3 text-gray-600">
                  📍 {event.location}
                </p>
              )}
            </div>

            {/* SAVE BUTTON */}
            <button
              onClick={handleSave}
              className={`rounded-xl px-5 py-3 font-semibold transition ${
                saved
                  ? "bg-purple-100 text-purple-700"
                  : "border border-purple-200 bg-white text-purple-700 hover:bg-purple-50"
              }`}
            >
              {saved ? "★ Saved" : "☆ Save"}
            </button>

          </div>

          {/* MATCH + ELIGIBILITY */}
          <div className="mt-8 flex flex-wrap gap-3">

            <span className="rounded-full bg-purple-100 px-5 py-2 font-semibold text-purple-700">
              🎯 {event.matchPercentage}% Match
            </span>

            <span className="rounded-full bg-green-100 px-5 py-2 font-semibold text-green-700">
              ✓ {event.eligibilityStatus}
            </span>

          </div>

          {/* DESCRIPTION */}
          {event.description && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900">
                About this opportunity
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                {event.description}
              </p>
            </div>
          )}

          {/* WHY MATCH */}
          <div className="mt-8">

            <h3 className="text-xl font-bold text-gray-900">
              Why this matches you
            </h3>

            <div className="mt-4 space-y-3">

              {event.matchReasons.map((reason, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-green-50 p-4 text-gray-700"
                >
                  ✓ {reason}
                </div>
              ))}

            </div>

          </div>

          {/* REQUIREMENTS */}
          {event.missingRequirements?.length > 0 && (
            <div className="mt-8">

              <h3 className="text-xl font-bold text-gray-900">
                Requirements to improve eligibility
              </h3>

              <div className="mt-4 space-y-3">

                {event.missingRequirements.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-yellow-50 p-4 text-gray-700"
                  >
                    • {item}
                  </div>
                ))}

              </div>

            </div>
          )}

          {/* DEADLINE */}
          <div className="mt-8 rounded-2xl bg-orange-50 p-6">

            <p className="text-sm text-gray-500">
              Registration Deadline
            </p>

            <p className="mt-1 text-xl font-bold text-orange-700">
              {event.registrationDeadline}
            </p>

          </div>

          {/* NEXT ACTION */}
          <div className="mt-8">

            <p className="text-sm text-gray-500">
              Suggested Next Action
            </p>

            <p className="mt-1 text-lg font-semibold text-purple-700">
              {event.suggestedNextAction}
            </p>

          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">

            <a
              href={event.registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-xl bg-purple-600 px-6 py-4 text-center font-semibold text-white transition hover:bg-purple-700"
            >
              Register / Official Link →
            </a>

            <button
              onClick={handleSave}
              className={`flex-1 rounded-xl px-6 py-4 font-semibold transition ${
                saved
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "border border-purple-200 bg-white text-purple-700 hover:bg-purple-50"
              }`}
            >
              {saved ? "★ Remove from Saved" : "☆ Save Opportunity"}
            </button>

          </div>

        </div>

        {/* BACK TO RESULTS */}
        <div className="mt-8 text-center">

          <Link
            href="/"
            className="font-semibold text-purple-700 hover:underline"
          >
            ← Back to Recommended Opportunities
          </Link>

        </div>

      </section>

    </main>
  );
}