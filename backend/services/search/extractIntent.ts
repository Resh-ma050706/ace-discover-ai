
import { SearchIntent } from "./types";
import { normalizeText } from "./normalize";

export function extractIntent(query: string): SearchIntent {
  const normalized = normalizeText(query);

  const intent: SearchIntent = {
    rawQuery: query
  };

  // -------------------------
  // DOMAIN
  // -------------------------
  if (
    normalized.includes("artificial intelligence") ||
    /\bai\b/.test(normalized)
  ) {
    intent.domain = "Artificial Intelligence";
  } else if (
    normalized.includes("machine learning") ||
    /\bml\b/.test(normalized)
  ) {
    intent.domain = "Machine Learning";
  } else if (
    normalized.includes("data science") ||
    normalized.includes("data analytics")
  ) {
    intent.domain = "Data Science";
  } else if (
    normalized.includes("web development") ||
    normalized.includes("web dev")
  ) {
    intent.domain = "Web Development";
  } else if (
    normalized.includes("cybersecurity") ||
    normalized.includes("cyber security")
  ) {
    intent.domain = "Cybersecurity";
  } else if (
    normalized.includes("software development") ||
    normalized.includes("software")
  ) {
    intent.domain = "Software Development";
  } else if (
    normalized.includes("cloud computing") ||
    normalized.includes("cloud")
  ) {
    intent.domain = "Cloud Computing";
  } else if (normalized.includes("research")) {
    intent.domain = "Research";
  } else if (normalized.includes("engineering")) {
    intent.domain = "Engineering";
  } else if (normalized.includes("innovation")) {
    intent.domain = "Innovation";
  }

  // -------------------------
  // EVENT TYPE
  // -------------------------
  if (normalized.includes("hackathon")) {
    intent.eventType = "Hackathon";
  } else if (normalized.includes("workshop")) {
    intent.eventType = "Workshop";
  } else if (normalized.includes("internship")) {
    intent.eventType = "Internship";
  } else if (normalized.includes("conference")) {
    intent.eventType = "Conference";
  } else if (
    normalized.includes("technical symposium") ||
    normalized.includes("symposium")
  ) {
    intent.eventType = "Technical Symposium";
  } else if (
    normalized.includes("competition") ||
    normalized.includes("contest")
  ) {
    intent.eventType = "Competition";
  }

  // -------------------------
  // LOCATION
  // -------------------------
  const locations: Record<string, string> = {
    chennai: "Chennai",
    coimbatore: "Coimbatore"
  };

  for (const [keyword, location] of Object.entries(locations)) {
    if (normalized.includes(keyword)) {
      intent.location = location;
      break;
    }
  }

  // -------------------------
  // MODE
  // -------------------------
  if (
    normalized.includes("online") ||
    normalized.includes("remote") ||
    normalized.includes("virtual")
  ) {
    intent.mode = "Online";
  } else if (
    normalized.includes("offline") ||
    normalized.includes("in person") ||
    normalized.includes("in-person")
  ) {
    intent.mode = "Offline";
  } else if (normalized.includes("hybrid")) {
    intent.mode = "Hybrid";
  }

  // -------------------------
  // STUDENT YEAR
  // -------------------------
  // Handles:
  // 1st year
  // 1st years
  // 2nd year
  // 2nd years
  // 3rd year
  // 3rd years
  // 4th year
  // 4th years
  // first year
  // second year
  // third year
  // fourth year

  const numericYearMatch = normalized.match(
    /\b([1-4])(st|nd|rd|th)?[\s-]*years?\b/
  );

  if (numericYearMatch) {
    intent.year = Number(numericYearMatch[1]);
  }

  const wordYearMap: Record<string, number> = {
    first: 1,
    second: 2,
    third: 3,
    fourth: 4
  };

  const wordYearMatch = normalized.match(
    /\b(first|second|third|fourth)[\s-]*years?\b/
  );

  if (wordYearMatch) {
    intent.year = wordYearMap[wordYearMatch[1]];
  }

  // If a year was mentioned, make studentType reflect it.
  if (intent.year) {
    const suffix =
      intent.year === 1
        ? "st"
        : intent.year === 2
        ? "nd"
        : intent.year === 3
        ? "rd"
        : "th";

    intent.studentType = `${intent.year}${suffix} Year Students`;
  } else if (
    normalized.includes("engineering student") ||
    normalized.includes("engineering students")
  ) {
    intent.studentType = "Engineering Students";
  } else if (
    normalized.includes("college student") ||
    normalized.includes("college students")
  ) {
    intent.studentType = "College Students";
  } else if (
    normalized.includes("student") ||
    normalized.includes("students")
  ) {
    intent.studentType = "Students";
  }

  // -------------------------
  // SKILLS
  // -------------------------
  const detectedSkills: string[] = [];

  if (normalized.includes("python")) {
    detectedSkills.push("Python");
  }

  if (
    normalized.includes("programming") ||
    normalized.includes("coding")
  ) {
    detectedSkills.push("Programming");
  }

  if (
    normalized.includes("machine learning") ||
    /\bml\b/.test(normalized)
  ) {
    detectedSkills.push("Machine Learning");
  }

  if (normalized.includes("data science")) {
    detectedSkills.push("Data Science");
  }

  if (
    normalized.includes("problem solving") ||
    normalized.includes("problem-solving")
  ) {
    detectedSkills.push("Problem Solving");
  }

  if (normalized.includes("research")) {
    detectedSkills.push("Research");
  }

  if (detectedSkills.length > 0) {
    intent.skills = detectedSkills;
  }

  // -------------------------
  // TIME RANGE
  // -------------------------
  if (normalized.includes("this month")) {
    intent.timeRange = "This month";
  } else if (normalized.includes("this week")) {
    intent.timeRange = "This week";
  } else if (normalized.includes("this weekend")) {
    intent.timeRange = "This weekend";
  } else if (normalized.includes("next month")) {
    intent.timeRange = "Next month";
  } else if (normalized.includes("next week")) {
    intent.timeRange = "Next week";
  } else {
    // Month-name detection
    const months: Record<string, string> = {
      january: "January",
      february: "February",
      march: "March",
      april: "April",
      may: "May",
      june: "June",
      july: "July",
      august: "August",
      september: "September",
      october: "October",
      november: "November",
      december: "December"
    };

    for (const [monthName, displayName] of Object.entries(months)) {
      if (normalized.includes(monthName)) {
        intent.timeRange = displayName;
        break;
      }
    }
  }

  return intent;
}
