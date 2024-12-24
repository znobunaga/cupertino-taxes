import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { Pool } from "pg";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// PostgreSQL Pool
const pool = new Pool({
  user: process.env.PG_USER || "postgres",
  host: process.env.PG_HOST || "localhost",
  database: process.env.PG_DATABASE || "cupertino_taxes",
  password: process.env.PG_PASSWORD || "your_password",
  port: parseInt(process.env.PG_PORT || "5432"),
});

// Serve images from the /images directory
const imagesPath = path.join(__dirname, 'images');
console.log("Serving images from:", imagesPath); // Log the resolved path
app.use('/images', express.static(imagesPath));

// Error Handling Middleware
const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };

// Tax Records
app.get(
  "/api/tax-records",
  asyncHandler(async (req: Request, res: Response) => {
    const result = await pool.query("SELECT * FROM tax_records ORDER BY id ASC");
    res.json(result.rows);
  })
);

// API Endpoint: Get All Council Members
app.get(
  "/api/council-members",
  asyncHandler(async (req: Request, res: Response) => {
    const query = `SELECT * FROM council_members ORDER BY id ASC`;
    const result = await pool.query(query);
    res.json(result.rows);
  })
);

// Projects
app.get(
  "/api/projects",
  asyncHandler(async (req: Request, res: Response) => {
    const result = await pool.query("SELECT * FROM projects ORDER BY id ASC");
    res.json(result.rows);
  })
);

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
