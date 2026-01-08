"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  X, 
  Clock, 
  User, 
  FileText, 
  BarChart3, 
  Settings,
  Zap,
  TrendingUp
} from "lucide-react";

interface SearchResult {
  id: string;
  type: 'patient' | 'report' | 'metric' | 'protocol' | 'alert';
  title: string;
  description: string;
  category: string;
  lastUpdated: Date;
  relevanceScore: number;
}

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  isSearching: boolean;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearSearchHistory: () => void;
  searchFilters: {
    type: ('patient' | 'report' | 'metric' | 'protocol' | 'alert')[];
    dateRange: string;
    category: string[];
  };
  setSearchFilters: (filters: any) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

interface SearchProviderProps {
  children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchFilters, setSearchFilters] = useState<{
    type: ('patient' | 'report' | 'metric' | 'protocol' | 'alert')[];
    dateRange: string;
    category: string[];
  }>({
    type: [],
    dateRange: 'all',
    category: []
  });

  // Mock search data
  const mockSearchData: SearchResult[] = [
    {
      id: '1',
      type: 'patient',
      title: 'Patient Flow Analysis - Emergency Department',
      description: 'Real-time monitoring of emergency department patient flow and wait times',
      category: 'Operations',
      lastUpdated: new Date(),
      relevanceScore: 0.95
    },
    {
      id: '2',
      type: 'report',
      title: 'Monthly Revenue Cycle Performance Report',
      description: 'Comprehensive analysis of revenue collection, denials, and adjustments',
      category: 'Financial',
      lastUpdated: new Date(Date.now() - 86400000),
      relevanceScore: 0.89
    },
    {
      id: '3',
      type: 'metric',
      title: 'Patient Satisfaction Scores - Q4 2024',
      description: 'Quality metrics and patient satisfaction benchmarking data',
      category: 'Quality',
      lastUpdated: new Date(Date.now() - 172800000),
      relevanceScore: 0.87
    },
    {
      id: '4',
      type: 'protocol',
      title: 'Cardiac Catheterization Optimization Protocol',
      description: 'Clinical protocol with cost savings and efficiency improvements',
      category: 'Clinical',
      lastUpdated: new Date(Date.now() - 259200000),
      relevanceScore: 0.85
    },
    {
      id: '5',
      type: 'alert',
      title: 'High Bed Occupancy Alert - ICU',
      description: 'Critical alert for bed occupancy exceeding 90% threshold',
      category: 'Operations',
      lastUpdated: new Date(Date.now() - 3600000),
      relevanceScore: 0.92
    },
    {
      id: '6',
      type: 'report',
      title: 'Predictive Analytics - Revenue Forecast',
      description: 'AI-powered 6-month revenue prediction with confidence intervals',
      category: 'Analytics',
      lastUpdated: new Date(Date.now() - 432000000),
      relevanceScore: 0.88
    }
  ];

  useEffect(() => {
    const savedSearches = localStorage.getItem('medpact-recent-searches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  useEffect(() => {
    if (searchQuery.length > 2) {
      setIsSearching(true);
      
      // Simulate search delay
      const searchTimeout = setTimeout(() => {
        const filtered = mockSearchData.filter(item => {
          const matchesQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              item.category.toLowerCase().includes(searchQuery.toLowerCase());
          
          const matchesType = searchFilters.type.length === 0 || searchFilters.type.includes(item.type);
          const matchesCategory = searchFilters.category.length === 0 || searchFilters.category.includes(item.category);
          
          return matchesQuery && matchesType && matchesCategory;
        }).sort((a, b) => b.relevanceScore - a.relevanceScore);
        
        setSearchResults(filtered);
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(searchTimeout);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery, searchFilters]);

  const addRecentSearch = (query: string) => {
    if (query.trim() && !recentSearches.includes(query.trim())) {
      const newSearches = [query.trim(), ...recentSearches.slice(0, 4)];
      setRecentSearches(newSearches);
      localStorage.setItem('medpact-recent-searches', JSON.stringify(newSearches));
    }
  };

  const clearSearchHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem('medpact-recent-searches');
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchResults,
        isSearching,
        recentSearches,
        addRecentSearch,
        clearSearchHistory,
        searchFilters,
        setSearchFilters
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function AdvancedSearchInterface() {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    recentSearches,
    addRecentSearch,
    clearSearchHistory,
    searchFilters,
    setSearchFilters
  } = useSearch();

  const [showFilters, setShowFilters] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      addRecentSearch(query);
      setShowResults(true);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'patient': return <User className="w-4 h-4" />;
      case 'report': return <FileText className="w-4 h-4" />;
      case 'metric': return <BarChart3 className="w-4 h-4" />;
      case 'protocol': return <Settings className="w-4 h-4" />;
      case 'alert': return <Zap className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'patient': return 'text-blue-600 bg-blue-50';
      case 'report': return 'text-green-600 bg-green-50';
      case 'metric': return 'text-purple-600 bg-purple-50';
      case 'protocol': return 'text-orange-600 bg-orange-50';
      case 'alert': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setShowResults(true)}
            placeholder="Search patients, reports, metrics, protocols..."
            className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-white shadow-sm"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`p-1.5 rounded-lg transition-colors ${
                showFilters ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Filter className="w-4 h-4" />
            </motion.button>
            {searchQuery && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setSearchQuery('');
                  setShowResults(false);
                }}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                  <div className="space-y-2">
                    {['patient', 'report', 'metric', 'protocol', 'alert'].map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={searchFilters.type.includes(type as any)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSearchFilters({
                                ...searchFilters,
                                type: [...searchFilters.type, type as any]
                              });
                            } else {
                              setSearchFilters({
                                ...searchFilters,
                                type: searchFilters.type.filter(t => t !== type)
                              });
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <div className="space-y-2">
                    {['Operations', 'Financial', 'Quality', 'Clinical', 'Analytics'].map((category) => (
                      <label key={category} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={searchFilters.category.includes(category)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSearchFilters({
                                ...searchFilters,
                                category: [...searchFilters.category, category]
                              });
                            } else {
                              setSearchFilters({
                                ...searchFilters,
                                category: searchFilters.category.filter(c => c !== category)
                              });
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <select
                    value={searchFilters.dateRange}
                    onChange={(e) => setSearchFilters({ ...searchFilters, dateRange: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All time</option>
                    <option value="today">Today</option>
                    <option value="week">This week</option>
                    <option value="month">This month</option>
                    <option value="quarter">This quarter</option>
                    <option value="year">This year</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSearchFilters({ type: [], dateRange: 'all', category: [] })}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear all filters
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Results */}
        <AnimatePresence>
          {showResults && (searchQuery.length > 0 || recentSearches.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-40"
            >
              {/* Recent Searches */}
              {searchQuery.length === 0 && recentSearches.length > 0 && (
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-700">Recent Searches</h4>
                    <button
                      onClick={clearSearchHistory}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSearch(search)}
                        className="flex items-center gap-2 w-full text-left p-2 hover:bg-gray-50 rounded-lg"
                      >
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{search}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results */}
              {searchQuery.length > 0 && (
                <div className="p-4">
                  {isSearching ? (
                    <div className="flex items-center justify-center py-8">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"
                      />
                      <span className="ml-3 text-sm text-gray-600">Searching...</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-700">
                          Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                        </h4>
                        <div className="text-xs text-gray-500">
                          Sorted by relevance
                        </div>
                      </div>
                      <div className="space-y-3">
                        {searchResults.map((result, index) => (
                          <motion.div
                            key={result.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ x: 5 }}
                            className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200"
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${getTypeColor(result.type)}`}>
                                {getTypeIcon(result.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h5 className="font-medium text-gray-900 text-sm truncate">
                                    {result.title}
                                  </h5>
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                    {result.category}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {result.description}
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                  <span>Updated {result.lastUpdated.toLocaleDateString()}</span>
                                  <span className="flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    {Math.round(result.relevanceScore * 100)}% match
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">🔍</div>
                      <p className="text-gray-600">No results found for "{searchQuery}"</p>
                      <p className="text-sm text-gray-500 mt-1">Try adjusting your search terms or filters</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click outside to close */}
      {showResults && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
