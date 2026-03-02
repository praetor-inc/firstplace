'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';

export default function LandingPage() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const [isPulsing, setIsPulsing] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Delay the auto-scroll to the search bar so the user can read the header first
    const timer = setTimeout(() => {
      if (searchInputRef.current) {
        const targetPosition = searchInputRef.current.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2.5;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        const duration = 2000; // Slower, absolutely consistent duration in ms
        let startTime: number | null = null;

        // Temporarily override native CSS smooth scrolling so it doesn't fight our JS animation
        document.documentElement.style.scrollBehavior = 'auto';

        // Smooth uniform easing that doesn't exponentially accelerate like Cubic does
        const easeInOutSine = (t: number, b: number, c: number, d: number) => {
          return (-c / 2) * (Math.cos(Math.PI * t / d) - 1) + b;
        };

        const animation = (currentTime: number) => {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;

          if (timeElapsed < duration) {
            const run = easeInOutSine(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            requestAnimationFrame(animation);
          } else {
            // Guarantee exact final scroll position safely
            window.scrollTo(0, startPosition + distance);

            // Restore native CSS smooth scrolling
            document.documentElement.style.scrollBehavior = '';

            // Wait a tiny frame before focusing to entirely prevent browser snapping
            setTimeout(() => {
              searchInputRef.current?.focus({ preventScroll: true });
              setIsPulsing(true);
            }, 50);
          }
        };
        requestAnimationFrame(animation);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput)}`);
    } else {
      router.push('/search');
    }
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={styles.app}>
      {/* ─── HEADER ─── */}
      <header className={`${styles.header} ${isScrolled ? styles.headerScrolled : ''}`}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>FP</span>
          <span className={styles.logoText}>FirstPlace</span>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.freeBadgeHeaderGroup}>
            <div className={styles.freeBadgeHeader}>
              <span>100% Free</span>
              <span className={styles.alwaysLabel}>ALWAYS</span>
            </div>
            <div className={styles.freeTooltip}>
              <span className={styles.freeIcon}>💸</span>
              <p><strong>FirstPlace is 100% free forever.</strong> We never charge students a dime to browse, enquire, or apply for their first place.</p>
            </div>
          </div>
          <Link href="/search" className="btn btn-primary btn-sm">Browse All Places</Link>
        </div>
      </header>

      {/* ─── MAIN HERO ─── */}
      <main className={styles.main}>
        <div className={styles.heroContainer}>
          <div className={styles.badgeLabel}>
            🚀 UNI STUDENTS & HIGH SCHOOL GRADS
          </div>
          <h1 className={styles.heroTitle}>
            FIND YOUR <span className={styles.heroHighlight}>FIRST APARTMENT.</span><br />
            NOT YOUR PARENTS'.
          </h1>
          <p className={styles.heroSub}>
            Tired of confusing real estate apps designed for 40-year-olds?
            FirstPlace is built <strong>specifically for young people renting for the first time.</strong>
          </p>

          <ul className={styles.featureList}>
            <li>✦ AI highlights the green flags & warns you of the red flags</li>
            <li>🎓 See exactly how far it is from your Uni campus</li>
            <li>💸 Transparent prices & student-friendly rentals</li>
          </ul>

          <form
            className={`${styles.searchForm} ${isPulsing ? styles.pulseAttention : ''}`}
            onSubmit={handleSearch}
            onClick={() => setIsPulsing(false)}
          >
            <div className={styles.searchInputWrapper}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                ref={searchInputRef}
                type="search"
                className={styles.searchInput}
                placeholder="Search suburb, uni, or address..."
                value={searchInput}
                onChange={e => {
                  setSearchInput(e.target.value);
                  setIsPulsing(false);
                }}
                onKeyDown={() => setIsPulsing(false)}
              />
            </div>
            <button type="submit" className={`btn btn-primary ${styles.searchBtn}`}>
              Find My Place →
            </button>
          </form>
        </div>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLogo}>
            <span className={styles.logoMark} style={{ fontSize: '0.9rem', padding: '4px 8px' }}>FP</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>FirstPlace</span>
          </div>
          <div className={styles.footerLinks}>
            <a href="#">About Us</a>
            <a href="#">Contact Support</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
          <p className={styles.footerText}>
            The smartest apartment finder for young renters. AI-powered. Always free.
          </p>
        </div>
      </footer>
    </div>
  );
}
