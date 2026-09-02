import {
  EventRecord,
  StudentProfile,
  EligibilityResult
} from "./types";

import {
  normalizeText
} from "./normalize";

export function checkEligibility(
  student: StudentProfile,
  event: EventRecord
): EligibilityResult {

  const reasons: string[] = [];
  const missing: string[] = [];

  const studentDegree =
    normalizeText(student.degree);

  const studentDepartment =
    normalizeText(student.department);

  // Degree eligibility
  const degreeEligible =
    event.eligibleDegrees.some(
      degree =>
        normalizeText(degree) === studentDegree
    );

  if (degreeEligible) {
    reasons.push(
      "Degree requirement is satisfied"
    );
  } else {
    missing.push(
      `Eligible degree: ${event.eligibleDegrees.join(", ")}`
    );
  }

  // Department eligibility
  const departmentEligible =
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
            studentDepartment
        );
      }
    );

  if (departmentEligible) {
    reasons.push(
      "Department requirement is satisfied"
    );
  } else {
    missing.push(
      `Eligible department: ${event.eligibleDepartments.join(", ")}`
    );
  }

  // Year eligibility
  const yearEligible =
    event.eligibleYears.includes(student.year);

  if (yearEligible) {
    reasons.push(
      `${student.year}${getYearSuffix(student.year)} year is eligible`
    );
  } else {
    missing.push(
      `Eligible years: ${event.eligibleYears.join(", ")}`
    );
  }

  // Required skills
  for (const requiredSkill of event.requiredSkills) {

    const requiredSkillName =
      normalizeText(requiredSkill.name);

    const hasSkill =
      student.skills.some(
        studentSkill =>
          normalizeText(studentSkill) ===
          requiredSkillName
      );

    if (hasSkill) {
      reasons.push(
        `Has required skill: ${requiredSkill.name}`
      );
    } else {
      missing.push(
        `Required skill: ${requiredSkill.name}`
      );
    }
  }

  // Final eligibility status
  if (missing.length === 0) {
    return {
      status: "Eligible",
      reasons,
      missing
    };
  }

  if (reasons.length > 0) {
    return {
      status: "Partial",
      reasons,
      missing
    };
  }

  return {
    status: "Not Eligible",
    reasons,
    missing
  };
}

function getYearSuffix(year: number): string {
  if (year === 1) return "st";
  if (year === 2) return "nd";
  if (year === 3) return "rd";
  return "th";
}