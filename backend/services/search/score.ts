import {
  EventRecord,
  StudentProfile,
  SearchIntent,
  ScoreBreakdown
} from "./types";

import { normalizeText } from "./normalize";

export function calculateScore(
  student: StudentProfile,
  event: EventRecord,
  intent: SearchIntent
): ScoreBreakdown {

  let domain = 0;
  let eligibility = 0;
  let skill = 0;
  let location = 0;
  let date = 0;
  let urgency = 0;

  // -----------------------------
  // Domain score - 30
  // -----------------------------
  if (intent.domain) {
    const normalizedIntentDomain =
      normalizeText(intent.domain);

    const domainMatch = event.domains.some(
      eventDomain =>
        normalizeText(eventDomain) ===
        normalizedIntentDomain
    );

    if (domainMatch) {
      domain = 30;
    }
  }

  // -----------------------------
  // Eligibility score - 25
  // -----------------------------
  const degreeMatch =
    event.eligibleDegrees.some(
      degree =>
        normalizeText(degree) ===
        normalizeText(student.degree)
    );

  const departmentMatch =
    event.eligibleDepartments.some(
      department => {

        const normalizedDepartment =
          normalizeText(department);

        return (
          normalizedDepartment ===
            "all departments" ||

          normalizedDepartment ===
            "all engineering departments" ||

          normalizedDepartment ===
            normalizeText(student.department)
        );
      }
    );

  const yearMatch =
    event.eligibleYears.includes(student.year);

  if (
    degreeMatch &&
    departmentMatch &&
    yearMatch
  ) {
    eligibility = 25;
  } else if (
    degreeMatch ||
    departmentMatch ||
    yearMatch
  ) {
    eligibility = 15;
  }

  // -----------------------------
  // Skill score - 20
  // -----------------------------
  if (event.requiredSkills.length === 0) {

    skill = 20;

  } else {

    const matchingSkills =
      event.requiredSkills.filter(
        requiredSkill =>
          student.skills.some(
            studentSkill =>
              normalizeText(studentSkill) ===
              normalizeText(requiredSkill.name)
          )
      );

    const skillRatio =
      matchingSkills.length /
      event.requiredSkills.length;

    skill = Math.round(
      skillRatio * 20
    );
  }

  // -----------------------------
  // Location score - 10
  // -----------------------------
  if (intent.location) {

    if (
      normalizeText(event.location) ===
      normalizeText(intent.location)
    ) {
      location = 10;
    }

  } else if (
    student.preferredLocation &&
    normalizeText(event.location) ===
      normalizeText(student.preferredLocation)
  ) {
    location = 10;
  }

  // -----------------------------
  // Date score - 10
  // -----------------------------
  const deadline =
    new Date(event.registrationDeadline);

  const today = new Date();

  if (deadline >= today) {
    date = 10;
  }

  // -----------------------------
  // Urgency score - 5
  // -----------------------------
  const daysRemaining =
    (deadline.getTime() -
      today.getTime()) /
    (1000 * 60 * 60 * 24);

  if (
    daysRemaining >= 0 &&
    daysRemaining <= 7
  ) {
    urgency = 5;
  } else if (
    daysRemaining > 7 &&
    daysRemaining <= 14
  ) {
    urgency = 3;
  }

  // -----------------------------
  // Total score
  // -----------------------------
  const total =
    domain +
    eligibility +
    skill +
    location +
    date +
    urgency;

  return {
    domain,
    eligibility,
    skill,
    location,
    date,
    urgency,
    total
  };
}