-- Create the listings table
CREATE TABLE IF NOT EXISTS public.listings (
    id text PRIMARY KEY,
    title text NOT NULL,
    address text NOT NULL,
    suburb text NOT NULL,
    state text NOT NULL,
    postcode text NOT NULL,
    lat numeric NOT NULL,
    lng numeric NOT NULL,
    "pricePerWeek" numeric NOT NULL,
    "propertyType" text NOT NULL,
    bedrooms integer NOT NULL,
    bathrooms integer NOT NULL,
    furnished boolean NOT NULL,
    "petFriendly" boolean NOT NULL,
    "billsIncluded" boolean NOT NULL,
    "availableFrom" date NOT NULL,
    description text NOT NULL,
    images text[] NOT NULL,
    "contactName" text NOT NULL,
    "contactPhone" text NOT NULL,
    "contactEmail" text NOT NULL,
    agency text NOT NULL,
    "aiScore" numeric NOT NULL,
    "aiSummary" text NOT NULL,
    "aiFlags" text[] NOT NULL,
    "aiPositives" text[] NOT NULL,
    "nearbyUni" text,
    "uniDistance" numeric
);

-- Turn on Row Level Security (RLS)
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public selective read access
CREATE POLICY "Allow public read access to listings" 
ON public.listings FOR SELECT 
USING (true);

-- Clear any existing data
DELETE FROM public.listings;

-- Insert Seed Data
INSERT INTO public.listings (
  id, title, address, suburb, state, postcode, lat, lng, "pricePerWeek", "propertyType", bedrooms, bathrooms, furnished, "petFriendly", "billsIncluded", "availableFrom", description, images, "contactName", "contactPhone", "contactEmail", agency, "aiScore", "aiSummary", "aiFlags", "aiPositives", "nearbyUni", "uniDistance"
) VALUES 
('1', 'Cosy Studio Near UNSW — Bills Included', '14 High St', 'Kensington', 'NSW', '2033', -33.9173, 151.2286, 390, 'studio', 0, 1, true, false, true, '2026-04-01', 'A well-presented studio apartment in the heart of Kensington... Water and electricity included.', ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80'], 'Sarah Chen', '0412 345 678', 'sarah.chen@raywhite.com', 'Ray White Kensington', 8.7, 'Outstanding value for a Kensington studio.', ARRAY[]::text[], ARRAY['Bills included saves ~$80/week', 'Fully furnished — move in ready', '5 min walk to UNSW campus'], 'UNSW Sydney', 0.4),
('2', 'Spacious 1BR Apartment — Inner West Location', '55 Parramatta Rd', 'Camperdown', 'NSW', '2050', -33.8882, 151.1784, 520, 'apartment', 1, 1, false, true, false, '2026-03-15', 'Bright and airy one-bedroom apartment in sought-after Camperdown.', ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80'], 'Marcus Webb', '0422 567 890', 'm.webb@lj-hooker.com.au', 'LJ Hooker Newtown', 7.4, 'A solid 1-bedroom in a prime inner-west location.', ARRAY['Bills not included'], ARRAY['Pets welcome — rare finding', 'Balcony with leafy outlook'], 'University of Sydney', 1.2),
('3', 'Shared House — 1 Room Available, Great Housemates', '7 Glebe Point Rd', 'Glebe', 'NSW', '2037', -33.8802, 151.1858, 280, 'shared', 1, 2, true, false, true, '2026-03-20', 'One room available in a friendly 4-bedroom share house on the leafy end of Glebe Point Road.', ARRAY['https://images.unsplash.com/photo-1525438160292-a4a860951216?w=800&q=80', 'https://images.unsplash.com/photo-1464082354059-27db6ce50048?w=800&q=80'], 'Tom Nguyen', '0433 789 012', 'glebe.share@gmail.com', 'Private', 9.1, 'Exceptional value.', ARRAY[]::text[], ARRAY['$280/week with ALL bills included', 'Real housemate community', '15 min walk to USyd'], 'University of Sydney', 1.8),
('4', 'Modern Studio — City Fringe, Transport Hub', '302/88 Broadway', 'Ultimo', 'NSW', '2007', -33.8849, 151.1975, 450, 'studio', 0, 1, true, false, false, '2026-04-07', 'Stylish furnished studio on the 3rd floor of a boutique building in Ultimo.', ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80'], 'Lin Properties', '02 9123 4567', 'rentals@linproperty.com.au', 'Lin Property Management', 7.9, 'A smart city-fringe pick for UTS students.', ARRAY['No bills included'], ARRAY['3 min to UTS campus', 'Gym access included'], 'UTS', 0.3),
('5', 'Charming 2BR Terrace — Share with a Friend', '41 King St', 'Newtown', 'NSW', '2042', -33.8963, 151.1800, 680, 'house', 2, 1, false, true, false, '2026-04-14', 'Heritage terrace home with two bedrooms.', ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80', 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80'], 'Penny Hartley', '0445 321 099', 'phartley@mcgrath.com.au', 'McGrath', 7.1, 'Great Newtown terrace — $340/person/week when shared.', ARRAY['Bills not included', 'No furniture'], ARRAY['$340/person when shared', 'Iconic Newtown location', 'Pets welcome'], 'University of Sydney', 2.4),
('6', 'Brand New 1BR with Parking — Close to Macquarie', '12 Epping Rd', 'Macquarie Park', 'NSW', '2113', -33.7748, 151.1199, 480, 'apartment', 1, 1, false, false, false, '2026-05-01', 'Brand new apartment in the quiet suburb of Macquarie Park.', ARRAY['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'], 'Alex Dao', '0411 234 567', 'alex@propertyworks.com.au', 'Property Works', 6.8, 'A fresh, modern 1BR with the bonus of onsite parking.', ARRAY['No furniture', 'Higher price'], ARRAY['Brand new fixtures', 'Secure parking'], 'Macquarie University', 0.8),
('7', 'Budget Shared Room — Central Location', '8 Pitt St', 'Haymarket', 'NSW', '2000', -33.8785, 151.2046, 210, 'shared', 1, 1, true, false, true, '2026-03-10', 'Furnished room in a larger shared apartment in Haymarket.', ARRAY['https://images.unsplash.com/photo-1464082354059-27db6ce50048?w=800&q=80'], 'Jenny Li', '0432 109 876', 'jenli.rentals@gmail.com', 'Private', 5.9, 'The cheapest CBD-adjacent option we''re seeing right now.', ARRAY['Shared with 4 others', 'Inspections by appointment'], ARRAY['Only $210/week all-inclusive', 'Central Station 2 min walk'], 'UTS', 1.1),
('8', 'Newly Renovated Studio — Manly Beach Lifestyle', '3/22 The Corso', 'Manly', 'NSW', '2095', -33.7978, 151.2870, 560, 'studio', 0, 1, true, false, false, '2026-04-01', 'Newly renovated ground floor studio steps from Manly Beach.', ARRAY['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80'], 'Coast Realty', '02 9977 8765', 'rentals@coastrealty.com.au', 'Coast Realty Manly', 6.5, 'Premium beachside lifestyle at a premium price.', ARRAY['Bills not included', 'High price for studio size', 'Far from most universities'], ARRAY['Steps from Manly Beach', 'Private courtyard', 'Brand new renovation'], 'Macquarie University', 9.2),
('9', '3-Bed Share House — Griffith Uni Students Welcome', '19 Southport Rd', 'Southport', 'QLD', '4215', -27.9783, 153.3977, 250, 'shared', 1, 2, true, true, true, '2026-03-25', '1 room available in a 3-bedroom share house in Southport.', ARRAY['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'], 'Riley Thompson', '0455 678 901', 'southportshare@gmail.com', 'Private', 8.9, 'Exceptional value on the Gold Coast.', ARRAY[]::text[], ARRAY['$250/week everything included', 'Large backyard', 'Pets welcome', 'Light rail to Griffith Uni'], 'Griffith University Gold Coast', 2.1),
('10', 'Modern 1BR — St Kilda Road Corridor', '5/100 Albert Rd', 'South Melbourne', 'VIC', '3205', -37.8409, 144.9706, 490, 'apartment', 1, 1, false, false, false, '2026-04-10', 'Stylish 1-bedroom apartment on the St Kilda Road corridor.', ARRAY['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80'], 'James Park', '03 9867 5432', 'jpark@abercrombie.com.au', 'Abercrombie & Kent', 7.2, 'Well-located Melbourne apartment.', ARRAY['12-month lease preferred', 'No furniture'], ARRAY['Tram at the door', 'City views', 'Close to RMIT'], 'RMIT', 2.8),
('11', 'Affordable Studio — Brunswick Vibes', '9 Sydney Rd', 'Brunswick', 'VIC', '3056', -37.7693, 144.9622, 340, 'studio', 0, 1, true, true, false, '2026-03-28', 'Character studio apartment above a Melbourne institution.', ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'], 'Eva Moretti', '0421 543 210', 'eva.moretti@melburn.com.au', 'Melburn Real Estate', 8.2, 'A charming Brunswick studio.', ARRAY['Bills not included'], ARRAY['Exposed brick character', 'Pets welcome', 'Sydney Rd café culture'], 'RMIT', 4.5),
('12', 'Clean 1BR Near QUT — Furnished & Move-In Ready', '24 Boundary St', 'South Brisbane', 'QLD', '4101', -27.4789, 153.0193, 420, 'apartment', 1, 1, true, false, false, '2026-04-01', 'Well-maintained furnished 1-bedroom apartment in trendy South Brisbane.', ARRAY['https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80'], 'Brisbane Living', '07 3222 4455', 'rent@brisbaneliving.com.au', 'Brisbane Living Rentals', 7.8, 'Excellent QUT pick.', ARRAY['Bills not included'], ARRAY['Fully furnished with study nook', 'Walking distance to QUT', 'South Bank lifestyle'], 'QUT (Gardens Point)', 0.9);
