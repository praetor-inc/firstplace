'use client';
import { useEffect } from 'react';
import { track } from '@vercel/analytics/react';
import { Listing } from '@/lib/types';
import styles from './ContactModal.module.css';

interface ContactModalProps {
    listing: Listing;
    onClose: () => void;
}

export default function ContactModal({ listing, onClose }: ContactModalProps) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handler);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handler);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    return (
        <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Contact agent">
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">✕</button>

                <div className={styles.header}>
                    <span className={styles.headerLabel}>CONTACT DETAILS</span>
                    <h2 className={styles.listingTitle}>{listing.title}</h2>
                    <p className={styles.address}>📍 {listing.address}, {listing.suburb} {listing.state} {listing.postcode}</p>
                </div>

                <div className={styles.agentCard}>
                    <div className={styles.agentAvatar}>
                        {listing.contactName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                        <p className={styles.agentName}>{listing.contactName}</p>
                        <p className={styles.agencyName}>{listing.agency}</p>
                    </div>
                </div>

                <div className={styles.contactMethods}>
                    <a
                        href={`tel:${listing.contactPhone.replace(/\s/g, '')}`}
                        className={`${styles.contactBtn} ${styles.phoneBtn}`}
                        onClick={() => track('Lead_Call', { listingId: listing.id, agent: listing.contactName })}
                    >
                        <span className={styles.contactIcon}>📞</span>
                        <div>
                            <span className={styles.contactLabel}>CALL NOW</span>
                            <span className={styles.contactValue}>{listing.contactPhone}</span>
                        </div>
                    </a>
                    <a
                        href={`mailto:${listing.contactEmail}?subject=Enquiry: ${encodeURIComponent(listing.title)}&body=Hi ${listing.contactName.split(' ')[0]}, I'm interested in ${listing.title} at ${listing.address}, ${listing.suburb}. Could you please arrange an inspection? Thanks.`}
                        className={`${styles.contactBtn} ${styles.emailBtn}`}
                        onClick={() => track('Lead_Email', { listingId: listing.id, agent: listing.contactName })}
                    >
                        <span className={styles.contactIcon}>✉️</span>
                        <div>
                            <span className={styles.contactLabel}>SEND EMAIL</span>
                            <span className={styles.contactValue}>{listing.contactEmail}</span>
                        </div>
                    </a>
                </div>

                <div className={styles.listingStats}>
                    <div className={styles.stat}>
                        <span className={styles.statLabel}>PRICE</span>
                        <span className={styles.statValue}>${listing.pricePerWeek}/wk</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statLabel}>AVAILABLE</span>
                        <span className={styles.statValue}>{new Date(listing.availableFrom).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statLabel}>AI SCORE</span>
                        <span className={`${styles.statValue} ${listing.aiScore >= 8 ? 'score-high' : listing.aiScore >= 6 ? 'score-mid' : 'score-low'}`} style={{ padding: '2px 8px', border: '2px solid var(--ink)' }}>
                            {listing.aiScore.toFixed(1)}
                        </span>
                    </div>
                </div>

                <div className={styles.aiPanel}>
                    <div className={styles.aiHeader}>
                        <span>✦ AI ANALYSIS</span>
                    </div>
                    <p className={styles.aiSummary}>{listing.aiSummary}</p>
                    {listing.aiPositives.length > 0 && (
                        <ul className={styles.positivesList}>
                            {listing.aiPositives.map((p, i) => (
                                <li key={i} className={styles.positiveItem}>✓ {p}</li>
                            ))}
                        </ul>
                    )}
                    {listing.aiFlags.length > 0 && (
                        <ul className={styles.flagsList}>
                            {listing.aiFlags.map((f, i) => (
                                <li key={i} className={styles.flagItem}>⚠ {f}</li>
                            ))}
                        </ul>
                    )}
                </div>

                <p className={styles.disclaimer}>
                    Mention <strong>FirstPlace</strong> when enquiring. Contact details provided by listing agent/landlord.
                </p>
            </div>
        </div>
    );
}
