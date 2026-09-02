"use client";

import { useState } from "react";
import ResultCard from "../components/ResultCard";
import { searchOpportunities } from "../api/searchService";

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchData, setSearchData] = useState<any>(null);

  // -----------------------------
  // FILTER STATES
  // -----------------------------
  const [eventTypeFilter, setEventTypeFilter] = useState("All");
  const [domainFilter, setDomainFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [modeFilter, setModeFilter] = useState("All");

  // -----------------------------
  // SEARCH
  // -----------------------------
  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setSearched(false);

    // Reset filters for every new search
    setEventTypeFilter("All");
    setDomainFilter("All");
    setLocationFilter("All");
    setModeFilter("All");

    try {
      const response = await searchOpportunities(query);

      setSearchData(response);
      setSearched(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // ALL EVENTS FROM SEARCH
  // -----------------------------
  const allResults = searchData?.results || [];

  // -----------------------------
  // FILTER OPTIONS
  // -----------------------------
  const eventTypes = [
    "All",
    ...Array.from(
      new Set(
        allResults
          .map((event: any) => event.eventType)
          .filter(Boolean)
      )
    ),
  ];

  const domains = [
    "All",
    ...Array.from(
      new Set(
        allResults
          .flatMap((event: any) => event.domains || [])
          .filter(Boolean)
      )
    ),
  ];

  const locations = [
    "All",
    ...Array.from(
      new Set(
        allResults
          .map((event: any) => event.location)
          .filter(Boolean)
      )
    ),
  ];

  const modes = [
    "All",
    ...Array.from(
      new Set(
        allResults
          .map((event: any) => event.mode)
          .filter(Boolean)
      )
    ),
  ];

  // -----------------------------
  // APPLY FILTERS
  // -----------------------------
  const filteredResults = allResults.filter((event: any) => {
    const matchesEventType =
      eventTypeFilter === "All" ||
      event.eventType === eventTypeFilter;

    const matchesDomain =
      domainFilter === "All" ||
      (event.domains || []).includes(domainFilter);

    const matchesLocation =
      locationFilter === "All" ||
      event.location === locationFilter;

    const matchesMode =
      modeFilter === "All" ||
      event.mode === modeFilter;

    return (
      matchesEventType &&
      matchesDomain &&
      matchesLocation &&
      matchesMode
    );
  });

  // -----------------------------
  // CLEAR FILTERS
  // -----------------------------
  const clearFilters = () => {
    setEventTypeFilter("All");
    setDomainFilter("All");
    setLocationFilter("All");
    setModeFilter("All");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">

      {/* HEADER */}
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-2xl font-bold text-purple-700">
              ACE Discover AI
            </h1>

            <p className="text-sm text-gray-500">
              Your Personal Opportunity Finder
            </p>
          </div>

          <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700">
            AI Powered
          </span>

        </div>
      </header>

      {/* SEARCH SECTION */}
      <section className="mx-auto max-w-5xl px-6 py-16">

        {/* TITLE */}
        <div className="text-center">

          <div className="mb-4 inline-block rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700">
            🎯 Discover opportunities made for you
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Find Your Next
            <span className="text-purple-600"> Opportunity</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600">
            Search for hackathons, internships, workshops and other
            opportunities using natural language.
          </p>

        </div>

        {/* SEARCH BOX */}
        <div className="mx-auto mt-10 flex max-w-4xl flex-col gap-3 rounded-2xl bg-white p-3 shadow-lg sm:flex-row">

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Find AI hackathons for engineering students in Chennai this month"
            className="flex-1 rounded-xl border border-gray-200 px-5 py-4 text-gray-800 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />

          <button
            onClick={handleSearch}
            disabled={loading}
            className="rounded-xl bg-purple-600 px-8 py-4 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Searching..." : "🔎 Search"}
          </button>

        </div>

        {/* EXAMPLE QUERY */}
        <div className="mx-auto mt-5 max-w-4xl">

          <p className="mb-2 text-sm font-medium text-gray-500">
            Try an example:
          </p>

          <button
            onClick={() =>
              setQuery(
                "Find AI hackathons for engineering students in Chennai this month"
              )
            }
            className="rounded-lg border border-purple-200 bg-white px-4 py-2 text-sm text-purple-700 hover:bg-purple-50"
          >
            AI hackathons in Chennai this month
          </button>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="mx-auto mt-10 max-w-4xl rounded-2xl bg-white p-6 text-center shadow">

            <div className="animate-pulse text-purple-600">
              🤖 AI is understanding your query...
            </div>

          </div>
        )}

        {/* RESULTS */}
        {searched && searchData && !loading && (
          <div className="mx-auto mt-10 max-w-4xl">

            {/* QUERY UNDERSTANDING */}
            <div className="rounded-2xl bg-white p-8 shadow-lg">

              <h3 className="text-xl font-bold text-gray-900">
                🔍 Query Understanding
              </h3>

              <p className="mt-3 rounded-lg bg-gray-50 p-4 text-gray-700">
                <strong>Your query:</strong> {searchData.query}
              </p>

              {/* INTERPRETED QUERY */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

                <div className="rounded-xl bg-purple-50 p-4">
                  <p className="text-sm text-gray-500">
                    Domain
                  </p>

                  <p className="mt-1 font-semibold text-purple-700">
                    {searchData.interpretedQuery?.domain}
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-4">
                  <p className="text-sm text-gray-500">
                    Event Type
                  </p>

                  <p className="mt-1 font-semibold text-blue-700">
                    {searchData.interpretedQuery?.eventType}
                  </p>
                </div>

                <div className="rounded-xl bg-green-50 p-4">
                  <p className="text-sm text-gray-500">
                    Location
                  </p>

                  <p className="mt-1 font-semibold text-green-700">
                    {searchData.interpretedQuery?.location}
                  </p>
                </div>

                <div className="rounded-xl bg-orange-50 p-4">
                  <p className="text-sm text-gray-500">
                    Time
                  </p>

                  <p className="mt-1 font-semibold text-orange-700">
                    {searchData.interpretedQuery?.timeRange}
                  </p>
                </div>

                <div className="rounded-xl bg-pink-50 p-4">
                  <p className="text-sm text-gray-500">
                    Student
                  </p>

                  <p className="mt-1 font-semibold text-pink-700">
                    {searchData.interpretedQuery?.studentType}
                  </p>
                </div>

              </div>

            </div>

            {/* FILTER SECTION */}
            <div className="mt-8 rounded-2xl bg-white p-6 shadow-lg">

              <div className="flex flex-col gap-4">

                <div className="flex items-center justify-between">

                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      🔎 Filters
                    </h3>

                    <p className="text-sm text-gray-500">
                      Refine your search results
                    </p>
                  </div>

                  <button
                    onClick={clearFilters}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Clear Filters
                  </button>

                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                  {/* EVENT TYPE */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Event Type
                    </label>

                    <select
                      value={eventTypeFilter}
                      onChange={(e) =>
                        setEventTypeFilter(e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    >
                      {eventTypes.map((type: any) => (
                        <option key={type} value={type}>
                          {type === "All" ? "All Event Types" : type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* DOMAIN */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Domain
                    </label>

                    <select
                      value={domainFilter}
                      onChange={(e) =>
                        setDomainFilter(e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    >
                      {domains.map((domain: any) => (
                        <option key={domain} value={domain}>
                          {domain === "All" ? "All Domains" : domain}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* LOCATION */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Location
                    </label>

                    <select
                      value={locationFilter}
                      onChange={(e) =>
                        setLocationFilter(e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    >
                      {locations.map((location: any) => (
                        <option key={location} value={location}>
                          {location === "All"
                            ? "All Locations"
                            : location}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* MODE */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Mode
                    </label>

                    <select
                      value={modeFilter}
                      onChange={(e) =>
                        setModeFilter(e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    >
                      {modes.map((mode: any) => (
                        <option key={mode} value={mode}>
                          {mode === "All" ? "All Modes" : mode}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

              </div>

            </div>

            {/* RESULTS COUNT */}
            <div className="mt-8 flex items-center justify-between">

              <h3 className="text-2xl font-bold text-gray-900">
                🎯 Recommended Opportunities
              </h3>

              <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
                {filteredResults.length}{" "}
                {filteredResults.length === 1
                  ? "opportunity"
                  : "opportunities"}
              </span>

            </div>

            {/* FILTERED RESULTS */}
            <div className="mt-5 grid gap-6">

              {filteredResults.length > 0 ? (
                filteredResults.map((event: any) => (
                  <ResultCard
                    key={event.id}
                    event={event}
                  />
                ))
              ) : (
                <div className="rounded-2xl bg-white p-10 text-center shadow-lg">

                  <div className="text-4xl">
                    🔍
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-gray-900">
                    No matching opportunities
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Try changing or clearing your filters.
                  </p>

                  <button
                    onClick={clearFilters}
                    className="mt-5 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
                  >
                    Clear Filters
                  </button>

                </div>
              )}

            </div>

          </div>
        )}

      </section>

    </main>
  );
}