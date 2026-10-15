import React, { useState } from 'react';
import { 
  Search, 
  X, 
  Heart, 
  Star, 
  Filter, 
  ArrowUpDown, 
  Sparkles, 
  RotateCcw,
  Unlock,
  Lock,
  Layers
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { CATEGORIES } from '../data/categories';
import { CategoryId, IntensityLevel, Pack } from '../types/game';
import { HeaderBar } from '../components/HeaderBar';
import { PackDetailModal } from '../components/PackDetailModal';

export const ExploreScreen: React.FC = () => {
  const {
    packs,
    profile,
    toggleFavoritePack,
    setSelectedPackDetailId,
    playSound,
  } = useGame();

  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(['Party', 'Couples', 'Icebreakers']);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [selectedIntensity, setSelectedIntensity] = useState<IntensityLevel | 'all'>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating'>('popular');
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // Filter & sort logic
  const filteredPacks = packs
    .filter(p => {
      // Search
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query ||
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.creator.name.toLowerCase().includes(query);

      // Category
      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;

      // Intensity (matches any sample prompt intensity or broad)
      const matchesIntensity = selectedIntensity === 'all';

      // Price
      const matchesPrice =
        priceFilter === 'all' ||
        (priceFilter === 'free' && !p.isPremium) ||
        (priceFilter === 'paid' && p.isPremium);

      return matchesSearch && matchesCat && matchesIntensity && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return b.reviewsCount - a.reviewsCount;
    });

  const handleSearchSubmit = (text: string) => {
    setSearchQuery(text);
    if (text && !recentSearches.includes(text)) {
      setRecentSearches(prev => [text, ...prev.slice(0, 4)]);
    }
  };

  const handleClearFilters = () => {
    playSound('tap');
    setSelectedCategory('all');
    setSelectedIntensity('all');
    setPriceFilter('all');
    setSortBy('popular');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedIntensity !== 'all' || priceFilter !== 'all' || searchQuery !== '';

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#302044] pb-24 max-w-lg mx-auto">
      <HeaderBar title="Explore & Search" showSoundToggle />

      <div className="px-4 py-3 space-y-4 text-left">
        {/* Search Bar with Clear Button */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#796D87]" />
          <input
            type="text"
            placeholder="Search packs, creators, or themes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-full bg-white border border-[#EAE1F0] text-xs text-[#302044] placeholder-[#796D87]/60 focus:outline-none focus:border-[#753BDB] shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#796D87] hover:text-[#302044]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Recent Searches */}
        {!searchQuery && recentSearches.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
            <span className="text-[11px] font-bold text-[#796D87] shrink-0">Recent:</span>
            {recentSearches.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSearchSubmit(s)}
                className="px-2.5 py-1 rounded-full bg-white border border-[#EAE1F0] text-[#796D87] text-[11px] font-semibold hover:border-[#753BDB] shrink-0"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Filter Pills and Sort Bar */}
        <div className="flex items-center justify-between gap-2">
          {/* Category Chips Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1 pb-1">
            <button
              onClick={() => {
                playSound('tap');
                setSelectedCategory('all');
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#753BDB] text-white shadow-sm'
                  : 'bg-white text-[#796D87] border border-[#EAE1F0]'
              }`}
            >
              All Categories
            </button>
            {Object.values(CATEGORIES).map(cat => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    playSound('tap');
                    setSelectedCategory(cat.id);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#753BDB] text-white shadow-sm'
                      : 'bg-white text-[#796D87] border border-[#EAE1F0]'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={e => {
              playSound('tap');
              setSortBy(e.target.value as 'popular' | 'newest' | 'rating');
            }}
            className="px-3 py-1.5 rounded-full bg-white border border-[#EAE1F0] text-xs font-bold text-[#302044] focus:outline-none shrink-0"
          >
            <option value="popular">Popular</option>
            <option value="newest">Newest</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* Free / Paid Filter Pills */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {(['all', 'free', 'paid'] as const).map(p => (
              <button
                key={p}
                onClick={() => {
                  playSound('tap');
                  setPriceFilter(p);
                }}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize transition-all ${
                  priceFilter === p
                    ? 'bg-[#F2EAFE] text-[#753BDB] border border-[#753BDB]/30'
                    : 'text-[#796D87] hover:text-[#302044]'
                }`}
              >
                {p === 'all' ? 'All Prices' : p}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-[11px] font-bold text-[#F04491] flex items-center gap-1 hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Pack Cards Feed */}
        <div className="space-y-3 pt-1">
          {filteredPacks.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-3xl bg-white border border-[#EAE1F0] shadow-card">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-[#FFD447]" />
              <h5 className="font-heading font-extrabold text-sm text-[#302044] mb-1">
                No matching decks found
              </h5>
              <p className="text-xs text-[#796D87] mb-4">
                Try searching for something else or clearing your filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="py-2 px-4 rounded-full bg-[#753BDB] text-white font-heading font-bold text-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredPacks.map(pack => {
              const isFavorite = profile.favoritePackIds.includes(pack.id);
              const catInfo = CATEGORIES[pack.category] || CATEGORIES.friends;

              return (
                <div
                  key={pack.id}
                  onClick={() => {
                    playSound('tap');
                    setSelectedPackDetailId(pack.id);
                  }}
                  className="rounded-3xl p-4 bg-white border border-[#EAE1F0] hover:border-[#753BDB] cursor-pointer shadow-card transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${pack.coverGradient} flex items-center justify-center text-white text-2xl shrink-0 shadow-sm`}
                      >
                        {pack.coverSticker || '🎉'}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <h4 className="font-heading font-black text-sm text-[#302044]">
                            {pack.title}
                          </h4>
                          {pack.isNew && (
                            <span className="text-[9px] font-black uppercase tracking-wider bg-[#FF7139]/15 text-[#FF7139] px-1.5 py-0.2 rounded">
                              NEW
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-[#796D87]">
                          <span>{catInfo.name}</span>
                          <span>·</span>
                          <span>By {pack.creator.name}</span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5 text-[#FF7139] font-bold">
                            <Star className="w-3 h-3 fill-[#FF7139]" />
                            {pack.rating}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Favorite Heart */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleFavoritePack(pack.id);
                      }}
                      className={`p-2 rounded-full transition-colors ${
                        isFavorite
                          ? 'bg-[#F04491]/15 text-[#F04491]'
                          : 'bg-[#FFF9F5] text-[#796D87] hover:text-[#302044]'
                      }`}
                      aria-label="Toggle favorite"
                    >
                      <Heart className="w-4 h-4" fill={isFavorite ? '#F04491' : 'none'} />
                    </button>
                  </div>

                  <p className="text-xs text-[#796D87] line-clamp-2 leading-relaxed mb-3">
                    {pack.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#EAE1F0] text-[11px]">
                    <div className="flex items-center gap-1">
                      {pack.isUnlocked ? (
                        <span className="flex items-center gap-1 text-[#36B77A] font-bold">
                          <Unlock className="w-3 h-3" /> Unlocked
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[#753BDB] font-bold">
                          <Lock className="w-3 h-3" /> {pack.price || 'Premium'}
                        </span>
                      )}
                    </div>

                    <span className="text-[#753BDB] font-extrabold">
                      View Pack Details →
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <PackDetailModal />
    </div>
  );
};
