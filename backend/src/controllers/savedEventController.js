const pool = require("../config/database");

async function saveEvent(req, res) {
  try {
    const userId = req.user.userId;
    const eventId = Number(req.params.id);

    const eventResult = await pool.query(
      "SELECT id, title FROM events WHERE id = $1",
      [eventId],
    );

    if (eventResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    await pool.query(
      `
        INSERT INTO saved_events (user_id, event_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, event_id)
        DO NOTHING
      `,
      [userId, eventId],
    );

    res.status(200).json({
      success: true,
      message: "Event saved successfully",
      event: eventResult.rows[0],
    });
  } catch (error) {
    console.error("Save event error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to save event",
    });
  }
}

async function removeSavedEvent(req, res) {
  try {
    const userId = req.user.userId;
    const eventId = Number(req.params.id);

    const result = await pool.query(
      `
        DELETE FROM saved_events
        WHERE user_id = $1 AND event_id = $2
        RETURNING id
      `,
      [userId, eventId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Saved event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event removed from saved events",
    });
  } catch (error) {
    console.error("Remove saved event error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to remove saved event",
    });
  }
}

async function getSavedEvents(req, res) {
  try {
    const result = await pool.query(
      `
        SELECT
          e.id,
          e.title,
          e.description,
          e.event_type,
          e.domains,
          e.location,
          e.mode,
          e.event_start_date,
          e.registration_deadline,
          e.fee,
          e.verified,
          e.source_url,
          s.created_at AS saved_at
        FROM saved_events s
        JOIN events e ON e.id = s.event_id
        WHERE s.user_id = $1
        ORDER BY s.created_at DESC
      `,
      [req.user.userId],
    );

    const events = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      eventType: row.event_type,
      domains: row.domains,
      location: row.location,
      mode: row.mode,
      eventStartDate: row.event_start_date,
      registrationDeadline: row.registration_deadline,
      fee: Number(row.fee),
      verified: row.verified,
      sourceUrl: row.source_url,
      savedAt: row.saved_at,
    }));

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    console.error("Get saved events error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve saved events",
    });
  }
}

module.exports = {
  saveEvent,
  removeSavedEvent,
  getSavedEvents,
};
