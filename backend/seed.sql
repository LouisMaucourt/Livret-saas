-- ============================================================
-- USERS
-- ============================================================

INSERT INTO users (
  email,
  password_hash,
  name,
  role
)
VALUES
(
  'owner@gazbook.com',
  '$2b$10$fakehashedpassword',
  'Eole',
  'owner'
),
(
  'admin@gazbook.com',
  '$2b$10$fakehashedpassword',
  'GazBook Admin',
  'admin'
);

-- ============================================================
-- PROPERTY
-- ============================================================

INSERT INTO properties (
  owner_id,
  name,
  description,
  address,
  city,
  country,
  max_guests,
  img_url
)
VALUES (
  (SELECT id FROM users WHERE email = 'owner@gazbook.com'),
  'Appartement Cozy Angers',
  'Appartement moderne proche du centre-ville.',
  '12 rue des Lilas',
  'Angers',
  'France',
  4,
  'https://images.example.com/property.jpg'
);

-- ============================================================
-- BOOKLET
-- ============================================================

INSERT INTO booklets (
  property_id,
  title,
  language,
  img_url,
  description
)
VALUES (
  (SELECT id FROM properties LIMIT 1),
  'Livret d''Accueil',
  'fr',
  'https://images.example.com/booklet.jpg',
  'Bienvenue 👋 Profitez bien de votre séjour.'
);

-- ============================================================
-- SECTIONS
-- ============================================================

INSERT INTO sections (booklet_id, type, title, sort_order)
VALUES
((SELECT id FROM booklets LIMIT 1), 'wifi', 'Wifi', 1),
((SELECT id FROM booklets LIMIT 1), 'checkin', 'Arrivée', 2),
((SELECT id FROM booklets LIMIT 1), 'places', 'Lieux', 3),
((SELECT id FROM booklets LIMIT 1), 'cleaning', 'Ménage', 4),
((SELECT id FROM booklets LIMIT 1), 'contacts', 'Contacts', 5);

-- ============================================================
-- WIFI
-- ============================================================

INSERT INTO wifi_details (
  section_id,
  network_name,
  password
)
VALUES (
  (SELECT id FROM sections WHERE type = 'wifi'),
  'CozyWifi',
  'superpassword123'
);

-- ============================================================
-- CHECKIN
-- ============================================================

INSERT INTO checkin_details (
  section_id,
  checkin_from,
  checkin_until,
  instructions,
  instructions_leave,
  key_access_type,
  key_access_info
)
VALUES (
  (SELECT id FROM sections WHERE type = 'checkin'),
  '15:00',
  '22:00',
  'Merci de prévenir avant votre arrivée.',
  'Laissez les clés sur la table.',
  'key_box',
  'Code boîte à clé : 4589'
);

-- ============================================================
-- PLACES
-- ============================================================

INSERT INTO places (
  section_id,
  name,
  description,
  category,
  address,
  phone,
  website
)
VALUES
(
  (SELECT id FROM sections WHERE type = 'places'),
  'Boulangerie du Centre',
  'Très bonnes viennoiseries.',
  'Boulangerie',
  '5 rue du Centre, Angers',
  NULL,
  NULL
),
(
  (SELECT id FROM sections WHERE type = 'places'),
  'Restaurant La Loire',
  'Cuisine locale chaleureuse.',
  'Restaurant',
  '8 quai de la Loire, Angers',
  NULL,
  NULL
);

-- ============================================================
-- CONTACTS
-- ============================================================

INSERT INTO contacts (
  section_id,
  phone,
  notes,
  sort_order
)
VALUES (
  (SELECT id FROM sections WHERE type = 'contacts'),
  '06 12 34 56 78',
  'Contact principal du logement',
  1
);