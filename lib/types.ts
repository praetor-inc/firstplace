export interface Listing {
    id: string;
    title: string;
    address: string;
    suburb: string;
    state: string;
    postcode: string;
    lat: number;
    lng: number;
    pricePerWeek: number;
    propertyType: 'studio' | 'apartment' | 'house' | 'shared';
    bedrooms: number;
    bathrooms: number;
    furnished: boolean;
    petFriendly: boolean;
    billsIncluded: boolean;
    availableFrom: string;
    description: string;
    images: string[];
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    agency: string;
    aiScore: number;
    aiSummary: string;
    aiFlags: string[];
    aiPositives: string[];
    nearbyUni?: string;
    uniDistance?: number; // km
}

export interface Filters {
    maxPrice: number;
    propertyType: string[];
    furnished: boolean | null;
    petFriendly: boolean | null;
    billsIncluded: boolean | null;
    searchQuery: string;
}
