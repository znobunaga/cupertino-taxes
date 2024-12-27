import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// PostgreSQL Pool Configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false, // Use SSL in production
});

// Log current environment
console.log("Running in environment:", process.env.NODE_ENV || "development");

// CORS Configuration
const CORS_ALLOWED_ORIGIN = process.env.CORS_ORIGIN || "*"; // Fallback to allow all origins if not specified
app.use(cors({ origin: CORS_ALLOWED_ORIGIN }));
app.use(express.json());

// Error Handling Middleware for Async Functions
const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };

// Test Database Connection Endpoint
app.get(
  "/api/test-db",
  asyncHandler(async (req: Request, res: Response) => {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Database connection successful!", time: result.rows[0].now });
  })
);

// Tax Records Endpoint
app.get(
  "/api/tax-records",
  asyncHandler(async (req: Request, res: Response) => {
    const result = await pool.query("SELECT * FROM tax_records ORDER BY id ASC");
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No tax records found." });
    }
    res.json(result.rows);
  })
);

// Council Members Endpoint
app.get(
  "/api/council-members",
  asyncHandler(async (req: Request, res: Response) => {
    const result = await pool.query("SELECT * FROM council_members ORDER BY id ASC");
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No council members found." });
    }
    res.json(result.rows);
  })
);

// Error Handling Middleware
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  const error = err as Error;
  console.error("Unhandled error:", error.message);
  res.status(500).json({
    error: process.env.NODE_ENV === "production" ? "Internal server error" : error.message,
  });
});

// Test database connection before starting the server
(async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to the database successfully.");
    client.release();

    // Start the server only if the database connection is successful
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Exit the application if the database connection fails
  }
})();
