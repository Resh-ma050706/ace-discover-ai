type ResultCardProps = {
  event: {
    title: string;
    description?: string;
    matchPercentage: number;
    eligibilityStatus: string;
    matchReasons: string[];
    missingRequirements: string[];
    registrationDeadline: string;
    suggestedNextAction: string;
    registrationLink: string;
  };
};

export default function ResultCard({ event }: ResultCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md transition hover:shadow-lg">

      {/* Event Title */}
      <h3 className="text-xl font-bold text-gray-900">
        {event.title}
      </h3>

      {/* Description */}
      {event.description && (
        <p className="mt-2 text-gray-600">
          {event.description}
        </p>
      )}

      {/* Match Percentage and Eligibility */}
      <div className="mt-5 flex flex-wrap gap-3">

        <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
          🎯 {event.matchPercentage}% Match
        </span>

        <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
          ✓ {event.eligibilityStatus}
        </span>

      </div>

      {/* Match Reasons */}
      <div className="mt-5">
        <h4 className="font-semibold text-gray-900">
          Why this matches you
        </h4>

        <ul className="mt-2 space-y-1 text-sm text-gray-600">
          {event.matchReasons.map((reason, index) => (
            <li key={index}>
              ✓ {reason}
            </li>
          ))}
        </ul>
      </div>

      {/* Missing Requirements */}
      {event.missingRequirements.length > 0 && (
        <div className="mt-5">
          <h4 className="font-semibold text-gray-900">
            Requirements to improve eligibility
          </h4>

          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            {event.missingRequirements.map((item, index) => (
              <li key={index}>
                • {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Registration Deadline */}
      <div className="mt-5 rounded-xl bg-orange-50 p-4">
        <p className="text-sm text-gray-500">
          Registration Deadline
        </p>

        <p className="font-semibold text-orange-700">
          {event.registrationDeadline}
        </p>
      </div>

      {/* Suggested Action */}
      <div className="mt-5">
        <p className="text-sm text-gray-500">
          Suggested Action
        </p>

        <p className="mt-1 font-medium text-purple-700">
          {event.suggestedNextAction}
        </p>
      </div>

      {/* Registration Link */}
      <a
        href={event.registrationLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 block rounded-xl bg-purple-600 px-5 py-3 text-center font-semibold text-white hover:bg-purple-700"
      >
        View / Register →
      </a>

    </div>
  );
}