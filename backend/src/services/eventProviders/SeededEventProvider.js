const pool = require("../../config/database");

function formatEvent(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    eventType: row.event_type,
    domains: row.domains,
    location: row.location,
    mode: row.mode,
    venue: row.venue,
    eventStartDate: row.event_start_date,
    eventEndDate: row.event_end_date,
    registrationDeadline: row.registration_deadline,
    eligibleDegrees: row.eligible_degrees,
    eligibleDepartments: row.eligible_departments,
    eligibleYears: row.eligible_years,
    requiredSkills: row.required_skills,
    minimumTeamSize: row.minimum_team_size,
    maximumTeamSize: row.maximum_team_size,
    fee: Number(row.fee),
    organizer: row.organizer,
    verified: row.verified,
    status: row.status,
    sourceUrl: row.source_url,
    lastSyncedAt: row.last_synced_at,
    demoEnriched: row.demo_enriched,
  };
}

class SeededEventProvider {
  async getEvents() {
    const result = await pool.query(`
      SELECT *
      FROM events
      WHERE status = 'ACTIVE'
        AND registration_deadline >= CURRENT_DATE
      ORDER BY event_start_date ASC
    `);

    console.log("EVENT ROWS:", result.rows);
return result.rows.map(formatEvent);
  }

  async getEventById(id) {
    const result = await pool.query(
      `
        SELECT *
        FROM events
        WHERE id = $1
      `,
      [id],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return formatEvent(result.rows[0]);
  }
}

module.exports = new SeededEventProvider();
