import { EventRecord } from "./types";

export const hackguruEvents: EventRecord[] = [
  {
    id: 101,
    title: "HACKVERSE 2.0",
    description: "A technology hackathon for innovative solutions.",
    eventType: "Hackathon",
    domains: ["Artificial Intelligence", "Machine Learning"],
    location: "Coimbatore",
    mode: "Offline",
    venue: "Kumaraguru College of Technology",
    eventStartDate: "2026-09-25",
    eventEndDate: "2026-09-26",
    registrationDeadline: "2026-09-20",
    eligibleDegrees: ["B.Tech", "B.E."],
    eligibleDepartments: ["All Engineering Departments"],
    eligibleYears: [1, 2, 3, 4],
    requiredSkills: [
      { name: "Python", minimumLevel: "Beginner" },
      { name: "Machine Learning", minimumLevel: "Beginner" }
    ],
    minimumTeamSize: 2,
    maximumTeamSize: 4,
    fee: 0,
    organizer: "HackVerse",
    verified: true,
    status: "ACTIVE",
    sourceUrl: "https://example.com/register",
    lastSyncedAt: "2026-09-01",
    demoEnriched: true
  },

  {
    id: 102,
    title: "HackITon '26",
    description: "A competitive hackathon focused on software and technology.",
    eventType: "Hackathon",
    domains: ["Software Development", "Artificial Intelligence"],
    location: "Coimbatore",
    mode: "Offline",
    venue: "Coimbatore Institute of Technology",
    eventStartDate: "2026-09-27",
    eventEndDate: "2026-09-28",
    registrationDeadline: "2026-09-20",
    eligibleDegrees: ["B.Tech", "B.E."],
    eligibleDepartments: ["All Engineering Departments"],
    eligibleYears: [1, 2, 3, 4],
    requiredSkills: [
      { name: "Programming", minimumLevel: "Beginner" },
      { name: "Problem Solving", minimumLevel: "Beginner" }
    ],
    minimumTeamSize: 2,
    maximumTeamSize: 4,
    fee: 0,
    organizer: "HackITon",
    verified: true,
    status: "ACTIVE",
    sourceUrl: "https://example.com/register",
    lastSyncedAt: "2026-09-01",
    demoEnriched: true
  }
];