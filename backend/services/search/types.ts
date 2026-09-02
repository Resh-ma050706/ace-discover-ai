export interface SearchIntent {
  domain?: string;
  eventType?: string;
  location?: string;
  mode?: string;
  timeRange?: string;
  studentType?: string;
  year?: number;
  skills?: string[];
  rawQuery: string;
}

export interface StudentProfile {
  name: string;
  email: string;
  college: string;
  degree: string;
  department: string;
  year: number;
  skills: string[];
  interests: string[];
  preferredLocation?: string;
  preferredEventTypes?: string[];
  teamAvailability?: boolean;
}

export interface RequiredSkill {
  name: string;
  minimumLevel: string;
}

export interface EventRecord {
  id: number;
  title: string;
  description: string;
  eventType: string;
  domains: string[];
  location: string;
  mode: string;
  venue: string;
  eventStartDate: string;
  eventEndDate: string;
  registrationDeadline: string;
  eligibleDegrees: string[];
  eligibleDepartments: string[];
  eligibleYears: number[];
  requiredSkills: RequiredSkill[];
  minimumTeamSize: number;
  maximumTeamSize: number;
  fee: number;
  organizer: string;
  verified: boolean;
  status: string;
  sourceUrl: string;
  lastSyncedAt: string;
  demoEnriched: boolean;
}

export interface ScoreBreakdown {
  domain: number;
  eligibility: number;
  skill: number;
  location: number;
  date: number;
  urgency: number;
  total: number;
}

export type EligibilityStatus =
  | "Eligible"
  | "Partial"
  | "Not Eligible";

export interface EligibilityResult {
  status: EligibilityStatus;
  reasons: string[];
  missing: string[];
}

export interface SearchResultItem {
  id: string;
  title: string;
  location: string;
  matchPercentage: number;
  eligibilityStatus: EligibilityStatus;
  matchReasons: string[];
  missingRequirements: string[];
  registrationDeadline: string;
  suggestedNextAction: string;
  registrationLink: string;
}

export interface SearchResponse {
  query: string;

  interpretedQuery: {
    domain?: string;
    eventType?: string;
    location?: string;
    mode?: string;
    timeRange?: string;
    studentType?: string;
    year?: number;
  };

  results: SearchResultItem[];
}