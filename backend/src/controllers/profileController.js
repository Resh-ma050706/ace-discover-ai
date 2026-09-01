const pool = require("../config/database");

function formatProfile(row) {
  return {
    userId: row.user_id,
    name: row.name,
    email: row.email,
    college: row.college,
    degree: row.degree,
    department: row.department,
    studyYear: row.study_year,
    skills: row.skills,
    interests: row.interests,
    preferredLocations: row.preferred_locations,
    preferredEventTypes: row.preferred_event_types,
    teamAvailability: row.team_availability,
    updatedAt: row.updated_at,
  };
}

async function getProfile(req, res) {
  try {
    const result = await pool.query(
      `
        SELECT
          u.id AS user_id,
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
          p.team_availability,
          p.updated_at
        FROM users u
        JOIN student_profiles p
          ON p.user_id = u.id
        WHERE u.id = $1
      `,
      [req.user.userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    res.status(200).json({
      success: true,
      profile: formatProfile(result.rows[0]),
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve profile",
    });
  }
}

async function updateProfile(req, res) {
  const {
    name,
    college,
    degree,
    department,
    studyYear,
    skills,
    interests,
    preferredLocations,
    preferredEventTypes,
    teamAvailability,
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `
        UPDATE users
        SET name = COALESCE($1, name)
        WHERE id = $2
      `,
      [name || null, req.user.userId],
    );

    await client.query(
      `
        UPDATE student_profiles
        SET
          college = COALESCE($1, college),
          degree = COALESCE($2, degree),
          department = COALESCE($3, department),
          study_year = COALESCE($4::integer, study_year),
          skills = COALESCE($5::jsonb, skills),
          interests = COALESCE($6::jsonb, interests),
          preferred_locations =
            COALESCE($7::jsonb, preferred_locations),
          preferred_event_types =
            COALESCE($8::jsonb, preferred_event_types),
          team_availability =
            COALESCE($9, team_availability),
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $10
      `,
      [
        college || null,
        degree || null,
        department || null,
        studyYear || null,
        skills === undefined ? null : JSON.stringify(skills),
        interests === undefined ? null : JSON.stringify(interests),
        preferredLocations === undefined
          ? null
          : JSON.stringify(preferredLocations),
        preferredEventTypes === undefined
          ? null
          : JSON.stringify(preferredEventTypes),
        teamAvailability || null,
        req.user.userId,
      ],
    );

    const result = await client.query(
      `
        SELECT
          u.id AS user_id,
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
          p.team_availability,
          p.updated_at
        FROM users u
        JOIN student_profiles p
          ON p.user_id = u.id
        WHERE u.id = $1
      `,
      [req.user.userId],
    );

    await client.query("COMMIT");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: formatProfile(result.rows[0]),
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Update profile error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update profile",
    });
  } finally {
    client.release();
  }
}

module.exports = {
  getProfile,
  updateProfile,
};
