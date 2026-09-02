const pool = require("../config/database");
const { searchEvents } = require("../../dist/services/search/index");

async function search(req, res) {
  try {
    const query =
      typeof req.body.query === "string" ? req.body.query.trim() : "";

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const profileResult = await pool.query(
      `
        SELECT
          u.name,
          u.email,
          p.college,
          p.degree,
          p.department,
          p.study_year,
          p.skills,
          p.interests,
          p.preferred_locations,
          p.preferred_event_types,
          p.team_availability
        FROM users u
        LEFT JOIN student_profiles p ON p.user_id = u.id
        WHERE u.id = $1
      `,
      [req.user.userId],
    );

    if (profileResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    const row = profileResult.rows[0];

    const skills = Array.isArray(row.skills)
      ? row.skills
          .map((skill) => (typeof skill === "string" ? skill : skill.name))
          .filter(Boolean)
      : [];

    const student = {
      name: row.name || "",
      email: row.email || "",
      college: row.college || "",
      degree: row.degree || "",
      department: row.department || "",
      year: Number(row.study_year || 0),
      skills,
      interests: Array.isArray(row.interests) ? row.interests : [],
      preferredLocation: Array.isArray(row.preferred_locations)
        ? row.preferred_locations[0]
        : undefined,
      preferredEventTypes: Array.isArray(row.preferred_event_types)
        ? row.preferred_event_types
        : [],
      teamAvailability:
        row.team_availability &&
        row.team_availability.toLowerCase() !== "individual",
    };

    const eventsResult = await pool.query(
      `
        SELECT
          id,
          title,
          description,
          event_type,
          domains,
          location,
          mode,
          venue,
          event_start_date,
          event_end_date,
          registration_deadline,
          eligible_degrees,
          eligible_departments,
          eligible_years,
          required_skills,
          minimum_team_size,
          maximum_team_size,
          fee,
          organizer,
          verified,
          status,
          source_url,
          last_synced_at,
          demo_enriched
        FROM events
        WHERE UPPER(status) = 'ACTIVE'
        ORDER BY registration_deadline ASC
      `,
    );

    const events = eventsResult.rows.map((event) => ({
      id: String(event.id),
      title: event.title,
      description: event.description,
      eventType: event.event_type,
      domains: event.domains || [],
      location: event.location,
      mode: event.mode,
      venue: event.venue,
      eventStartDate: event.event_start_date,
      eventEndDate: event.event_end_date,
      registrationDeadline: event.registration_deadline,
      eligibleDegrees: event.eligible_degrees || [],
      eligibleDepartments: event.eligible_departments || [],
      eligibleYears: event.eligible_years || [],
      requiredSkills: event.required_skills || [],
      minimumTeamSize: event.minimum_team_size,
      maximumTeamSize: event.maximum_team_size,
      fee: Number(event.fee || 0),
      organizer: event.organizer,
      verified: event.verified,
      status: event.status,
      sourceUrl: event.source_url,
      lastSyncedAt: event.last_synced_at,
      demoEnriched: event.demo_enriched,
    }));

    const searchResponse = searchEvents(query, student, events);

    return res.status(200).json({
      success: true,
      ...searchResponse,
    });
  } catch (error) {
    console.error("Search error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to search events",
      error: error.message,
    });
  }
}

module.exports = { search };
