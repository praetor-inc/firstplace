'use client';
import { useState } from 'react';
import { Listing } from '@/lib/types';
import styles from './ListingCard.module.css';
import ContactModal from '../ContactModal/ContactModal';

interface ListingCardProps {
    listing: Listing;
    isSelected: boolean;
    onClick: () => void;
    compact?: boolean;
}

function ScoreBadge({ score }: { score: number }) {
    const cls = score >= 8 ? 'score-high' : score >= 6 ? 'score-mid' : 'score-low';
    const label = score >= 8 ? 'Great Pick' : score >= 6 ? 'Worth It' : 'Caution';
    return (
        <div className={`${styles.scoreBadge} ${cls}`}>
            <span className={styles.scoreNumber}>{score.toFixed(1)}</span>
            <span className={styles.scoreLabel}>{label}</span>
        </div>
    );
}

export default function ListingCard({ listing, isSelected, onClick, compact }: ListingCardProps) {
    const [imgIndex, setImgIndex] = useState(0);
    const [showContact, setShowContact] = useState(false);
    const [saved, setSaved] = useState(false);

    const nextImg = (e: React.MouseEvent) => {
        e.stopPropagation();
        setImgIndex((i) => (i + 1) % listing.images.length);
    };

    const prevImg = (e: React.MouseEvent) => {
        e.stopPropagation();
        setImgIndex((i) => (i === 0 ? listing.images.length - 1 : i - 1));
    };

    const toggleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSaved(s => !s);
    };

    const typeLabel: Record<string, string> = {
        studio: 'STUDIO',
        apartment: 'APARTMENT',
        house: 'HOUSE',
        shared: 'SHARED ROOM',
    };

    return (
        <>
            <div
                className={`${styles.card} ${isSelected ? styles.selected : ''} ${compact ? styles.compact : ''}`}
                onClick={onClick}
                role="button"
                tabIndex={0}
                aria-label={`View listing: ${listing.title}`}
                onKeyDown={(e) => e.key === 'Enter' && onClick()}
            >
                {/* Image */}
                <div className={styles.imageContainer}>
                    <img
                        src={listing.images[imgIndex]}
                        alt={`${listing.title} — photo ${imgIndex + 1}`}
                        className={styles.image}
                        loading="lazy"
                    />
                    {listing.images.length > 1 && (
                        <>
                            <button className={`${styles.imgBtn} ${styles.imgPrev}`} onClick={prevImg} aria-label="Previous photo">‹</button>
                            <button className={`${styles.imgBtn} ${styles.imgNext}`} onClick={nextImg} aria-label="Next photo">›</button>
                            <div className={styles.imgDots}>
                                {listing.images.map((_, i) => (
                                    <span key={i} className={`${styles.dot} ${i === imgIndex ? styles.dotActive : ''}`} />
                                ))}
                            </div>
                        </>
                    )}
                    <span className={styles.typeTag}>{typeLabel[listing.propertyType]}</span>
                    <button
                        className={`${styles.saveBtn} ${saved ? styles.saveBtnActive : ''}`}
                        onClick={toggleSave}
                        aria-label={saved ? 'Remove from saved' : 'Save listing'}
                    >
                        {saved ? '♥' : '♡'}
                    </button>
                </div>

                {/* Content */}
                <div className={styles.content}>
                    <div className={styles.topRow}>
                        <div>
                            <p className={styles.price}>${listing.pricePerWeek}<span>/wk</span></p>
                            <h3 className={styles.title}>{listing.title}</h3>
                            <p className={styles.address}>📍 {listing.address}, {listing.suburb} {listing.state}</p>
                        </div>
                        <ScoreBadge score={listing.aiScore} />
                    </div>

                    {/* Stats row */}
                    <div className={styles.stats}>
                        {listing.bedrooms === 0 ? (
                            <span className={styles.stat}>🛏 Studio</span>
                        ) : (
                            <span className={styles.stat}>🛏 {listing.bedrooms}BR</span>
                        )}
                        <span className={styles.stat}>🚿 {listing.bathrooms} Bath</span>
                        {listing.furnished && <span className={`${styles.stat} ${styles.statGreen}`}>✓ Furnished</span>}
                        {listing.petFriendly && <span className={`${styles.stat} ${styles.statGreen}`}>🐾 Pets OK</span>}
                        {listing.billsIncluded && <span className={`${styles.stat} ${styles.statGreen}`}>⚡ Bills Incl.</span>}
                    </div>

                    {/* AI Summary */}
                    <div className={styles.aiBox}>
                        <span className={styles.aiLabel}>✦ AI SUMMARY</span>
                        <p className={styles.aiText}>{listing.aiSummary}</p>
                    </div>

                    {/* Flags & Positives */}
                    {!compact && (
                        <div className={styles.flagsRow}>
                            {listing.aiFlags.map((f, i) => (
                                <span key={i} className={`${styles.flag} ${styles.flagRed}`}>⚠ {f}</span>
                            ))}
                            {listing.aiPositives.slice(0, 2).map((p, i) => (
                                <span key={i} className={`${styles.flag} ${styles.flagGreen}`}>✓ {p}</span>
                            ))}
                        </div>
                    )}

                    {/* Uni distance */}
                    {listing.nearbyUni && (
                        <p className={styles.uniDistance}>
                            🎓 {listing.uniDistance}km to {listing.nearbyUni}
                        </p>
                    )}

                    {/* Actions */}
                    <div className={styles.actions}>
                        <button
                            className={`btn btn-primary btn-sm ${styles.enquireBtn}`}
                            onClick={(e) => { e.stopPropagation(); setShowContact(true); }}
                        >
                            Enquire Now →
                        </button>
                        <div className={styles.agentInfo}>
                            <span className={styles.agentName}>{listing.contactName}</span>
                            <span className={styles.agencyName}>{listing.agency}</span>
                        </div>
                    </div>
                </div>
            </div>

            {showContact && (
                <ContactModal listing={listing} onClose={() => setShowContact(false)} />
            )}
        </>
    );
}
