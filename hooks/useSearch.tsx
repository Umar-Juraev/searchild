import { useState, useCallback } from 'react';

export type SearchItem = {
  kind: string;
  title: string;
  htmlTitle: string;
  link: string;
  displayLink: string;
  snippet: string;
  htmlSnippet: string;
  formattedUrl: string;
  htmlFormattedUrl: string;
};

export type SearchInformation = {
  searchTime: number;
  formattedSearchTime: string;
  totalResults: string;
  formattedTotalResults: string;
};

export type SearchData = {
  searchInformation: SearchInformation;
  items: SearchItem[];
};

interface SearchResults {
  data: SearchData;
}

interface UseSearchResult {
  results: SearchItem[] | null;
  isLoading: boolean;
  error: Error | null;
  searchInfo: SearchInformation | null;
  search: (query: string) => Promise<void>;
}

export function useSearch(debounceMs = 500): UseSearchResult {
  const [results, setResults] = useState<SearchItem[] | null>(null);
  const [searchInfo, setSearchInfo] = useState<SearchInformation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Define the search function - now returns a promise to allow for better control
  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults(null);
      setSearchInfo(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=AIzaSyAvCPFewUgkbMqp7vA_FSelp5L-idicOHk&cx=32071f664483543e0&q=${encodeURIComponent(
          query
        )}`
      );

      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`);
      }

      const data: SearchResults = await response.json();
      setResults(data.data.items || []);
      setSearchInfo(data.data.searchInformation);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setResults(null);
      setSearchInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { results, isLoading, error, searchInfo, search };
}