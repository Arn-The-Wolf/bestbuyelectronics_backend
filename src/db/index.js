import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from backend directory
dotenv.config({ path: join(__dirname, '../../.env') });

const { Pool } = pg;

// Validate DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL is not set in .env file');
  console.error('Please create a .env file in the backend directory with:');
  console.error('DATABASE_URL=postgresql://postgres@localhost:5432/tanzania_tech_nexus');
  console.error('(Add password if needed: postgresql://postgres:password@localhost:5432/tanzania_tech_nexus)');
  process.exit(1);
}

import { promises as dns } from 'dns';

/* ... imports ... */

// Check if we're connecting to Supabase
const isSupabase = process.env.DATABASE_URL?.includes('supabase.co');
const isProduction = process.env.NODE_ENV === 'production';

let connectionConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: (isProduction || isSupabase) ? { rejectUnauthorized: false } : false
};

// Force IPv4 for Supabase/Production to avoid ENETUNREACH (IPv6 issues)
if (process.env.DATABASE_URL) {
  try {
    const url = new URL(process.env.DATABASE_URL);
    if (url.hostname && !url.hostname.match(/^(\d{1,3}\.){3}\d{1,3}$/)) {
      // It's a hostname, resolve to IPv4
      console.log(`Resolving hostname ${url.hostname} to IPv4...`);
      // Use dns.lookup which uses the system resolver (getaddrinfo) instead of network DNS
      // This is more reliable in container environments and handles /etc/hosts etc.
      const { address } = await dns.lookup(url.hostname, { family: 4 });

      if (address) {
        console.log(`Resolved to: ${address}`);
        const originalHost = url.hostname;
        url.hostname = address;
        connectionConfig.connectionString = url.toString();
        // Preserve SNI for SSL
        if (connectionConfig.ssl) {
          connectionConfig.ssl.servername = originalHost;
        }
      }
    }
  } catch (e) {
    console.warn('DNS Resolution failed (falling back to original connection string):', e.message);
  }
}

// Debug logging
if (process.env.DATABASE_URL) {
  /* ... logging code ... */
}

const pool = new Pool({
  ...connectionConfig,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

const db = {
  query: (text, params) => pool.query(text, params),
  pool,
  init: async () => {
    try {
      // Test connection
      await pool.query('SELECT NOW()');
      console.log('✅ Database connection established');

      // Run migrations
      await runMigrations();
      return true;
    } catch (error) {
      console.error('❌ Database initialization error:', error.message);

      // Provide helpful error messages
      if (error.code === '28000' || error.message.includes('does not exist')) {
        console.error('\n💡 Troubleshooting:');
        console.error('1. Check your DATABASE_URL in .env file');
        console.error('2. Verify PostgreSQL username and password are correct');
        console.error('3. Make sure PostgreSQL is running');
        console.error('4. Ensure the database "tanzania_tech_nexus" exists');
        console.error('\nExample DATABASE_URL format:');
        console.error('DATABASE_URL=postgresql://postgres:password@localhost:5432/tanzania_tech_nexus');
      } else if (error.code === '3D000') {
        console.error('\n💡 Database does not exist. Create it with:');
        console.error('psql -U postgres -c "CREATE DATABASE tanzania_tech_nexus;"');
      } else if (error.code === 'ECONNREFUSED') {
        console.error('\n💡 Cannot connect to PostgreSQL. Make sure:');
        console.error('1. PostgreSQL service is running');
        console.error('2. PostgreSQL is listening on port 5432');
      }

      throw error;
    }
  }
};

async function runMigrations() {
  try {
    // Create enum type
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE app_role AS ENUM ('admin', 'customer');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create users table (for authentication)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        phone TEXT UNIQUE NOT NULL,
        email TEXT,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Create user_roles table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_roles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        role app_role NOT NULL DEFAULT 'customer',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, role)
      );
    `);

    // Create profiles table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        full_name TEXT,
        email TEXT,
        phone TEXT,
        address TEXT,
        city TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Create categories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        image_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Create products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        discount_price DECIMAL(10,2),
        stock INTEGER NOT NULL DEFAULT 0,
        category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
        image_url TEXT,
        images TEXT[],
        brand TEXT,
        specifications JSONB,
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Create orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        shipping_address TEXT NOT NULL,
        phone TEXT NOT NULL,
        payment_method TEXT DEFAULT 'cash_on_delivery',
        tracking_number TEXT,
        tracking_url TEXT,
        estimated_delivery TIMESTAMPTZ,
        coupon_code TEXT,
        discount_amount DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Create order_items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
        product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Create reviews table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(product_id, user_id)
      );
    `);

    // Create chat_messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        is_from_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Create coupons table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS coupons (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code TEXT NOT NULL UNIQUE,
        discount_percentage INTEGER NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
        discount_amount NUMERIC CHECK (discount_amount >= 0),
        min_purchase_amount NUMERIC DEFAULT 0,
        max_uses INTEGER,
        used_count INTEGER DEFAULT 0,
        valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        valid_until TIMESTAMPTZ NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Create wishlists table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS wishlists (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(user_id, product_id)
      );
    `);

    // Create loyalty_points table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS loyalty_points (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        points INTEGER NOT NULL DEFAULT 0,
        lifetime_points INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(user_id)
      );
    `);

    // Create recently_viewed table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS recently_viewed (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
        viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(user_id, product_id)
      );
    `);

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
      CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
      CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
      CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
      CREATE INDEX IF NOT EXISTS idx_chat_sender ON chat_messages(sender_id);
      CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
    `);

    // Create trigger function for updated_at
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Create triggers
    await pool.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      
      DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
      CREATE TRIGGER update_profiles_updated_at
        BEFORE UPDATE ON profiles
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      
      DROP TRIGGER IF EXISTS update_products_updated_at ON products;
      CREATE TRIGGER update_products_updated_at
        BEFORE UPDATE ON products
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      
      DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
      CREATE TRIGGER update_orders_updated_at
        BEFORE UPDATE ON orders
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      
      DROP TRIGGER IF EXISTS update_loyalty_points_updated_at ON loyalty_points;
      CREATE TRIGGER update_loyalty_points_updated_at
        BEFORE UPDATE ON loyalty_points
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `);

    // Create function to update loyalty points on order completion
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_loyalty_points()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
          INSERT INTO loyalty_points (user_id, points, lifetime_points)
          VALUES (NEW.user_id, FLOOR(NEW.total_amount / 100), FLOOR(NEW.total_amount / 100))
          ON CONFLICT (user_id) 
          DO UPDATE SET 
            points = loyalty_points.points + FLOOR(NEW.total_amount / 100),
            lifetime_points = loyalty_points.lifetime_points + FLOOR(NEW.total_amount / 100),
            updated_at = NOW();
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await pool.query(`
      DROP TRIGGER IF EXISTS on_order_completed ON orders;
      CREATE TRIGGER on_order_completed
        AFTER UPDATE ON orders
        FOR EACH ROW
        EXECUTE FUNCTION update_loyalty_points();
    `);

    console.log('Database migrations completed');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
}

export default db;

