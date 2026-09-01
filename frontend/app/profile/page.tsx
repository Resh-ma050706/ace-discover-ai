"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getProfile,
  updateProfile,
  logout,
} from "../../services/authService";
import type { StudentProfile } from "../../types/StudentProfile";

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState<StudentProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  useEffect(() => {
    async function loadProfile() {
      try {
        const studentProfile = await getProfile();
        setProfile(studentProfile);
      } catch {
        setError("Please login to view your profile.");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  function handleLogout() {
    logout();
    router.push("/login");
  }
async function handleSave() {
  if (!editProfile) {
    return;
  }

  try {
    setIsSaving(true);
    setSaveMessage("");

    const updatedProfile = await updateProfile(editProfile);

    setProfile(updatedProfile);
    setEditProfile(null);
    setIsEditing(false);
    setSaveMessage("Profile updated successfully.");
  } catch (saveError) {
    if (
      saveError instanceof Error &&
      saveError.message === "UNAUTHORIZED"
    ) {
      setError("Your session has expired. Please login again.");
      return;
    }

    setSaveMessage("Failed to update profile. Please try again.");
  } finally {
    setIsSaving(false);
  }
}
  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-400">Loading profile...</p>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
          <h1 className="text-2xl font-bold">Profile unavailable</h1>

          <p className="mt-3 text-slate-400">
            {error || "Your profile could not be loaded."}
          </p>

          <button
            onClick={() => router.push("/login")}
            className="mt-6 rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
          >
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              ACE Discover AI
            </p>

            <h1 className="mt-2 text-4xl font-bold">
              Student Profile
            </h1>

            <p className="mt-2 text-slate-400">
              Your profile information
            </p>
          </div>

          <div className="flex gap-3">
  {!isEditing ? (
  <button
    onClick={() => {
      setEditProfile(profile);
      setSaveMessage("");
      setIsEditing(true);
    }}
    className="rounded-lg bg-cyan-500 px-5 py-2.5 font-semibold text-slate-950 hover:bg-cyan-400"
  >
    Edit Profile
  </button>
) : (
  <>
    <button
      onClick={handleSave}
      disabled={isSaving}
      className="rounded-lg bg-cyan-500 px-5 py-2.5 font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isSaving ? "Saving..." : "Save Changes"}
    </button>

    <button
      onClick={() => {
        setEditProfile(null);
        setIsEditing(false);
        setSaveMessage("");
      }}
      disabled={isSaving}
      className="rounded-lg border border-slate-700 px-5 py-2.5 font-medium hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      Cancel
    </button>
  </>
)}

  <button
    onClick={handleLogout}
    className="rounded-lg border border-slate-700 px-5 py-2.5 font-medium hover:bg-slate-800"
  >
    Logout
  </button>
</div>
        </header>
{saveMessage && (
  <div className="mb-6 rounded-lg border border-green-500/40 bg-green-500/10 p-4 text-sm text-green-300">
    {saveMessage}
  </div>
)}
        <div className="space-y-6">
          {/* Personal Information */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-5 text-xl font-semibold">
              Personal Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Name</p>

{isEditing && editProfile ? (
  <input
    value={editProfile.name}
    onChange={(event) =>
      setEditProfile({
        ...editProfile,
        name: event.target.value,
      })
    }
    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 outline-none focus:border-cyan-400"
  />
) : (
  <p className="mt-1 font-medium">{profile.name}</p>
)}
              </div>

              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="mt-1 font-medium">{profile.email}</p>
              </div>
            </div>
          </section>

          {/* Academic Information */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-5 text-xl font-semibold">
              Academic Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">College</p>

{isEditing && editProfile ? (
  <input
    value={editProfile.college}
    onChange={(event) =>
      setEditProfile({
        ...editProfile,
        college: event.target.value,
      })
    }
    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 outline-none focus:border-cyan-400"
  />
) : (
  <p className="mt-1 font-medium">{profile.college}</p>
)}
              </div>

              <div>
                <p className="text-sm text-slate-500">Degree</p>

{isEditing && editProfile ? (
  <input
    value={editProfile.degree}
    onChange={(event) =>
      setEditProfile({
        ...editProfile,
        degree: event.target.value,
      })
    }
    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 outline-none focus:border-cyan-400"
  />
) : (
  <p className="mt-1 font-medium">{profile.degree}</p>
)}
              </div>

              <div>
                <p className="text-sm text-slate-500">Department</p>

{isEditing && editProfile ? (
  <input
    value={editProfile.department}
    onChange={(event) =>
      setEditProfile({
        ...editProfile,
        department: event.target.value,
      })
    }
    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 outline-none focus:border-cyan-400"
  />
) : (
  <p className="mt-1 font-medium">{profile.department}</p>
)}
              </div>

              <div>
                <p className="text-sm text-slate-500">Study Year</p>

{isEditing && editProfile ? (
  <input
    type="number"
    min="1"
    max="6"
    value={editProfile.studyYear}
    onChange={(event) =>
      setEditProfile({
        ...editProfile,
        studyYear: Number(event.target.value),
      })
    }
    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 outline-none focus:border-cyan-400"
  />
) : (
  <p className="mt-1 font-medium">
    Year {profile.studyYear}
  </p>
)}
                  Year {profile.studyYear}
                
              </div>
            </div>
          </section>

          {/* Skills */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-5 text-xl font-semibold">
              Skills
            </h2>

            <div className="flex flex-wrap gap-3">
              {profile.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="rounded-full bg-slate-800 px-4 py-2"
                >
                  <span className="font-medium">{skill.name}</span>
                  <span className="ml-2 text-sm text-slate-400">
                    {skill.level}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Interests */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-5 text-xl font-semibold">
              Interests
            </h2>

            <div className="flex flex-wrap gap-3">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="rounded-full bg-slate-800 px-4 py-2"
                >
                  {interest}
                </span>
              ))}
            </div>
          </section>

          {/* Preferences */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-5 text-xl font-semibold">
              Preferences
            </h2>

            <div className="space-y-5">
              <div>
                <p className="mb-2 text-sm text-slate-500">
                  Preferred Locations
                </p>

                <div className="flex flex-wrap gap-2">
                  {profile.preferredLocations.map((location) => (
                    <span
                      key={location}
                      className="rounded-full bg-slate-800 px-4 py-2"
                    >
                      {location}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm text-slate-500">
                  Preferred Event Types
                </p>

                <div className="flex flex-wrap gap-2">
                  {profile.preferredEventTypes.map((eventType) => (
                    <span
                      key={eventType}
                      className="rounded-full bg-slate-800 px-4 py-2"
                    >
                      {eventType}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Team Availability
                </p>

                <p className="mt-1 font-medium">
                  {profile.teamAvailability}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}