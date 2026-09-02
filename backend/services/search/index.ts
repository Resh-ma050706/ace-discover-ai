import {
  EventRecord,
  StudentProfile,
  SearchResponse
} from "./types";

import { extractIntent } from "./extractIntent";
import { checkEligibility } from "./eligibility";
import { calculateScore } from "./score";
import { generateExplanation } from "./explain";

export function searchEvents(
  query: string,
  student: StudentProfile,
  events: EventRecord[]
): SearchResponse {

  // 1. Understand the query
  const intent = extractIntent(query);

  // 2. Process every event
  const results = events
    .filter(event => {
      // Ignore events whose registration is already closed
      const deadline = new Date(event.registrationDeadline);
      return deadline >= new Date();
    })
    .filter(event => {
      // Ignore inactive events
      if (event.status !== "ACTIVE") {
        return false;
      }

      return true;
    })
    .filter(event => {
      // Event type filtering
      if (
        intent.eventType &&
        event.eventType.toLowerCase() !==
          intent.eventType.toLowerCase()
      ) {
        return false;
      }

      return true;
    })
    .filter(event => {
  if (
    intent.location &&
    event.location.toLowerCase() !==
      intent.location.toLowerCase()
  ) {
    return false;
  }

  return true;
})
    .map(event => {

      // 3. Check eligibility
      const eligibility = checkEligibility(
        student,
        event
      );

      // 4. Calculate match score
      const score = calculateScore(
        student,
        event,
        intent
      );

      // 5. Generate explanation
      const explanation = generateExplanation(
        student,
        event,
        eligibility,
        intent
      );

      return {
        id: String(event.id),
        title: event.title,
        location: event.location,
        matchPercentage: score.total,
        eligibilityStatus: eligibility.status,
        matchReasons: explanation.matched,
        missingRequirements: explanation.missing,
        registrationDeadline:
          event.registrationDeadline,
        suggestedNextAction:
          explanation.nextAction,

        // The frozen backend field is sourceUrl.
        // SearchResponse keeps registrationLink
        // for the existing response contract.
        registrationLink:
          event.sourceUrl
      };
    });

  // 6. Rank highest score first
  results.sort(
    (a, b) =>
      b.matchPercentage - a.matchPercentage
  );

  return {
    query,

    interpretedQuery: {
  domain: intent.domain,
  eventType: intent.eventType,
  location: intent.location,
  mode: intent.mode,
  timeRange: intent.timeRange,
  studentType: intent.studentType,
  year: intent.year
},

    results
  };
}