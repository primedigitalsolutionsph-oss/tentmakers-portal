-- Tentmakers Network: Hostinger MySQL schema (single database — no Supabase).
-- Import via Hostinger hPanel -> Databases -> phpMyAdmin -> Import.
-- Seed content is canonical in lib/ventures-data.ts; this file mirrors it.
-- Auth tables (users/accounts/sessions/verification_tokens) follow the
-- Auth.js Prisma schema; row ownership is enforced in the Next.js API
-- routes instead (MySQL has no RLS).

-- IMPORTANT: in phpMyAdmin, click your database name
-- (e.g. u123456789_tentmakers) in the left sidebar FIRST, then use Import.
-- Do NOT run CREATE DATABASE: Hostinger's MySQL user has no privilege for
-- it and your database already exists.

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  emailVerified TIMESTAMP NULL,
  passwordHash VARCHAR(255) NULL,
  fullName VARCHAR(100) NULL,
  phone VARCHAR(20) NULL,
  image VARCHAR(500) NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS accounts (
  id CHAR(36) PRIMARY KEY,
  userId CHAR(36) NOT NULL,
  type VARCHAR(50) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  providerAccountId VARCHAR(255) NOT NULL,
  accessToken TEXT NULL,
  refreshToken TEXT NULL,
  expiresAt INT NULL,
  idToken TEXT NULL,
  scope VARCHAR(500) NULL,
  tokenType VARCHAR(50) NULL,
  UNIQUE KEY accounts_provider_unique (provider, providerAccountId),
  KEY accounts_user_idx (userId),
  CONSTRAINT accounts_user_fk FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sessions (
  id CHAR(36) PRIMARY KEY,
  userId CHAR(36) NOT NULL,
  sessionToken VARCHAR(255) NOT NULL UNIQUE,
  expires TIMESTAMP NOT NULL,
  KEY sessions_user_idx (userId),
  CONSTRAINT sessions_user_fk FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS profiles (
  id CHAR(36) PRIMARY KEY,
  fullName VARCHAR(100) NULL,
  phone VARCHAR(20) NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'member',
  requestedRole VARCHAR(20) NULL,
  trainingTier VARCHAR(20) NOT NULL DEFAULT 'basic',
  completedActivities JSON NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT profiles_user_fk FOREIGN KEY (id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT profiles_role_chk CHECK (role IN ('member','operator','partner')),
  CONSTRAINT profiles_tier_chk CHECK (trainingTier IN ('basic','intermediate','advanced'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ventures (
  slug VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  stage VARCHAR(20) NOT NULL,
  gap VARCHAR(255) NOT NULL,
  offering TEXT NOT NULL,
  description TEXT NOT NULL,
  marketSignals JSON NOT NULL,
  fullDescription JSON NOT NULL,
  metric VARCHAR(100) NOT NULL,
  metricLabel VARCHAR(255) NOT NULL,
  industries JSON NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS registrations (
  id CHAR(36) PRIMARY KEY,
  userId CHAR(36) NULL,
  fullName VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NULL,
  inquiryType VARCHAR(20) NOT NULL DEFAULT 'member',
  message TEXT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY registrations_email_idx (email),
  CONSTRAINT registrations_user_fk FOREIGN KEY (userId) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS subscriptions (
  id CHAR(36) PRIMARY KEY,
  userId CHAR(36) NOT NULL,
  tier VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  provider VARCHAR(50) NULL,
  providerRef VARCHAR(255) NULL,
  currentPeriodEnd TIMESTAMP NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY subscriptions_user_status_idx (userId, status),
  CONSTRAINT subscriptions_user_fk FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires TIMESTAMP NOT NULL,
  PRIMARY KEY (identifier, token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed ventures from lib/ventures-data.ts (canonical copy).
INSERT IGNORE INTO ventures
  (slug, name, stage, gap, offering, description, marketSignals, fullDescription, metric, metricLabel, industries)
VALUES
  ('prime-digital-solutions','Prime Digital Solutions','Active','The Storefront Gap',
   'Website and app development plus business automation.',
   'Technology backbone of the ecosystem.',
   JSON_ARRAY('99.5% of Philippine businesses are MSMEs','90.8% own computers and 81% have internet','National e-commerce market $20-24B'),
   JSON_ARRAY('MSMEs make up 99.5% of all Philippine businesses.'),
   '57,469','MSMEs in Western Visayas (DTI)',
   JSON_ARRAY('Web','App','Automation','E-commerce')),
   ('thrifty-tribe','Thrifty Tribe','Early','The Savings Gap',
    'Structured savings, QR-code deals, and cashback.',
    'Smart savings membership; built into Tentmakers membership from day one.',
    JSON_ARRAY('Digital payments 57.4% of retail volume in 2024','43% of adults hold e-money accounts'),
    JSON_ARRAY('Thrifty Tribe rides the QR-payments wave.'),
    'Members-only','QR deals & cashback at partner merchants',
    JSON_ARRAY('Payments','Savings','Cashback')),
   ('icky','ICKY','Early','The Protection Gap',
    'Driver protection and road-safety education.',
    'Insurance literacy, 3D simulation, 24/7 SOS.',
    JSON_ARRAY('Insurance penetration ~1.79% in 2025','31,000+ road accidents in 2024'),
    JSON_ARRAY('ICKY targets the risk behind 31,000+ annual accidents.'),
    '~1.79%','insurance penetration (2025)',
    JSON_ARRAY('Insurance','Road Safety','Education','24/7 SOS')),
   ('prime-axis','Prime Axis','Early','The Staffing Gap',
    'General and specialized labor marketplace.',
    'Staffing for events today; hiring resource tomorrow.',
    JSON_ARRAY('41% of SMEs increased headcount in 2024','MSMEs generate ~63% of employment'),
    JSON_ARRAY('Prime Axis supplies flexible labor against SME hiring demand.'),
    '41%','of SMEs increased headcount in 2024',
    JSON_ARRAY('Staffing','Labor')),
   ('tentmakers-network','Tentmakers Network','Early','The Trust Gap',
    'Readiness Score, three tiers, real company access.',
    'Member network with readiness gates, not a franchise offer.',
    JSON_ARRAY('300-member target: Iloilo HQ 150, Capiz 60, Aklan 50, Antique 40','Three training tiers: Tier 1 Foundation, Tier 2 Building, Tier 3 Established'),
    JSON_ARRAY('Tiers are readiness gates; completing all three is a successful outcome.'),
    '300','member target by Q4 2026',
    JSON_ARRAY('Community','Training','Mentorship'));
