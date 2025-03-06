"use client"

import { useSearch } from '../../hooks/useSearch';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChangeEvent } from 'react';

export function Search() {
  const [inputValue, setInputValue] = useState('');
  // Set the debounce to 0 as we'll manually trigger searches now
  const { results, isLoading, error, searchInfo, search } = useSearch(0);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    // Don't trigger search automatically anymore
  };

  const handleSearch = () => {
    // Only search if there's input text
    if (inputValue.trim()) {
      search(inputValue);
    }
  };

  // Also allow search to be triggered by pressing Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <input
        placeholder="Type to search..."
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="flex-1"
      />
      <div>
        {error && (
          <div className="px-4 py-3 text-sm text-red-500">
            Error: {error.message}
          </div>
        )}

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center p-4"
            >
            </motion.div>
          )}
        </AnimatePresence>

        {inputValue && !isLoading && results?.length === 0 && !error && (
          <div>No results found. Try a different search.</div>
        )}

        {results && results.length > 0 && (
          <div>
            {searchInfo && (
              <div className="px-4 py-1 text-xs text-gray-500">
                About {searchInfo.formattedTotalResults} results ({searchInfo.formattedSearchTime} seconds)
              </div>
            )}

            <AnimatePresence>
              {results.map((item, index) => (
                <motion.div
                  key={item.link}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div onSelect={() => window.open(item.link, '_blank')}>
                    <div className="flex items-start gap-2">
                      <div className="h-4 w-4 mt-1 flex-shrink-0 text-blue-500" />
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-medium text-blue-600 truncate"
                          dangerouslySetInnerHTML={{ __html: item.htmlTitle }} />
                        <span className="text-xs text-green-700 truncate">{item.displayLink}</span>
                        <span className="text-sm text-gray-600 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: item.htmlSnippet }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <button
          onClick={handleSearch}
          disabled={isLoading || !inputValue.trim()}
          className="ml-2"
        >
          <span className="ml-1">Search</span>
        </button>
      </div>
    </div>
  );
}