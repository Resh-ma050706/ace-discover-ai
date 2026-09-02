
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
  const [editProfile, setEditProfile] =
    useState<StudentProfile | null>(null);
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

  function handleRegisterForEvent() {
    router.push("/event-registration");
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
      <main className="flex min-h-screen items-center justify-center bg-[#F8F9FC] px-4 text-[#172033]">
        <div className="w-full max-w-md rounded-3xl border border-[#E5E7EB] bg-white p-8 text-center shadow-xl shadow-purple-100/30">
          <h1 className="text-2xl font-bold tracking-tight text-[#172033]">
            Profile unavailable
          </h1>

          <p className="mt-3 text-[#64748B]">
            {error || "Your profile could not be loaded."}
          </p>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="mt-6 rounded-xl bg-gradient-to-r from-[#6D28D9] to-[#8B2CF5] px-6 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F9FC] px-4 py-10 text-[#172033]">
      <div className="mx-auto max-w-4xl">

        {/* HEADER */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#6D28D9]">
              ACE Discover AI
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#172033]">
              Student Profile
            </h1>

            <p className="mt-2 text-[#64748B]">
              Your profile information
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            {/* REGISTER FOR EVENT */}
            <button
              type="button"
              onClick={handleRegisterForEvent}
              className="rounded-xl bg-gradient-to-r from-[#6D28D9] to-[#8B2CF5] px-5 py-2.5 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              Register for an Event
            </button>

            {/* EDIT / SAVE / CANCEL */}
            {!isEditing ? (
              <button
                type="button"
                onClick={() => {
                  setEditProfile(profile);
                  setSaveMessage("");
                  setIsEditing(true);
                }}
                className="rounded-xl bg-gradient-to-r from-[#6D28D9] to-[#8B2CF5] px-5 py-2.5 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="rounded-xl bg-gradient-to-r from-[#6D28D9] to-[#8B2CF5] px-5 py-2.5 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditProfile(null);
                    setIsEditing(false);
                    setSaveMessage("");
                  }}
                  disabled={isSaving}
                  className="rounded-xl border border-[#E5E7EB] bg-white px-5 py-2.5 font-semibold text-[#172033] transition hover:border-[#C4B5FD] hover:bg-[#FAF8FF] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
              </>
            )}

            {/* LOGOUT */}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-[#E5E7EB] bg-white px-5 py-2.5 font-semibold text-[#172033] transition hover:border-[#C4B5FD] hover:bg-[#FAF8FF]"
            >
              Logout
            </button>
          </div>
        </header>

        {/* SAVE MESSAGE */}
        {saveMessage && (
          <div className="mb-6 rounded-lg border border-green-500/40 bg-green-500/10 p-4 text-sm text-green-700">
            {saveMessage}
          </div>
        )}

        <div className="space-y-6">

          {/* PERSONAL INFORMATION */}
          <section className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-purple-100/40">
            <h2 className="mb-5 text-xl font-bold tracking-tight text-[#172033]">
              Personal Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <p className="text-sm font-medium text-[#64748B]">
                  Name
                </p>

                {isEditing && editProfile ? (
                  <input
                    value={editProfile.name}
                    onChange={(event) =>
                      setEditProfile({
                        ...editProfile,
                        name: event.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-[#FAF8FF] px-3 py-2.5 text-[#172033] outline-none focus:border-[#7C3AED] focus:bg-white focus:ring-4 focus:ring-[#7C3AED]/10"
                  />
                ) : (
                  <p className="mt-1 font-medium">
                    {profile.name}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-[#64748B]">
                  Email
                </p>

                <p className="mt-1 font-medium">
                  {profile.email}
                </p>
              </div>

            </div>
          </section>

          {/* ACADEMIC INFORMATION */}
          <section className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-purple-100/40">
            <h2 className="mb-5 text-xl font-bold tracking-tight text-[#172033]">
              Academic Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <p className="text-sm font-medium text-[#64748B]">
                  College
                </p>

                {isEditing && editProfile ? (
                  <input
                    value={editProfile.college}
                    onChange={(event) =>
                      setEditProfile({
                        ...editProfile,
                        college: event.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-[#FAF8FF] px-3 py-2.5 text-[#172033] outline-none focus:border-[#7C3AED] focus:bg-white focus:ring-4 focus:ring-[#7C3AED]/10"
                  />
                ) : (
                  <p className="mt-1 font-medium">
                    {profile.college}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-[#64748B]">
                  Degree
                </p>

                {isEditing && editProfile ? (
                  <input
                    value={editProfile.degree}
                    onChange={(event) =>
                      setEditProfile({
                        ...editProfile,
                        degree: event.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-[#FAF8FF] px-3 py-2.5 text-[#172033] outline-none focus:border-[#7C3AED] focus:bg-white focus:ring-4 focus:ring-[#7C3AED]/10"
                  />
                ) : (
                  <p className="mt-1 font-medium">
                    {profile.degree}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-[#64748B]">
                  Department
                </p>

                {isEditing && editProfile ? (
                  <input
                    value={editProfile.department}
                    onChange={(event) =>
                      setEditProfile({
                        ...editProfile,
                        department: event.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-[#FAF8FF] px-3 py-2.5 text-[#172033] outline-none focus:border-[#7C3AED] focus:bg-white focus:ring-4 focus:ring-[#7C3AED]/10"
                  />
                ) : (
                  <p className="mt-1 font-medium">
                    {profile.department}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-[#64748B]">
                  Study Year
                </p>

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
                    className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-[#FAF8FF] px-3 py-2.5 text-[#172033] outline-none focus:border-[#7C3AED] focus:bg-white focus:ring-4 focus:ring-[#7C3AED]/10"
                  />
                ) : (
                  <p className="mt-1 font-medium">
                    Year {profile.studyYear}
                  </p>
                )}
              </div>

            </div>
          </section>

          {/* SKILLS */}
          <section className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-purple-100/40">
            <h2 className="mb-5 text-xl font-bold tracking-tight text-[#172033]">
              Skills
            </h2>

            <div className="flex flex-wrap gap-3">
              {profile.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="rounded-full border border-[#E9D5FF] bg-[#F3E8FF] px-4 py-2 text-[#6D28D9]"
                >
                  <span className="font-medium">
                    {skill.name}
                  </span>

                  <span className="ml-2 text-sm text-[#64748B]">
                    {skill.level}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* INTERESTS */}
          <section className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-purple-100/40">
            <h2 className="mb-5 text-xl font-bold tracking-tight text-[#172033]">
              Interests
            </h2>

            <div className="flex flex-wrap gap-3">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="rounded-full border border-[#E9D5FF] bg-[#F3E8FF] px-4 py-2 text-[#6D28D9]"
                >
                  {interest}
                </span>
              ))}
            </div>
          </section>

          {/* PREFERENCES */}
          <section className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm shadow-purple-100/40">
            <h2 className="mb-5 text-xl font-bold tracking-tight text-[#172033]">
              Preferences
            </h2>

            <div className="space-y-5">

              <div>
                <p className="mb-2 text-sm font-medium text-[#64748B]">
                  Preferred Locations
                </p>

                <div className="flex flex-wrap gap-2">
                  {profile.preferredLocations.map((location) => (
                    <span
                      key={location}
                      className="rounded-full border border-[#E9D5FF] bg-[#F3E8FF] px-4 py-2 text-[#6D28D9]"
                    >
                      {location}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-[#64748B]">
                  Preferred Event Types
                </p>

                <div className="flex flex-wrap gap-2">
                  {profile.preferredEventTypes.map((eventType) => (
                    <span
                      key={eventType}
                      className="rounded-full border border-[#E9D5FF] bg-[#F3E8FF] px-4 py-2 text-[#6D28D9]"
                    >
                      {eventType}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-[#64748B]">
                  Team Availability
                </p>

                <p className="mt-1 font-medium">
                  {profile.teamAvailability}
                </p>
              </div>

            </div>
          </section>

          {/* EVENT REGISTRATION CTA */}
          <section className="rounded-3xl border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-xl font-bold text-[#172033]">
                  Ready to find your next opportunity?
                </h2>

                <p className="mt-2 text-[#64748B]">
                  Register for an event and take the next step in your journey.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRegisterForEvent}
                className="shrink-0 rounded-xl bg-gradient-to-r from-[#6D28D9] to-[#8B2CF5] px-6 py-3 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                Go to Event Registration →
              </button>

            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
