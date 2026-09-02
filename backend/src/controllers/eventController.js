const eventProvider = require("../services/eventProviders/SeededEventProvider");

async function getEvents(req, res) {
  try {
    const events = await eventProvider.getEvents();

    res.status(200).json({
      success: true,
      count: events.length,
      dataSource: "SEEDED_ACE_EVENTS",
      message:
        "Publicly listed ACE events with prototype eligibility enrichment",
      events,
    });
  } catch (error) {
    console.error("Get events error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve events",
    });
  }
}

async function getEventById(req, res) {
  try {
    const eventId = Number(req.params.id);

    if (!Number.isInteger(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    const event = await eventProvider.getEventById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Get event error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve event",
    });
  }
}

module.exports = {
  getEvents,
  getEventById,
};
