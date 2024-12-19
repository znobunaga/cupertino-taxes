import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Pool
const pool = new Pool({
  user: process.env.PG_USER || "postgres",
  host: process.env.PG_HOST || "localhost",
  database: process.env.PG_DATABASE || "cupertino_taxes",
  password: process.env.PG_PASSWORD || "your_password",
  port: parseInt(process.env.PG_PORT || "5432"),
});

// Test the database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
    return;
  }
  console.log("Connected to the PostgreSQL database.");
  release(); // Release the client back to the pool
});

// API Endpoints
app.get("/api/tax-records", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tax_records ORDER BY id ASC");
    res.json(result.rows); // Send data to the frontend
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching tax records:", error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
