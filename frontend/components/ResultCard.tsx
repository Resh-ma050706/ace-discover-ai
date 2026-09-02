type ResultCardProps = {
  event: {
    id: string | number;
    title: string;
    description?: string;
    eventType?: string;
    domains?: string[];
    location?: string;
    mode?: string;
    venue?: string;
    eventStartDate?: string;
    eventEndDate?: string;
    registrationDeadline?: string;
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
    fee?: number;
    organizer?: string;
    verified?: boolean;
    status?: string;
    sourceUrl?: string;

    // POSSIBILITY SCORE
    matchPercentage?: number;
  };
};

export default function ResultCard({ event }: ResultCardProps) {
  const score = Math.min(
    Math.max(event.matchPercentage ?? 0, 0),
    100
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md transition hover:shadow-lg">

      {/* EVENT TYPE */}
      <div className="flex flex-wrap items-center gap-2">
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

      {/* TITLE */}
      <h3 className="mt-3 text-2xl font-bold text-gray-900">
        {event.title}
      </h3>

      {/* POSSIBILITY SCORE */}
      <div className="mt-5 rounded-2xl bg-purple-50 p-5">
        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm font-semibold text-gray-500">
              Possibility Score
            </p>

            <p className="mt-1 text-3xl font-bold text-purple-700">
              {score}/100
            </p>
          </div>

          <div className="text-4xl">
            🎯
          </div>

        </div>

        {/* SCORE BAR */}
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-purple-100">
          <div
            className="h-full rounded-full bg-purple-600 transition-all duration-500"
            style={{
              width: `${score}%`,
            }}
          />
        </div>

        <p className="mt-2 text-xs text-gray-500">
          Based on how well this opportunity matches your search.
        </p>
      </div>

      {/* ORGANIZER */}
      {event.organizer && (
        <p className="mt-4 text-sm font-medium text-purple-600">
          Organized by {event.organizer}
        </p>
      )}

      {/* DESCRIPTION */}
      {event.description && (
        <p className="mt-3 text-gray-600">
          {event.description}
        </p>
      )}

      {/* BASIC DETAILS */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">

        {/* LOCATION */}
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

        {/* MODE */}
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

        {/* VENUE */}
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

        {/* FEE */}
        <div className="rounded-xl bg-orange-50 p-4">
          <p className="text-sm text-gray-500">
            💰 Fee
          </p>

          <p className="mt-1 font-semibold text-orange-700">
            {event.fee === undefined || event.fee === 0
              ? "Free"
              : `₹${event.fee}`}
          </p>
        </div>

      </div>

      {/* DOMAINS */}
      {event.domains && event.domains.length > 0 && (
        <div className="mt-5">
          <h4 className="font-semibold text-gray-900">
            Domains
          </h4>

          <div className="mt-2 flex flex-wrap gap-2">
            {event.domains.map((domain, index) => (
              <span
                key={index}
                className="rounded-full bg-purple-50 px-3 py-1 text-sm text-purple-700"
              >
                {domain}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* REQUIRED SKILLS */}
      {event.requiredSkills &&
        event.requiredSkills.length > 0 && (
          <div className="mt-5">
            <h4 className="font-semibold text-gray-900">
              Required Skills
            </h4>

            <div className="mt-2 flex flex-wrap gap-2">
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
      <div className="mt-5 rounded-xl bg-gray-50 p-4">

        <h4 className="font-semibold text-gray-900">
          Eligibility
        </h4>

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

      </div>

      {/* TEAM SIZE */}
      {(event.minimumTeamSize !== undefined ||
        event.maximumTeamSize !== undefined) && (
        <div className="mt-5 rounded-xl bg-pink-50 p-4">

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
        <div className="mt-5 rounded-xl bg-blue-50 p-4">

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
        <div className="mt-5 rounded-xl bg-orange-50 p-4">

          <p className="text-sm text-gray-500">
            Registration Deadline
          </p>

          <p className="font-semibold text-orange-700">
            📅{" "}
            {new Date(
              event.registrationDeadline
            ).toLocaleDateString()}
          </p>

        </div>
      )}

      {/* VIEW DETAILS */}
      <a
        href={`/event/${event.id}`}
        className="mt-6 block rounded-xl bg-purple-600 px-5 py-3 text-center font-semibold text-white hover:bg-purple-700"
      >
        View Details →
      </a>

      {/* EXTERNAL REGISTRATION */}
      {event.sourceUrl && (
        <a
          href={event.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block rounded-xl border border-purple-200 px-5 py-3 text-center font-semibold text-purple-700 hover:bg-purple-50"
        >
          Registration / Official Link ↗
        </a>
      )}

    </div>
  );
}