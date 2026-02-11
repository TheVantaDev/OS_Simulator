/**
 * Simple Search Engine - Google-like search engine
 * Displays search results with simulated response time
 */

import { useMemo } from 'react';
import { WebsiteProps } from '../types';
import { Search, Globe, Lock, AlertTriangle } from 'lucide-react';
import { searchWebsites } from '../registry';

export function SearchEngine({ onNavigate, params }: WebsiteProps) {
  const query = params?.q || '';

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return searchWebsites(query);
  }, [query]);

  const responseTime = useMemo(() => {
    const hash = query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 9) + 1;
  }, [query]);

  // Get security icon
  const getSecurityIcon = (security: string) => {
    switch (security) {
      case 'secure':
        return <Lock className="w-3 h-3 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-3 h-3 text-yellow-600" />;
      case 'insecure':
      case 'phishing':
        return <AlertTriangle className="w-3 h-3 text-red-600" />;
      default:
        return <Globe className="w-3 h-3 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-full bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-6">
          <div
            onClick={() => onNavigate?.('search://home')}
            className="text-2xl font-bold cursor-pointer"
          >
            <span className="text-blue-600">S</span>
            <span className="text-red-600">e</span>
            <span className="text-yellow-500">a</span>
            <span className="text-blue-600">r</span>
            <span className="text-green-600">c</span>
            <span className="text-red-600">h</span>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.target as HTMLFormElement).querySelector('input');
              if (input && input.value.trim()) {
                onNavigate?.(`search://search?q=${encodeURIComponent(input.value)}`);
              }
            }}
            className="flex-1"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                defaultValue={query}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>
        </div>
      </header>

      {/* Results */}
      <main className="max-w-4xl mx-auto px-6 py-6">
        {!query ? (
          /* Home Page - No Query */
          <div className="text-center py-20">
            <div className="text-6xl mb-8">
              <span className="text-blue-600">S</span>
              <span className="text-red-600">e</span>
              <span className="text-yellow-500">a</span>
              <span className="text-blue-600">r</span>
              <span className="text-green-600">c</span>
              <span className="text-red-600">h</span>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = (e.target as HTMLFormElement).querySelector('input');
                if (input && (input as HTMLInputElement).value.trim()) {
                  onNavigate?.(`search://search?q=${encodeURIComponent((input as HTMLInputElement).value)}`);
                }
              }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search the web..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full hover:shadow-md focus:shadow-md focus:outline-none transition-shadow"
                />
              </div>
            </form>
          </div>
        ) : query ? (
          <>
            {/* Stats */}
            <div className="text-sm text-gray-600 mb-6">
              About {searchResults.length} results (0.{responseTime} seconds)
            </div>

            {/* Search Results */}
            {searchResults.length > 0 ? (
              <div className="space-y-6">
                {searchResults.map((site) => (
                  <div key={site.id} className="max-w-2xl">
                    <button
                      onClick={() => onNavigate?.(site.domain)}
                      className="text-left block group"
                    >
                      {/* URL */}
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="w-6 h-6 rounded-sm flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: site.color }}
                        >
                          {site.name.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-600">{site.domain}</span>
                        {getSecurityIcon(site.security)}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl text-blue-600 group-hover:underline mb-1">
                        {site.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {site.description}
                      </p>

                      {/* Category Badge */}
                      <div className="mt-2">
                        <span className={`inline-block text-xs px-2 py-1 rounded ${
                          site.category === 'bank' ? 'bg-blue-100 text-blue-700' :
                          site.category === 'university' ? 'bg-purple-100 text-purple-700' :
                          site.category === 'blog' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {site.category}
                        </span>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-medium text-gray-900 mb-2">
                  No results found for "{query}"
                </h2>
                <p className="text-gray-600 mb-4">
                  Try different keywords or check your spelling
                </p>
                <div className="text-sm text-gray-500">
                  <p>Suggestions:</p>
                  <ul className="mt-2 space-y-1">
                    <li>Make sure all words are spelled correctly</li>
                    <li>Try different keywords</li>
                    <li>Try more general keywords</li>
                  </ul>
                </div>
              </div>
            )}
          </>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 bg-gray-50 px-6 py-4">
        <div className="max-w-4xl mx-auto text-xs text-gray-600 text-center space-x-6">
          <button className="hover:underline">About</button>
          <button className="hover:underline">Privacy</button>
          <button className="hover:underline">Terms</button>
          <button className="hover:underline">Settings</button>
        </div>
      </footer>
    </div>
  );
}
