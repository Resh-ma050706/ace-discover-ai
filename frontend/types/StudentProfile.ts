export type SkillLevel = "Beginner" | "Intermediate" | "Advanced";

export interface StudentSkill {
  name: string;
  level: SkillLevel;
}

export interface StudentProfile {
  name: string;
  email: string;
  college: string;
  degree: string;
  department: string;
  studyYear: number;
  skills: StudentSkill[];
  interests: string[];
  preferredLocations: string[];
  preferredEventTypes: string[];
  teamAvailability: string;
}

export interface RegistrationRequest extends StudentProfile {
  password: string;
}