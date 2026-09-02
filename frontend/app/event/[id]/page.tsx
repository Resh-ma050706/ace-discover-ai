"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type EventData = {
  id: string | number;
  title: string;
  description?: string;
  location?: string;
  eventType?: string;
  domains?: string[];
  mode?: string;
  venue?: string;
  organizer?: string;
  verified?: boolean;
  fee?: number;

  matchPercentage?: number;

  eligibilityStatus?: string;
  matchReasons?: string[];
  missingRequirements?: string[];
  registrationDeadline?: string;
  suggestedNextAction?: string;
  registrationLink?: string;
  sourceUrl?: string;

  eventStartDate?: string;
  eventEndDate?: string;

  eligibleDegrees?: string[];
  eligibleDepartments?: string[];
  eligibleYears?: (string | number)[];

  requiredSkills?: (
    | string
    | {
        name: string;
        minimumLevel?: string;
      }
  )[];

  minimumTeamSize?: number;
  maximumTeamSize?: number;
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

        const response = await fetch(
          "http://localhost:5000/api/events"
        );

        if (!response.ok) {
          throw new Error("Failed to load events");
        }

        const data = await response.json();

        const events = data.events || [];

        const selectedEvent = events.find(
          (item: EventData) =>
            String(item.id) === String(id)
        );

        if (selectedEvent) {
          setEvent(selectedEvent);

          const savedEvents = JSON.parse(
            localStorage.getItem(
              "savedOpportunities"
            ) || "[]"
          );

          setSaved(
            savedEvents.some(
              (savedId: string | number) =>
                String(savedId) === String(id)
            )
          );
        }
      } catch (error) {
        console.error(
          "Event loading error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [params]);

  const handleSave = () => {
    if (!event) return;

    const savedEvents = JSON.parse(
      localStorage.getItem(
        "savedOpportunities"
      ) || "[]"
    );

    if (saved) {
      const updated = savedEvents.filter(
        (id: string | number) =>
          String(id) !== String(event.id)
      );

      localStorage.setItem(
        "savedOpportunities",
        JSON.stringify(updated)
      );

      setSaved(false);
    } else {
      const updated = [
        ...savedEvents,
        String(event.id),
      ];

      localStorage.setItem(
        "savedOpportunities",
        JSON.stringify(updated)
      );

      setSaved(true);
    }
  };

  /* LOADING */
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

  /* EVENT NOT FOUND */
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

  const registrationLink =
    event.registrationLink ||
    event.sourceUrl;

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">

        {/* BACK */}
        <Link
          href="/"
          className="font-semibold text-purple-700 hover:underline"
        >
          ← Back to Results
        </Link>

        {/* MAIN CARD */}
        <div className="mt-6 rounded-3xl bg-white p-8 shadow-xl">

          {/* HEADER */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            <div>
              <div className="flex flex-wrap gap-2">

                {event.eventType && (
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                    {event.eventType}
                  </span>
                )}

                {event.verified && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    ✓ Verified
                  </span>
                )}

              </div>

              <h1 className="mt-4 text-3xl font-bold text-gray-900">
                {event.title}
              </h1>

              {event.organizer && (
                <p className="mt-2 font-medium text-purple-600">
                  Organized by {event.organizer}
                </p>
              )}
            </div>

            {/* SAVE */}
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

          {/* POSSIBILITY SCORE */}
          {event.matchPercentage !== undefined && (
            <div className="mt-8 rounded-2xl bg-purple-50 p-6">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Possibility Score
                  </p>

                  <p className="mt-1 text-3xl font-bold text-purple-700">
                    {event.matchPercentage}/100
                  </p>
                </div>

                <div className="text-4xl">
                  🎯
                </div>

              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-purple-100">
                <div
                  className="h-full rounded-full bg-purple-600 transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      Math.max(
                        event.matchPercentage,
                        0
                      ),
                      100
                    )}%`,
                  }}
                />
              </div>

            </div>
          )}

          {/* BASIC DETAILS */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">

            {event.location && (
              <div className="rounded-xl bg-blue-50 p-4">
                <p className="text-sm text-gray-500">
                  📍 Location
                </p>

                <p className="mt-1 font-semibold text-blue-700">
                  {event.location}
                </p>
              </div>
            )}

            {event.mode && (
              <div className="rounded-xl bg-green-50 p-4">
                <p className="text-sm text-gray-500">
                  💻 Mode
                </p>

                <p className="mt-1 font-semibold text-green-700">
                  {event.mode}
                </p>
              </div>
            )}

            {event.venue && (
              <div className="rounded-xl bg-purple-50 p-4">
                <p className="text-sm text-gray-500">
                  🏢 Venue
                </p>

                <p className="mt-1 font-semibold text-purple-700">
                  {event.venue}
                </p>
              </div>
            )}

            {event.fee !== undefined && (
              <div className="rounded-xl bg-orange-50 p-4">
                <p className="text-sm text-gray-500">
                  💰 Fee
                </p>

                <p className="mt-1 font-semibold text-orange-700">
                  {event.fee === 0
                    ? "Free"
                    : `₹${event.fee}`}
                </p>
              </div>
            )}

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

          {/* DOMAINS */}
          {event.domains &&
            event.domains.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900">
                  Domains
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  {event.domains.map(
                    (domain, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-purple-50 px-3 py-1 text-sm text-purple-700"
                      >
                        {domain}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

          {/* REQUIRED SKILLS */}
          {event.requiredSkills &&
            event.requiredSkills.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900">
                  Required Skills
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  {event.requiredSkills.map(
                    (skill, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700"
                      >
                        {typeof skill === "string"
                          ? skill
                          : `${skill.name}${
                              skill.minimumLevel
                                ? ` (${skill.minimumLevel})`
                                : ""
                            }`}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

          {/* ELIGIBILITY */}
          <div className="mt-8 rounded-xl bg-gray-50 p-5">

            <h3 className="font-bold text-gray-900">
              Eligibility
            </h3>

            {event.eligibleDegrees &&
              event.eligibleDegrees.length > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  <strong>Degrees:</strong>{" "}
                  {event.eligibleDegrees.join(", ")}
                </p>
              )}

            {event.eligibleDepartments &&
              event.eligibleDepartments.length > 0 && (
                <p className="mt-1 text-sm text-gray-600">
                  <strong>Departments:</strong>{" "}
                  {event.eligibleDepartments.join(", ")}
                </p>
              )}

            {event.eligibleYears &&
              event.eligibleYears.length > 0 && (
                <p className="mt-1 text-sm text-gray-600">
                  <strong>Years:</strong>{" "}
                  {event.eligibleYears.join(", ")}
                </p>
              )}

            {event.eligibilityStatus && (
              <p className="mt-3 font-semibold text-green-700">
                ✓ {event.eligibilityStatus}
              </p>
            )}

          </div>

          {/* TEAM SIZE */}
          {(event.minimumTeamSize !== undefined ||
            event.maximumTeamSize !== undefined) && (
            <div className="mt-8 rounded-xl bg-pink-50 p-5">

              <p className="text-sm text-gray-500">
                👥 Team Size
              </p>

              <p className="mt-1 font-semibold text-pink-700">
                {event.minimumTeamSize !== undefined &&
                event.maximumTeamSize !== undefined
                  ? event.minimumTeamSize ===
                    event.maximumTeamSize
                    ? `${event.minimumTeamSize}`
                    : `${event.minimumTeamSize} - ${event.maximumTeamSize}`
                  : event.minimumTeamSize !== undefined
                  ? `${event.minimumTeamSize}`
                  : `${event.maximumTeamSize}`}
              </p>

            </div>
          )}

          {/* EVENT DATE */}
          {(event.eventStartDate ||
            event.eventEndDate) && (
            <div className="mt-8 rounded-xl bg-blue-50 p-5">

              <p className="text-sm text-gray-500">
                📅 Event Date
              </p>

              <p className="mt-1 font-semibold text-blue-700">

                {event.eventStartDate
                  ? new Date(
                      event.eventStartDate
                    ).toLocaleDateString()
                  : ""}

                {event.eventEndDate
                  ? ` - ${new Date(
                      event.eventEndDate
                    ).toLocaleDateString()}`
                  : ""}

              </p>

            </div>
          )}

          {/* REGISTRATION DEADLINE */}
          {event.registrationDeadline && (
            <div className="mt-8 rounded-2xl bg-orange-50 p-6">

              <p className="text-sm text-gray-500">
                Registration Deadline
              </p>

              <p className="mt-1 text-xl font-bold text-orange-700">
                {new Date(
                  event.registrationDeadline
                ).toLocaleDateString()}
              </p>

            </div>
          )}

          {/* MATCH REASONS */}
          {event.matchReasons &&
            event.matchReasons.length > 0 && (
              <div className="mt-8">

                <h3 className="text-xl font-bold text-gray-900">
                  Why this matches you
                </h3>

                <div className="mt-4 space-y-3">

                  {event.matchReasons.map(
                    (reason, index) => (
                      <div
                        key={index}
                        className="rounded-xl bg-green-50 p-4 text-gray-700"
                      >
                        ✓ {reason}
                      </div>
                    )
                  )}

                </div>
              </div>
            )}

          {/* MISSING REQUIREMENTS */}
          {event.missingRequirements &&
            event.missingRequirements.length > 0 && (
              <div className="mt-8">

                <h3 className="text-xl font-bold text-gray-900">
                  Requirements to improve eligibility
                </h3>

                <div className="mt-4 space-y-3">

                  {event.missingRequirements.map(
                    (item, index) => (
                      <div
                        key={index}
                        className="rounded-xl bg-yellow-50 p-4 text-gray-700"
                      >
                        • {item}
                      </div>
                    )
                  )}

                </div>
              </div>
            )}

          {/* NEXT ACTION */}
          {event.suggestedNextAction && (
            <div className="mt-8">

              <p className="text-sm text-gray-500">
                Suggested Next Action
              </p>

              <p className="mt-1 text-lg font-semibold text-purple-700">
                {event.suggestedNextAction}
              </p>

            </div>
          )}

          {/* BUTTONS */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">

            {registrationLink && (
              <a
                href={registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-xl bg-purple-600 px-6 py-4 text-center font-semibold text-white transition hover:bg-purple-700"
              >
                Register / Official Link →
              </a>
            )}

            <button
              onClick={handleSave}
              className="flex-1 rounded-xl border border-purple-200 bg-white px-6 py-4 font-semibold text-purple-700 hover:bg-purple-50"
            >
              {saved
                ? "★ Remove from Saved"
                : "☆ Save Opportunity"}
            </button>

          </div>

        </div>
      </div>
    </main>
  );
}