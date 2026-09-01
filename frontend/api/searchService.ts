const USE_MOCK = true;

export async function searchOpportunities(query: string) {
  if (USE_MOCK) {
    const response = await fetch("/mockSearchResponse.json");

    if (!response.ok) {
      throw new Error("Failed to load mock search data");
    }

    const data = await response.json();

    return {
      ...data,
      query,
    };
  }

  throw new Error("Real API is not connected yet");
}