"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { registerStudent } from "../../services/authService";
import type {
  RegistrationRequest,
  SkillLevel,
  StudentSkill,
} from "../../types/StudentProfile";

const skillLevels: SkillLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

const eventTypes = [
  "Hackathon",
  "Workshop",
  "Competition",
  "Internship",
  "Conference",
];

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<RegistrationRequest>({
    name: "",
    email: "",
    password: "",
    college: "",
    degree: "",
    department: "",
    studyYear: 1,
    skills: [],
    interests: [],
    preferredLocations: [],
    preferredEventTypes: [],
    teamAvailability: "Individual",
  });

  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("Beginner");
  const [interestInput, setInterestInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(
    field: keyof RegistrationRequest,
    value: string | number
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function addSkill() {
    const trimmedName = skillName.trim();

    if (!trimmedName) return;

    const alreadyExists = form.skills.some(
      (skill) => skill.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (alreadyExists) return;

    const newSkill: StudentSkill = {
      name: trimmedName,
      level: skillLevel,
    };

    setForm((previous) => ({
      ...previous,
      skills: [...previous.skills, newSkill],
    }));

    setSkillName("");
    setSkillLevel("Beginner");
  }

  function removeSkill(skillNameToRemove: string) {
    setForm((previous) => ({
      ...previous,
      skills: previous.skills.filter(
        (skill) => skill.name !== skillNameToRemove
      ),
    }));
  }

  function addInterest() {
    const value = interestInput.trim();

    if (!value) return;

    if (
      form.interests.some(
        (interest) => interest.toLowerCase() === value.toLowerCase()
      )
    ) {
      return;
    }

    setForm((previous) => ({
      ...previous,
      interests: [...previous.interests, value],
    }));

    setInterestInput("");
  }

  function removeInterest(valueToRemove: string) {
    setForm((previous) => ({
      ...previous,
      interests: previous.interests.filter(
        (interest) => interest !== valueToRemove
      ),
    }));
  }

  function addLocation() {
    const value = locationInput.trim();

    if (!value) return;

    if (
      form.preferredLocations.some(
        (location) => location.toLowerCase() === value.toLowerCase()
      )
    ) {
      return;
    }

    setForm((previous) => ({
      ...previous,
      preferredLocations: [...previous.preferredLocations, value],
    }));

    setLocationInput("");
  }

  function removeLocation(valueToRemove: string) {
    setForm((previous) => ({
      ...previous,
      preferredLocations: previous.preferredLocations.filter(
        (location) => location !== valueToRemove
      ),
    }));
  }

  function toggleEventType(eventType: string) {
    setForm((previous) => {
      const exists = previous.preferredEventTypes.includes(eventType);

      return {
        ...previous,
        preferredEventTypes: exists
          ? previous.preferredEventTypes.filter((item) => item !== eventType)
          : [...previous.preferredEventTypes, eventType],
      };
    });
  }

  function validateForm(): string | null {
    if (!form.name.trim()) return "Name is required.";

    if (!form.email.trim()) return "Email is required.";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return "Please enter a valid email address.";
    }

    if (!form.password) return "Password is required.";

    if (form.password.length < 8) {
      return "Password must be at least 8 characters.";
    }

    if (!form.college.trim()) return "College is required.";

    if (!form.degree.trim()) return "Degree is required.";

    if (!form.department.trim()) return "Department is required.";

    if (form.studyYear < 1 || form.studyYear > 6) {
      return "Study year must be between 1 and 6.";
    }

    if (form.skills.length === 0) {
      return "Please add at least one skill.";
    }

    if (form.interests.length === 0) {
      return "Please add at least one interest.";
    }

    if (form.preferredLocations.length === 0) {
      return "Please add at least one preferred location.";
    }

    if (form.preferredEventTypes.length === 0) {
      return "Please select at least one preferred event type.";
    }

    if (!form.teamAvailability) {
      return "Please select your team availability.";
    }

    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);

      await registerStudent(form);

      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (registrationError) {
      if (
        registrationError instanceof Error &&
        registrationError.message === "EMAIL_ALREADY_REGISTERED"
      ) {
        setError("Email already registered.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-400">
            ACE Discover AI
          </p>

          <h1 className="text-4xl font-bold">
            Create your student profile
          </h1>

          <p className="mt-3 text-slate-400">
            Tell us about yourself so ACE can find opportunities that fit you.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl md:p-8"
        >
          {/* Basic Information */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">
              1. Basic Information
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Full Name *
                </label>

                <input
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-cyan-400"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email *
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-cyan-400"
                  placeholder="you@example.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Password *
                </label>

                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-cyan-400"
                  placeholder="Minimum 8 characters"
                />
              </div>
            </div>
          </section>

          {/* Academic Information */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">
              2. Academic Information
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  College *
                </label>

                <input
                  value={form.college}
                  onChange={(e) => updateField("college", e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-cyan-400"
                  placeholder="Your college"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Degree *
                </label>

                <input
                  value={form.degree}
                  onChange={(e) => updateField("degree", e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-cyan-400"
                  placeholder="e.g. B.Tech"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Department *
                </label>

                <input
                  value={form.department}
                  onChange={(e) => updateField("department", e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-cyan-400"
                  placeholder="e.g. AI and Data Science"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Study Year *
                </label>

                <select
                  value={form.studyYear}
                  onChange={(e) =>
                    updateField("studyYear", Number(e.target.value))
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-cyan-400"
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                  <option value={5}>5th Year</option>
                  <option value={6}>6th Year</option>
                </select>
              </div>
            </div>
          </section>

          {/* Skills */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">
              3. Skills *
            </h2>

            <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
              <input
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-cyan-400"
                placeholder="e.g. Python"
              />

              <select
                value={skillLevel}
                onChange={(e) =>
                  setSkillLevel(e.target.value as SkillLevel)
                }
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-cyan-400"
              >
                {skillLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={addSkill}
                className="rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
              >
                Add Skill
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {form.skills.map((skill) => (
                <button
                  key={skill.name}
                  type="button"
                  onClick={() => removeSkill(skill.name)}
                  className="rounded-full bg-slate-800 px-4 py-2 text-sm"
                >
                  {skill.name} · {skill.level} ×
                </button>
              ))}
            </div>
          </section>

          {/* Interests */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">
              4. Interests *
            </h2>

            <div className="flex gap-3">
              <input
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-cyan-400"
                placeholder="e.g. Artificial Intelligence"
              />

              <button
                type="button"
                onClick={addInterest}
                className="rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
              >
                Add
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {form.interests.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => removeInterest(interest)}
                  className="rounded-full bg-slate-800 px-4 py-2 text-sm"
                >
                  {interest} ×
                </button>
              ))}
            </div>
          </section>

          {/* Locations */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">
              5. Preferred Locations *
            </h2>

            <div className="flex gap-3">
              <input
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-cyan-400"
                placeholder="e.g. Chennai or Online"
              />

              <button
                type="button"
                onClick={addLocation}
                className="rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400"
              >
                Add
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {form.preferredLocations.map((location) => (
                <button
                  key={location}
                  type="button"
                  onClick={() => removeLocation(location)}
                  className="rounded-full bg-slate-800 px-4 py-2 text-sm"
                >
                  {location} ×
                </button>
              ))}
            </div>
          </section>

          {/* Event Types */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">
              6. Preferred Event Types *
            </h2>

            <div className="flex flex-wrap gap-3">
              {eventTypes.map((eventType) => {
                const selected =
                  form.preferredEventTypes.includes(eventType);

                return (
                  <button
                    key={eventType}
                    type="button"
                    onClick={() => toggleEventType(eventType)}
                    className={`rounded-full border px-4 py-2 text-sm ${
                      selected
                        ? "border-cyan-400 bg-cyan-400 text-slate-950"
                        : "border-slate-700 bg-slate-800"
                    }`}
                  >
                    {eventType}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Team Availability */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">
              7. Team Availability *
            </h2>

            <select
              value={form.teamAvailability}
              onChange={(e) =>
                updateField("teamAvailability", e.target.value)
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-cyan-400"
            >
              <option value="Individual">Individual</option>
              <option value="Looking for a team">Looking for a team</option>
              <option value="Has a team">Has a team</option>
            </select>
          </section>

          {/* Messages */}
          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-green-500/40 bg-green-500/10 p-4 text-sm text-green-300">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-cyan-500 px-6 py-4 text-lg font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="font-semibold text-cyan-400 hover:underline"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </main>
  );
}