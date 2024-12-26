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

// CORS Configuration (replace with your Vercel URL in production)
const CORS_ALLOWED_ORIGIN = "https://cupertino-taxes.vercel.app"; // Replace with "https://your-frontend.vercel.app" in production
app.use(cors({ origin: CORS_ALLOWED_ORIGIN }));
app.use(express.json());

// Serve images from the /images directory
const imagesPath = path.join(__dirname, "images");
console.log("Serving images from:", imagesPath); // Log the resolved path
app.use("/images", express.static(imagesPath));

// Error Handling Middleware for Async Functions
const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };

// Test Database Connection
app.get("/api/test-db", asyncHandler(async (req: Request, res: Response) => {
  const result = await pool.query("SELECT NOW()");
  return res.json({ message: "Database connection successful!", time: result.rows[0].now });
}));

// Tax Records Endpoint
app.get(
  "/api/tax-records",
  asyncHandler(async (req: Request, res: Response) => {
    const result = await pool.query("SELECT * FROM tax_records ORDER BY id ASC");
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No tax records found." });
    }
    return res.json(result.rows);
  })
);

// Error Handling Middleware
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  const error = err as Error; // Explicitly cast to Error
  console.error("Unhandled error:", error.message);
  res.status(500).json({ error: "Internal server error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
