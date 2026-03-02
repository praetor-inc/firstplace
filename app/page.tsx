'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { SEED_LISTINGS, filterListings } from '@/lib/data';
import { Listing } from '@/lib/types';
import ListingCard from '@/components/ListingCard/ListingCard';
import FiltersPanel from '@/components/FiltersPanel/FiltersPanel';
import styles from './page.module.css';

const MapView = dynamic(() => import('@/components/MapView/MapView'), { ssr: false });

const DEFAULT_FILTERS = {
  maxPrice: 700,
  propertyType: [] as string[],
  furnished: null as boolean | null,
  petFriendly: null as boolean | null,
  billsIncluded: null as boolean | null,
  searchQuery: '',
};

export default function HomePage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<'split' | 'list' | 'map'>('split');
  const [searchInput, setSearchInput] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  const listings = useMemo(() => filterListings(SEED_LISTINGS, filters), [filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(f => ({ ...f, searchQuery: searchInput }));
  };

  const clearSearch = () => {
    setSearchInput('');
    setFilters(f => ({ ...f, searchQuery: '' }));
  };

  const handleSelectListing = (id: string) => {
    setSelectedId(id);
    // Scroll the selected card into view in list panel
    setTimeout(() => {
      const el = document.getElementById(`card-${id}`);
      if (el && listRef.current) {
        listRef.current.scrollTo({ top: el.offsetTop - 20, behavior: 'smooth' });
      }
    }, 100);
  };

  const selectedListing = listings.find(l => l.id === selectedId) ?? null;

  useEffect(() => {
    if (listings.length > 0 && !listings.find(l => l.id === selectedId)) {
      setSelectedId(listings[0].id);
    }
  }, [listings, selectedId]);

  return (
    <div className={styles.app}>
      {/* ─── HEADER ─── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>
            <span className={styles.logoMark}>FP</span>
            <span className={styles.logoText}>FirstPlace</span>
          </div>
          <span className={styles.logoTagline}>Your first apartment, simplified.</span>
        </div>

        <form className={styles.searchForm} onSubmit={handleSearch} role="search">
          <div className={styles.searchInputWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Search suburb, uni, or address..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              aria-label="Search for a suburb, university, or address"
              id="main-search"
            />
            {searchInput && (
              <button type="button" className={styles.clearBtn} onClick={clearSearch} aria-label="Clear search">✕</button>
            )}
          </div>
          <button type="submit" className={`${styles.searchBtn} btn btn-primary`}>Search</button>
        </form>

        <div className={styles.headerRight}>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewBtn} ${view === 'split' ? styles.viewBtnActive : ''}`}
              onClick={() => setView('split')}
              aria-label="Split view"
              title="Split view"
            >⬛⬜</button>
            <button
              className={`${styles.viewBtn} ${view === 'list' ? styles.viewBtnActive : ''}`}
              onClick={() => setView('list')}
              aria-label="List view"
              title="List view"
            >☰</button>
            <button
              className={`${styles.viewBtn} ${view === 'map' ? styles.viewBtnActive : ''}`}
              onClick={() => setView('map')}
              aria-label="Map view"
              title="Map view"
            >🗺</button>
          </div>
        </div>
      </header>

      {/* ─── HERO STRIP ─── */}
      <div className={styles.heroBanner}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            FIND YOUR<br />
            <span className={styles.heroHighlight}>FIRST PLACE.</span>
          </h1>
          <p className={styles.heroSub}>
            AI-powered apartment finder for students & school graduates.<br />
            Real listings. Real scores. Real talk.
          </p>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>{SEED_LISTINGS.length}</span>
            <span className={styles.heroStatLabel}>Listings</span>
          </div>
          <div className={styles.heroStatDivider} />
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>AI</span>
            <span className={styles.heroStatLabel}>Scored</span>
          </div>
          <div className={styles.heroStatDivider} />
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>Free</span>
            <span className={styles.heroStatLabel}>Always</span>
          </div>
        </div>
        <button
          className={`${styles.filterToggleBtn} btn btn-secondary btn-sm`}
          onClick={() => setShowFilters(f => !f)}
          aria-expanded={showFilters}
          aria-controls="filters-panel"
        >
          {showFilters ? '✕ Hide Filters' : '⚙ Filters'}
        </button>
      </div>

      {/* ─── MAIN LAYOUT ─── */}
      <main className={`${styles.main} ${view === 'list' ? styles.mainList : view === 'map' ? styles.mainMap : styles.mainSplit}`}>
        {/* Filters panel */}
        <div
          id="filters-panel"
          className={`${styles.filtersPanel} ${showFilters ? styles.filtersPanelOpen : ''}`}
        >
          <FiltersPanel
            filters={filters}
            onChange={setFilters}
            resultCount={listings.length}
          />
        </div>

        {/* Listings panel */}
        {view !== 'map' && (
          <div className={styles.listingsPanel} ref={listRef}>
            {/* Results header */}
            <div className={styles.resultsHeader}>
              <span className={styles.resultsCount}>
                <strong>{listings.length}</strong> {listings.length === 1 ? 'place' : 'places'} found
              </span>
              {filters.searchQuery && (
                <span className={styles.searchingFor}>
                  for &ldquo;{filters.searchQuery}&rdquo;
                  <button className={styles.clearSearchBtn} onClick={clearSearch}>✕ clear</button>
                </span>
              )}
            </div>

            {/* Cards */}
            {listings.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyEmoji}>🏠</span>
                <h3>No places found</h3>
                <p>Try adjusting your filters or search query.</p>
                <button className="btn btn-primary" onClick={() => { setFilters(DEFAULT_FILTERS); setSearchInput(''); }}>
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className={`${styles.cardGrid} ${view === 'split' ? styles.cardGridSplit : styles.cardGridFull}`}>
                {listings.map(listing => (
                  <div key={listing.id} id={`card-${listing.id}`}>
                    <ListingCard
                      listing={listing}
                      isSelected={selectedId === listing.id}
                      onClick={() => handleSelectListing(listing.id)}
                      compact={view === 'split'}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Map panel */}
        {view !== 'list' && (
          <div className={styles.mapPanel}>
            <MapView
              listings={listings}
              selectedId={selectedId}
              onSelectListing={handleSelectListing}
            />

            {/* Selected listing tooltip on map */}
            {selectedListing && view === 'map' && (
              <div className={styles.mapSelectedCard}>
                <div className={styles.mapCardImg}>
                  <img src={selectedListing.images[0]} alt={selectedListing.title} />
                </div>
                <div className={styles.mapCardInfo}>
                  <p className={styles.mapCardPrice}>${selectedListing.pricePerWeek}/wk</p>
                  <p className={styles.mapCardTitle}>{selectedListing.title}</p>
                  <p className={styles.mapCardAddress}>{selectedListing.suburb}, {selectedListing.state}</p>
                  <div className={`score-${selectedListing.aiScore >= 8 ? 'high' : selectedListing.aiScore >= 6 ? 'mid' : 'low'} ${styles.mapCardScore}`}>
                    ✦ {selectedListing.aiScore.toFixed(1)} / 10
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ─── FOOTER ─── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLogo}>
            <span className={styles.logoMark} style={{ fontSize: '0.9rem', padding: '4px 8px' }}>FP</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>FirstPlace</span>
          </div>
          <p className={styles.footerText}>
            Helping students find their first home. AI-powered. Always free.
          </p>
          <p className={styles.footerDisclaimer}>
            Listing data is for demonstration purposes. Always verify details with the agent/landlord before signing any lease.
          </p>
        </div>
      </footer>
    </div>
  );
}
