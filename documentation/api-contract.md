# ACE Discover AI - API Contract

## Student Profile

A student profile contains:

- name
- email
- college
- degree
- department
- year
- skills
- interests
- preferredLocation
- preferredEventTypes

## Search Request

The search request contains:

- query
- studentProfile

Example:

{
  "query": "Find AI hackathons for engineering students in Chennai this month",
  "studentProfile": {
    "department": "AI & Data Science",
    "year": 2,
    "preferredLocation": "Chennai"
  }
}

## Event Object

Each event should contain:

- id
- title
- description
- location
- eventType
- eligibility
- registrationDeadline
- registrationLink

## Recommendation Result

Each recommended event should contain:

- matchPercentage
- eligibilityStatus
- matchReasons
- missingRequirements
- suggestedNextAction

## Eligibility Status

Possible values:

- Eligible
- Partially Eligible
- Not Eligible