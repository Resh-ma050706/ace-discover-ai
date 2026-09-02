import { SearchIntent } from "./types";
import { normalizeText } from "./normalize";

export function extractIntent(query: string): SearchIntent {
  const normalized = normalizeText(query);

  const intent: SearchIntent = {
    rawQuery: query
  };

  // -----------------------------
  // Domain detection
  // -----------------------------
  if (
    normalized.includes("artificial intelligence") ||
    normalized.includes("ai")
  ) {
    intent.domain = "Artificial Intelligence";
  } else if (
    normalized.includes("machine learning") ||
    normalized.includes("ml")
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
    normalized.includes("cloud") ||
    normalized.includes("cloud computing")
  ) {
    intent.domain = "Cloud Computing";
  } else if (normalized.includes("research")) {
    intent.domain = "Research";
  } else if (normalized.includes("engineering")) {
    intent.domain = "Engineering";
  } else if (normalized.includes("innovation")) {
    intent.domain = "Innovation";
  }

  // -----------------------------
  // Event type detection
  // -----------------------------
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

  // -----------------------------
  // Location detection
  // -----------------------------
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

  // -----------------------------
  // Mode detection
  // -----------------------------
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

  // -----------------------------
  // Student year detection
  // -----------------------------
  const yearMatch = normalized.match(
  /(\d+)(st|nd|rd|th)?[\s-]*year/
);

if (yearMatch) {
  intent.year = Number(yearMatch[1]);
}

const wordYearMap: Record<string, number> = {
  first: 1,
  second: 2,
  third: 3,
  fourth: 4
};

const wordYearMatch = normalized.match(
  /\b(first|second|third|fourth)[\s-]*year\b/
);

if (wordYearMatch) {
  intent.year = wordYearMap[wordYearMatch[1]];
}
  // -----------------------------
  // Student type detection
  // -----------------------------
  if (
    normalized.includes("engineering student") ||
    normalized.includes("engineering students") ||
    normalized.includes("engineering")
  ) {
    intent.studentType = "Engineering Student";
  } else if (
    normalized.includes("college student") ||
    normalized.includes("college students")
  ) {
    intent.studentType = "College Student";
  }

  // -----------------------------
  // Skill detection
  // -----------------------------
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
    normalized.includes("ml")
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

  // -----------------------------
  // Time range detection
  // -----------------------------
  if (normalized.includes("this month")) {
    intent.timeRange = "This month";
  } else if (normalized.includes("this week")) {
    intent.timeRange = "This week";
  } else if (normalized.includes("this weekend")) {
    intent.timeRange = "This weekend";
  }

  return intent;
}