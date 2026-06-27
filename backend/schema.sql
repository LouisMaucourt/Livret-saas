
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


DROP TABLE IF EXISTS contacts_details CASCADE;
DROP TABLE IF EXISTS golden_book CASCADE;
DROP TABLE IF EXISTS rules_details CASCADE;
DROP TABLE IF EXISTS email_verifications CASCADE;
DROP TABLE IF EXISTS places_details CASCADE;
DROP TABLE IF EXISTS infos_details CASCADE;
DROP TABLE IF EXISTS stay_details CASCADE;
DROP TABLE IF EXISTS wifi_details CASCADE;
DROP TABLE IF EXISTS sections CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS clients CASCADE;


DROP TYPE IF EXISTS key_access_type CASCADE;
DROP TYPE IF EXISTS section_type CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

CREATE TYPE user_role AS ENUM (
  'admin',
  'owner',
  'client'
);

CREATE TYPE section_type AS ENUM (
  'wifi',
  'stay',
  'places',
  'contacts', 
  'rules',
  'infos',
  'golden_book'
);

CREATE TYPE key_access_type AS ENUM (
  'physical_key',
  'key_box',
  'digicode',
  'smart_lock',
  'concierge'
);

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(100),
  role          user_role NOT NULL DEFAULT 'owner',
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE email_verifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token       VARCHAR(255) NOT NULL UNIQUE,
  expires_at  TIMESTAMP WITH TIME ZONE NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE properties (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title        VARCHAR(250) NOT NULL,
  city         VARCHAR(100),
  address      VARCHAR(255),
  img_url      VARCHAR(255),
  description  VARCHAR(250),
  language     VARCHAR(10) NOT NULL DEFAULT 'fr',
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE clients (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  name        VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  qr_token    TEXT,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE sections (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id  UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  type           section_type NOT NULL,
  title          VARCHAR(255),
  sort_order     INTEGER NOT NULL DEFAULT 0,
  is_visible     BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (property_id, type)  
);


CREATE TABLE wifi_details(
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id      UUID NOT NULL UNIQUE REFERENCES sections(id) ON DELETE CASCADE,
  network_name    VARCHAR(255),
  password        VARCHAR(255)
);
CREATE TABLE infos_details (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id      UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  title           VARCHAR(100) NOT NULL,
  description     TEXT,
  img_url         VARCHAR(250)
);

CREATE TABLE stay_details (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id       UUID NOT NULL UNIQUE REFERENCES sections(id) ON DELETE CASCADE,
  checkin     TIME,
  checkout   TIME,
  instructions     TEXT,
  instructions_leave     TEXT,
  key_access_type  key_access_type,
  key_access_info  TEXT
);

CREATE TABLE places_details (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id  UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  category    VARCHAR(100),
  address     VARCHAR(255),
  phone       VARCHAR(50),
  website     VARCHAR(255)
);
CREATE TABLE golden_book (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id  UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  name        VARCHAR(100) NOT NULL,
  description TEXT,
  draw        VARCHAR(250)
);

CREATE TABLE contacts_details (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID NOT NULL UNIQUE REFERENCES sections(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  phone      VARCHAR(50),
  whatsapp   VARCHAR(100),
  notes      TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE rules_details (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id        UUID NOT NULL UNIQUE REFERENCES sections(id) ON DELETE CASCADE,
  parties_allowed   BOOLEAN NOT NULL DEFAULT FALSE,
  smoking_allowed   BOOLEAN NOT NULL DEFAULT FALSE,
  pets_allowed      BOOLEAN NOT NULL DEFAULT FALSE,
  additional_rules  TEXT
);

CREATE INDEX idx_properties_owner       ON properties(owner_id);
CREATE INDEX idx_sections_type          ON sections(type);
CREATE INDEX idx_places_details_section ON places_details(section_id);
CREATE INDEX idx_contacts_details_section ON contacts_details(section_id);


CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


CREATE TRIGGER trg_sections_updated_at
  BEFORE UPDATE ON sections
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();