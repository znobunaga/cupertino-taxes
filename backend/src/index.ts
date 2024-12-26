import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { Pool } from "pg";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


// PostgreSQL Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Railway
  },
});

app.use(cors({ origin: "*" }));
app.use(express.json());

// Serve images from the /images directory
const imagesPath = path.join(__dirname, "images");
console.log("Serving images from:", imagesPath); // Log the resolved path
app.use("/images", express.static(imagesPath));

// Error Handling Middleware
const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };

// Test Database Connection
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "Database connection successful!", time: result.rows[0].now });
  } catch (err) {
    const error = err as Error; // Explicitly cast to Error
    console.error("Database connection error:", error.message);
    res.status(500).json({ error: "Failed to connect to the database" });
  }
});

// Tax Records
app.get(
  "/api/tax-records",
  asyncHandler(async (req: Request, res: Response) => {
    const result = await pool.query("SELECT * FROM tax_records ORDER BY id ASC");
    res.json(result.rows);
  })
);

// Error Handling Middleware
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  const error = err as Error; // Explicitly cast to Error
  console.error("Unhandled error:", error.message);
  res.status(500).json({ error: "Internal server error" });
});
