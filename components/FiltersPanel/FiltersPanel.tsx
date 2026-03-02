'use client';
import styles from './FiltersPanel.module.css';

interface FiltersPanelProps {
    filters: {
        maxPrice: number;
        propertyType: string[];
        furnished: boolean | null;
        petFriendly: boolean | null;
        billsIncluded: boolean | null;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (filters: any) => void;
    resultCount: number;
}

const PROPERTY_TYPES = [
    { value: 'studio', label: 'Studio' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'shared', label: 'Shared Room' },
];

function ToggleFilter({ label, value, onChange }: { label: string; value: boolean | null; onChange: (v: boolean | null) => void }) {
    return (
        <div className={styles.toggleGroup}>
            <span className={styles.toggleLabel}>{label}</span>
            <div className={styles.toggleBtns}>
                <button
                    className={`${styles.toggleBtn} ${value === true ? styles.toggleActive : ''}`}
                    onClick={() => onChange(value === true ? null : true)}
                    aria-pressed={value === true}
                >Yes</button>
                <button
                    className={`${styles.toggleBtn} ${value === false ? styles.toggleActiveNo : ''}`}
                    onClick={() => onChange(value === false ? null : false)}
                    aria-pressed={value === false}
                >No</button>
            </div>
        </div>
    );
}

export default function FiltersPanel({ filters, onChange, resultCount }: FiltersPanelProps) {
    const toggleType = (type: string) => {
        const current = filters.propertyType;
        const next = current.includes(type)
            ? current.filter(t => t !== type)
            : [...current, type];
        onChange({ ...filters, propertyType: next });
    };

    const resetFilters = () => {
        onChange({
            maxPrice: 700,
            propertyType: [],
            furnished: null,
            petFriendly: null,
            billsIncluded: null,
        });
    };

    return (
        <aside className={styles.panel}>
            <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>FILTERS</h2>
                <span className={styles.resultCount}>
                    {resultCount} {resultCount === 1 ? 'place' : 'places'}
                </span>
                <button className={styles.resetBtn} onClick={resetFilters}>Reset</button>
            </div>

            {/* Price */}
            <div className={styles.section}>
                <label className={styles.sectionLabel}>MAX PRICE / WEEK</label>
                <div className={styles.priceDisplay}>
                    <span className={styles.priceBig}>${filters.maxPrice}</span>
                    <span className={styles.priceWeek}>/wk</span>
                </div>
                <input
                    type="range"
                    min={150}
                    max={800}
                    step={10}
                    value={filters.maxPrice}
                    onChange={e => onChange({ ...filters, maxPrice: Number(e.target.value) })}
                    className={styles.slider}
                    aria-label="Maximum price per week"
                />
                <div className={styles.sliderLabels}>
                    <span>$150</span>
                    <span>$800</span>
                </div>
            </div>

            {/* Property type */}
            <div className={styles.section}>
                <label className={styles.sectionLabel}>PROPERTY TYPE</label>
                <div className={styles.typeGrid}>
                    {PROPERTY_TYPES.map(t => (
                        <button
                            key={t.value}
                            className={`${styles.typeBtn} ${filters.propertyType.includes(t.value) ? styles.typeBtnActive : ''}`}
                            onClick={() => toggleType(t.value)}
                            aria-pressed={filters.propertyType.includes(t.value)}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Toggles */}
            <div className={styles.section}>
                <label className={styles.sectionLabel}>FEATURES</label>
                <div className={styles.toggleList}>
                    <ToggleFilter
                        label="Furnished"
                        value={filters.furnished}
                        onChange={v => onChange({ ...filters, furnished: v })}
                    />
                    <ToggleFilter
                        label="Pet Friendly"
                        value={filters.petFriendly}
                        onChange={v => onChange({ ...filters, petFriendly: v })}
                    />
                    <ToggleFilter
                        label="Bills Included"
                        value={filters.billsIncluded}
                        onChange={v => onChange({ ...filters, billsIncluded: v })}
                    />
                </div>
            </div>

            {/* AI Score info */}
            <div className={styles.aiInfo}>
                <span className={styles.aiInfoLabel}>✦ AI SCORE GUIDE</span>
                <div className={styles.scoreGuide}>
                    <div className={styles.scoreRow}>
                        <span className="score-high" style={{ padding: '2px 8px', border: '2px solid var(--ink)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700 }}>8–10</span>
                        <span>Great Pick — exceptional value</span>
                    </div>
                    <div className={styles.scoreRow}>
                        <span className="score-mid" style={{ padding: '2px 8px', border: '2px solid var(--ink)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700 }}>6–7</span>
                        <span>Worth It — solid option</span>
                    </div>
                    <div className={styles.scoreRow}>
                        <span className="score-low" style={{ padding: '2px 8px', border: '2px solid var(--ink)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700 }}>1–5</span>
                        <span>Caution — check carefully</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
