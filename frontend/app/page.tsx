"use client";

import { useState } from "react";
import ResultCard from "../components/ResultCard";
import { searchOpportunities } from "../api/searchService";

export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchData, setSearchData] = useState<any>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setSearched(false);

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

                {/* DOMAIN */}
                <div className="rounded-xl bg-purple-50 p-4">
                  <p className="text-sm text-gray-500">
                    Domain
                  </p>

                  <p className="mt-1 font-semibold text-purple-700">
                    {searchData.interpretedQuery?.domain}
                  </p>
                </div>

                {/* EVENT TYPE */}
                <div className="rounded-xl bg-blue-50 p-4">
                  <p className="text-sm text-gray-500">
                    Event Type
                  </p>

                  <p className="mt-1 font-semibold text-blue-700">
                    {searchData.interpretedQuery?.eventType}
                  </p>
                </div>

                {/* LOCATION */}
                <div className="rounded-xl bg-green-50 p-4">
                  <p className="text-sm text-gray-500">
                    Location
                  </p>

                  <p className="mt-1 font-semibold text-green-700">
                    {searchData.interpretedQuery?.location}
                  </p>
                </div>

                {/* TIME */}
                <div className="rounded-xl bg-orange-50 p-4">
                  <p className="text-sm text-gray-500">
                    Time
                  </p>

                  <p className="mt-1 font-semibold text-orange-700">
                    {searchData.interpretedQuery?.timeRange}
                  </p>
                </div>

                {/* STUDENT TYPE */}
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

            {/* RECOMMENDED OPPORTUNITIES */}
            <div className="mt-10">

              <h3 className="mb-5 text-2xl font-bold text-gray-900">
                🎯 Recommended Opportunities
              </h3>

              <div className="grid gap-6">

                {searchData.results?.map((event: any) => (
                  <ResultCard
                    key={event.id}
                    event={event}
                  />
                ))}

              </div>

            </div>

          </div>
        )}

      </section>

    </main>
  );
}