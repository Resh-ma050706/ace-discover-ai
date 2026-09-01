import type {
  RegistrationRequest,
  StudentProfile,
} from "../types/StudentProfile";

const TOKEN_KEY = "ace_auth_token";
const PROFILE_KEY = "ace_student_profile";

export async function registerStudent(
  data: RegistrationRequest
): Promise<{ token: string; profile: StudentProfile }> {
  await delay(500);

  const existingProfile = localStorage.getItem(PROFILE_KEY);

  if (existingProfile) {
    throw new Error("EMAIL_ALREADY_REGISTERED");
  }

  const { password: _password, ...profile } = data;

  const token = "mock-token-" + Date.now();

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));

  return {
    token,
    profile,
  };
}

export async function loginStudent(
  email: string,
  password: string
): Promise<{ token: string; profile: StudentProfile }> {
  await delay(500);

  const storedProfile = localStorage.getItem(PROFILE_KEY);

  if (!storedProfile) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const profile = JSON.parse(storedProfile) as StudentProfile;

  if (profile.email !== email || password.length === 0) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const token = "mock-token-" + Date.now();

  localStorage.setItem(TOKEN_KEY, token);

  return {
    token,
    profile,
  };
}

export async function getProfile(): Promise<StudentProfile> {
  await delay(300);

  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  const storedProfile = localStorage.getItem(PROFILE_KEY);

  if (!storedProfile) {
    throw new Error("UNAUTHORIZED");
  }

  return JSON.parse(storedProfile) as StudentProfile;
}

export async function updateProfile(
  profile: StudentProfile
): Promise<StudentProfile> {
  await delay(300);

  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));

  return profile;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}