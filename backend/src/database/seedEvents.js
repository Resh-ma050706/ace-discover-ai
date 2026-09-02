const fs = require("fs");
const path = require("path");
const pool = require("../config/database");

async function seedEvents() {
  const filePath = path.join(__dirname, "..", "data", "events.seed.json");

  const fileContent = fs.readFileSync(filePath, "utf8");
  const events = JSON.parse(fileContent);

  let insertedOrUpdated = 0;

  try {
    console.log(`Processing ${events.length} event records...`);

    for (const event of events) {
      const query = `
        INSERT INTO events (
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
        )
        VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11, $12,
          $13, $14, $15, $16, $17, $18,
          $19, $20, $21, $22, $23, $24
        )
        ON CONFLICT (id)
        DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          event_type = EXCLUDED.event_type,
          domains = EXCLUDED.domains,
          location = EXCLUDED.location,
          mode = EXCLUDED.mode,
          venue = EXCLUDED.venue,
          event_start_date = EXCLUDED.event_start_date,
          event_end_date = EXCLUDED.event_end_date,
          registration_deadline = EXCLUDED.registration_deadline,
          eligible_degrees = EXCLUDED.eligible_degrees,
          eligible_departments = EXCLUDED.eligible_departments,
          eligible_years = EXCLUDED.eligible_years,
          required_skills = EXCLUDED.required_skills,
          minimum_team_size = EXCLUDED.minimum_team_size,
          maximum_team_size = EXCLUDED.maximum_team_size,
          fee = EXCLUDED.fee,
          organizer = EXCLUDED.organizer,
          verified = EXCLUDED.verified,
          status = EXCLUDED.status,
          source_url = EXCLUDED.source_url,
          last_synced_at = EXCLUDED.last_synced_at,
          demo_enriched = EXCLUDED.demo_enriched
        RETURNING id, title;
      `;

      const values = [
        event.id,
        event.title,
        event.description,
        event.eventType,
        JSON.stringify(event.domains),
        event.location,
        event.mode,
        event.venue,
        event.eventStartDate,
        event.eventEndDate,
        event.registrationDeadline,
        JSON.stringify(event.eligibleDegrees),
        JSON.stringify(event.eligibleDepartments),
        JSON.stringify(event.eligibleYears),
        JSON.stringify(event.requiredSkills),
        event.minimumTeamSize,
        event.maximumTeamSize,
        event.fee,
        event.organizer,
        event.verified,
        event.status,
        event.sourceUrl,
        event.lastSyncedAt,
        event.demoEnriched,
      ];

      const result = await pool.query(query, values);

      console.log(`Processed: ${result.rows[0].id} - ${result.rows[0].title}`);

      insertedOrUpdated += 1;
    }

    console.log(
      `Event seeding completed: ${insertedOrUpdated} records processed`,
    );
  } catch (error) {
    console.error("Event seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seedEvents();
