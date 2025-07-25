import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

let pool: Pool | null = null;
let db: any = null;

// Initialize database connection with connection pooling
if (process.env.DATABASE_URL) {
  neonConfig.webSocketConstructor = ws;
  
  pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    max: 10,                    // Maximum connections in pool
    idleTimeoutMillis: 30000,   // Close idle connections after 30s
    connectionTimeoutMillis: 5000, // Connection timeout
  });
  
  db = drizzle({ client: pool, schema });
  
  // Test connection on startup
  pool.connect()
    .then(() => console.log('Database connection pool initialized'))
    .catch(err => console.error('Database connection failed:', err));
}

export { pool, db };