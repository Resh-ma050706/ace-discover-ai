import {
  EventRecord,
  StudentProfile,
  EligibilityResult,
  SearchIntent
} from "./types";

import { normalizeText } from "./normalize";

export function generateExplanation(
  student: StudentProfile,
  event: EventRecord,
  eligibility: EligibilityResult,
  intent: SearchIntent
) {
  const matched: string[] = [];

  // -----------------------------
  // Domain match
  // -----------------------------
  if (intent.domain) {
    const domainMatch = event.domains.some(
      domain =>
        normalizeText(domain) ===
        normalizeText(intent.domain!)
    );

    if (domainMatch) {
      matched.push(
        `Matches ${intent.domain} interest`
      );
    }
  }

  // -----------------------------
  // Event type match
  // -----------------------------
  if (
    intent.eventType &&
    normalizeText(event.eventType) ===
      normalizeText(intent.eventType)
  ) {
    matched.push(
      `Matches ${event.eventType} preference`
    );
  }

  // -----------------------------
  // Location match
  // -----------------------------
  if (
    intent.location &&
    normalizeText(event.location) ===
      normalizeText(intent.location)
  ) {
    matched.push(
      `Event is in ${event.location}`
    );
  }

  // -----------------------------
  // Student preferred location
  // -----------------------------
  if (
    !intent.location &&
    student.preferredLocation &&
    normalizeText(event.location) ===
      normalizeText(student.preferredLocation)
  ) {
    matched.push(
      `Matches preferred location: ${event.location}`
    );
  }

  // -----------------------------
  // Eligibility reasons
  // -----------------------------
  matched.push(...eligibility.reasons);

  // -----------------------------
  // Missing requirements
  // -----------------------------
  const missing = [...eligibility.missing];

  // -----------------------------
  // Suggested next action
  // -----------------------------
  let nextAction = "View event details";

  const deadline =
    new Date(event.registrationDeadline);

  const today = new Date();

  if (deadline < today) {
    nextAction = "Registration closed";
  } else if (
    eligibility.status === "Eligible"
  ) {
    nextAction = "Apply now";
  } else if (
    eligibility.status === "Partial"
  ) {
    nextAction =
      "Check missing requirements and apply";
  } else {
    nextAction =
      "Review eligibility requirements";
  }

  return {
    matched,
    missing,
    nextAction
  };
}