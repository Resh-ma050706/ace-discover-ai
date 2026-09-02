export async function searchOpportunities(query: string) {
  const response = await fetch("http://localhost:5000/api/events");

  if (!response.ok) {
    throw new Error("Failed to fetch events from backend");
  }

  const data = await response.json();
  const events = data.events || [];

  const searchText = query.trim().toLowerCase();

  // --------------------------------------------------
  // 1. DETECT EVENT TYPE
  // --------------------------------------------------

  let detectedEventType = "";

  if (
    searchText.includes("hackathon") ||
    searchText.includes("hack")
  ) {
    detectedEventType = "Hackathon";
  } else if (
    searchText.includes("workshop") ||
    searchText.includes("training")
  ) {
    detectedEventType = "Workshop";
  } else if (searchText.includes("symposium")) {
    detectedEventType = "Technical Symposium";
  } else if (
    searchText.includes("conference") ||
    searchText.includes("convention")
  ) {
    detectedEventType = "Conference";
  } else if (
    searchText.includes("competition") ||
    searchText.includes("contest")
  ) {
    detectedEventType = "Competition";
  } else if (searchText.includes("internship")) {
    detectedEventType = "Internship";
  }

  // --------------------------------------------------
  // 2. DETECT LOCATION
  // --------------------------------------------------

  const knownLocations = [
    ...new Set(
      events
        .map((event: any) => event.location)
        .filter(Boolean)
    ),
  ];

  let detectedLocation = "";

  for (const location of knownLocations) {
    const locationText = String(location).toLowerCase();

    if (searchText.includes(locationText)) {
      detectedLocation = String(location);
      break;
    }
  }

  if (!detectedLocation) {
    const commonLocations = [
      "coimbatore",
      "chennai",
      "bangalore",
      "bengaluru",
      "hyderabad",
      "mumbai",
      "delhi",
      "pune",
      "salem",
      "erode",
      "tiruppur",
    ];

    const matchedLocation = commonLocations.find((location) =>
      searchText.includes(location)
    );

    if (matchedLocation) {
      detectedLocation =
        matchedLocation.charAt(0).toUpperCase() +
        matchedLocation.slice(1);
    }
  }

  // --------------------------------------------------
  // 3. DETECT DOMAIN
  // --------------------------------------------------

  let detectedDomain = "";

  const domainKeywords: Record<string, string> = {
    "artificial intelligence": "Artificial Intelligence",
    ai: "Artificial Intelligence",

    "machine learning": "Machine Learning",
    ml: "Machine Learning",

    "web development": "Web Development",
    web: "Web Development",

    cybersecurity: "Cybersecurity",
    cyber: "Cybersecurity",

    "software development": "Software Development",
    software: "Software Development",

    "data science": "Data Science",
    data: "Data Science",

    "cloud computing": "Cloud Computing",
    cloud: "Cloud Computing",

    "app development": "App Development",
    mobile: "App Development",

    robotics: "Robotics",
    iot: "IoT",
    "internet of things": "IoT",
  };

  const domainKeywordsSorted = Object.keys(domainKeywords).sort(
    (a, b) => b.length - a.length
  );

  for (const keyword of domainKeywordsSorted) {
    if (searchText.includes(keyword)) {
      detectedDomain = domainKeywords[keyword];
      break;
    }
  }

  // --------------------------------------------------
  // 4. DETECT STUDENT TYPE
  // --------------------------------------------------

  let detectedStudentType = "All Students";

  if (
    searchText.includes("engineering students") ||
    searchText.includes("engineering student") ||
    searchText.includes("engineering") ||
    searchText.includes("b.e") ||
    searchText.includes("b.tech") ||
    searchText.includes("be student") ||
    searchText.includes("btech student")
  ) {
    detectedStudentType = "Engineering Students";
  }

  // --------------------------------------------------
  // 5. DETECT TIME RANGE
  // --------------------------------------------------

  let detectedTimeRange = "Upcoming";

  if (searchText.includes("today")) {
    detectedTimeRange = "Today";
  } else if (searchText.includes("this week")) {
    detectedTimeRange = "This Week";
  } else if (searchText.includes("next week")) {
    detectedTimeRange = "Next Week";
  } else if (searchText.includes("this month")) {
    detectedTimeRange = "This Month";
  } else if (searchText.includes("next month")) {
    detectedTimeRange = "Next Month";
  }

  // --------------------------------------------------
  // 6. QUERY WORDS
  // --------------------------------------------------

  const queryWords = searchText
    .split(/\s+/)
    .map((word) => word.replace(/[^\w\.-]/g, ""))
    .filter((word) => word.length > 2);

  // --------------------------------------------------
  // 7. HELPER FUNCTIONS
  // --------------------------------------------------

  function getDomainText(event: any): string {
    return (event.domains || [])
      .map((domain: any) => {
        if (typeof domain === "string") {
          return domain;
        }

        return domain?.name || "";
      })
      .join(" ")
      .toLowerCase();
  }

  function getSkillsText(event: any): string {
    return (event.requiredSkills || [])
      .map((skill: any) => {
        if (typeof skill === "string") {
          return skill;
        }

        return skill?.name || "";
      })
      .join(" ")
      .toLowerCase();
  }

  function getSearchableText(event: any): string {
    return [
      event.title,
      event.description,
      event.eventType,
      event.location,
      event.mode,
      event.venue,
      event.organizer,
      getDomainText(event),
      getSkillsText(event),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  }

  // --------------------------------------------------
  // 8. FILTER + SCORE
  // --------------------------------------------------

  const scoredEvents = events
    .map((event: any) => {
      const title = String(event.title || "").toLowerCase();

      const description = String(
        event.description || ""
      ).toLowerCase();

      const eventType = String(
        event.eventType || ""
      ).toLowerCase();

      const location = String(
        event.location || ""
      ).toLowerCase();

      const domainText = getDomainText(event);
      const skillsText = getSkillsText(event);
      const searchableText = getSearchableText(event);

      let score = 0;

      // ------------------------------------------------
      // EVENT TYPE MATCH
      // ------------------------------------------------

      if (detectedEventType) {
        const requestedType =
          detectedEventType.toLowerCase();

        if (!eventType.includes(requestedType)) {
          return null;
        }

        score += 50;
      }

      // ------------------------------------------------
      // LOCATION MATCH
      // ------------------------------------------------

      if (detectedLocation) {
        const requestedLocation =
          detectedLocation.toLowerCase();

        if (!location.includes(requestedLocation)) {
          return null;
        }

        score += 50;
      }

      // ------------------------------------------------
      // DOMAIN MATCH
      // ------------------------------------------------

      if (detectedDomain) {
        const requestedDomain =
          detectedDomain.toLowerCase();

        const domainMatched =
          domainText.includes(requestedDomain) ||
          searchableText.includes(requestedDomain);

        if (!domainMatched) {
          return null;
        }

        score += 50;
      }

      // ------------------------------------------------
      // TITLE MATCH
      // ------------------------------------------------

      if (
        searchText.length > 0 &&
        title.includes(searchText)
      ) {
        score += 100;
      }

      // ------------------------------------------------
      // QUERY WORD MATCHING
      // ------------------------------------------------

      for (const word of queryWords) {
        if (title.includes(word)) {
          score += 20;
        } else if (eventType.includes(word)) {
          score += 15;
        } else if (location.includes(word)) {
          score += 15;
        } else if (domainText.includes(word)) {
          score += 15;
        } else if (skillsText.includes(word)) {
          score += 10;
        } else if (description.includes(word)) {
          score += 5;
        }
      }

      // ------------------------------------------------
      // STUDENT MATCH
      // ------------------------------------------------

      if (
        detectedStudentType ===
        "Engineering Students"
      ) {
        const eligibleDegrees = (
          event.eligibleDegrees || []
        )
          .join(" ")
          .toLowerCase();

        const eligibleDepartments = (
          event.eligibleDepartments || []
        )
          .join(" ")
          .toLowerCase();

        if (
          eligibleDegrees.includes("b.tech") ||
          eligibleDegrees.includes("b.e") ||
          eligibleDepartments.includes("engineering") ||
          eligibleDepartments.includes("computer") ||
          eligibleDepartments.includes("ai")
        ) {
          score += 20;
        }
      }

      // ------------------------------------------------
      // POSSIBILITY SCORE
      // ------------------------------------------------
      //
      // Convert the internal relevance score into
      // a clean 0-100 Possibility Score.
      //
      const matchPercentage = Math.min(
        Math.round((score / 200) * 100),
        100
      );

      return {
        ...event,
        matchPercentage,
      };
    })
    .filter(Boolean);

  // --------------------------------------------------
  // 9. SORT BY POSSIBILITY SCORE
  // --------------------------------------------------

  scoredEvents.sort(
    (a: any, b: any) =>
      b.matchPercentage - a.matchPercentage
  );

  // --------------------------------------------------
  // 10. RETURN SEARCH RESULT
  // --------------------------------------------------

  return {
    query,

    interpretedQuery: {
      domain:
        detectedDomain || "All",

      eventType:
        detectedEventType ||
        "All Opportunities",

      location:
        detectedLocation ||
        "All Locations",

      timeRange:
        detectedTimeRange,

      studentType:
        detectedStudentType,
    },

    results: scoredEvents,
  };
}