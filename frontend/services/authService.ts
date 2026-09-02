import type {
  RegistrationRequest,
  StudentProfile,
} from "../types/StudentProfile";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const TOKEN_KEY = "ace_auth_token";
const PROFILE_KEY = "ace_student_profile";

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  token?: string;
  profile?: T;
}

async function requestProfile(token: string): Promise<StudentProfile> {
  const response = await fetch(`${API_BASE_URL}/api/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = (await response.json()) as ApiResponse<StudentProfile>;

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }

    throw new Error(result.message || "PROFILE_FETCH_FAILED");
  }

  if (!result.profile) {
    throw new Error("PROFILE_FETCH_FAILED");
  }

  localStorage.setItem(PROFILE_KEY, JSON.stringify(result.profile));

  return result.profile;
}

export async function registerStudent(
  data: RegistrationRequest
): Promise<{ token: string; profile: StudentProfile }> {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = (await response.json()) as ApiResponse;

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("EMAIL_ALREADY_REGISTERED");
    }

    throw new Error(result.message || "REGISTRATION_FAILED");
  }

  if (!result.token) {
    throw new Error("REGISTRATION_FAILED");
  }

  localStorage.setItem(TOKEN_KEY, result.token);

  // Fetch the formatted profile from GET /api/profile.
  const profile = await requestProfile(result.token);

  return {
    token: result.token,
    profile,
  };
}

export async function loginStudent(
  email: string,
  password: string
): Promise<{ token: string; profile: StudentProfile }> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const result = (await response.json()) as ApiResponse;

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("INVALID_CREDENTIALS");
    }

    throw new Error(result.message || "LOGIN_FAILED");
  }

  if (!result.token) {
    throw new Error("LOGIN_FAILED");
  }

  localStorage.setItem(TOKEN_KEY, result.token);

  // Login doesn't return the profile, so fetch it separately.
  const profile = await requestProfile(result.token);

  return {
    token: result.token,
    profile,
  };
}

export async function getProfile(): Promise<StudentProfile> {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  return requestProfile(token);
}

export async function updateProfile(
  profile: StudentProfile
): Promise<StudentProfile> {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  const response = await fetch(`${API_BASE_URL}/api/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profile),
  });

  const result = (await response.json()) as ApiResponse<StudentProfile>;

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }

    throw new Error(result.message || "PROFILE_UPDATE_FAILED");
  }

  if (!result.profile) {
    throw new Error("PROFILE_UPDATE_FAILED");
  }

  localStorage.setItem(PROFILE_KEY, JSON.stringify(result.profile));

  return result.profile;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
}