import { searchEvents } from "./index";
import { StudentProfile, EventRecord } from "./types";

const student: StudentProfile = {
  name: "Student",
  email: "student@example.com",
  college: "Engineering College",
  degree: "B.Tech",
  department: "AI and Data Science",
  year: 2,
  skills: [
    "Python",
    "Machine Learning",
    "Data Science",
    "Programming"
  ],
  interests: [
    "Artificial Intelligence",
    "Hackathons"
  ],
  preferredLocation: "Chennai",
  preferredEventTypes: [
    "Hackathon",
    "Workshop"
  ]
};

const events: EventRecord[] = [
  {
    id: 101,
    title: "HACKVERSE 2.0",
    description:
      "A next-generation hackathon focused on coding, technology and innovation.",
    eventType: "Hackathon",
    domains: [
      "Artificial Intelligence",
      "Web Development",
      "Cybersecurity"
    ],
    location: "Coimbatore",
    mode: "Offline",
    venue: "Karpagam College of Engineering",
    eventStartDate: "2026-09-25",
    eventEndDate: "2026-09-25",
    registrationDeadline: "2026-09-20",
    eligibleDegrees: [
      "B.E",
      "B.Tech"
    ],
    eligibleDepartments: [
      "Computer Science",
      "Information Technology",
      "AI and Data Science"
    ],
    eligibleYears: [1, 2, 3, 4],
    requiredSkills: [
      {
        name: "Programming",
        minimumLevel: "Beginner"
      },
      {
        name: "Problem Solving",
        minimumLevel: "Beginner"
      }
    ],
    minimumTeamSize: 2,
    maximumTeamSize: 4,
    fee: 600,
    organizer: "Karpagam College of Engineering",
    verified: true,
    status: "ACTIVE",
    sourceUrl:
      "https://www.allcollegeevent.com/events",
    lastSyncedAt:
      "2026-09-01T10:00:00Z",
    demoEnriched: true
  },

  {
    id: 102,
    title: "HackITon '26",
    description:
      "A 24-hour inter-college hackathon where students develop innovative technical solutions.",
    eventType: "Hackathon",
    domains: [
      "Artificial Intelligence",
      "Software Development",
      "Open Innovation"
    ],
    location: "Coimbatore",
    mode: "Offline",
    venue: "Coimbatore Engineering Campus",
    eventStartDate: "2026-10-08",
    eventEndDate: "2026-10-09",
    registrationDeadline: "2026-10-01",
    eligibleDegrees: [
      "B.E",
      "B.Tech",
      "B.Sc",
      "BCA"
    ],
    eligibleDepartments: [
      "Computer Science",
      "Information Technology",
      "AI and Data Science"
    ],
    eligibleYears: [1, 2, 3, 4],
    requiredSkills: [
      {
        name: "Programming",
        minimumLevel: "Beginner"
      }
    ],
    minimumTeamSize: 2,
    maximumTeamSize: 4,
    fee: 500,
    organizer: "Engineering College",
    verified: true,
    status: "ACTIVE",
    sourceUrl:
      "https://www.allcollegeevent.com/events",
    lastSyncedAt:
      "2026-09-01T10:00:00Z",
    demoEnriched: true
  },

  {
    id: 103,
    title: "GENESIS '26 - Space Age",
    description:
      "A hands-on AI session covering reusable AI agents and modern AI tools.",
    eventType: "Workshop",
    domains: [
      "Artificial Intelligence",
      "AI Agents"
    ],
    location: "Chennai",
    mode: "Offline",
    venue: "Chennai Engineering Campus",
    eventStartDate: "2026-09-02",
    eventEndDate: "2026-09-02",
    registrationDeadline: "2026-09-01",
    eligibleDegrees: [
      "B.E",
      "B.Tech",
      "B.Sc",
      "BCA"
    ],
    eligibleDepartments: [
      "All Departments"
    ],
    eligibleYears: [1, 2, 3, 4],
    requiredSkills: [],
    minimumTeamSize: 1,
    maximumTeamSize: 1,
    fee: 75,
    organizer: "GENESIS '26",
    verified: true,
    status: "ACTIVE",
    sourceUrl:
      "https://www.allcollegeevent.com/events",
    lastSyncedAt:
      "2026-09-01T10:00:00Z",
    demoEnriched: true
  }
];

const query =
  "Find AI hackathons for second-year engineering students in Coimbatore this month";

const response = searchEvents(
  query,
  student,
  events
);

console.log(
  JSON.stringify(response, null, 2)
);