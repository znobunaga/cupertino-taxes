"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// PostgreSQL Pool Configuration
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false, // Use SSL in production
});
// Log current environment
console.log("Running in environment:", process.env.NODE_ENV || "development");
// CORS Configuration
const CORS_ALLOWED_ORIGIN = process.env.CORS_ORIGIN || "*"; // Fallback to allow all origins if not specified
app.use((0, cors_1.default)({ origin: CORS_ALLOWED_ORIGIN }));
app.use(express_1.default.json());
// Error Handling Middleware for Async Functions
const asyncHandler = (fn) => (req, res, next) => {
    fn(req, res, next).catch(next);
};
// Test Database Connection Endpoint
app.get("/api/test-db", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query("SELECT NOW()");
    res.json({ message: "Database connection successful!", time: result.rows[0].now });
})));
// Tax Records Endpoint
app.get("/api/tax-records", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query("SELECT * FROM tax_records ORDER BY id ASC");
    if (result.rows.length === 0) {
        return res.status(404).json({ error: "No tax records found." });
    }
    res.json(result.rows);
})));
// Council Members Endpoint
app.get("/api/council-members", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query("SELECT * FROM council_members ORDER BY id ASC");
    if (result.rows.length === 0) {
        return res.status(404).json({ error: "No council members found." });
    }
    res.json(result.rows);
})));
// Projects Endpoint
app.get("/api/projects", asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query("SELECT * FROM projects ORDER BY id ASC");
    if (result.rows.length === 0) {
        return res.status(404).json({ error: "No projects found." }); // Corrected error message
    }
    res.json(result.rows);
})));
// Error Handling Middleware
app.use((err, req, res, next) => {
    const error = err;
    console.error("Unhandled error:", error.message);
    res.status(500).json({
        error: process.env.NODE_ENV === "production" ? "Internal server error" : error.message,
    });
});
// Test database connection before starting the server
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield pool.connect();
        console.log("Connected to the database successfully.");
        client.release();
        // Start the server only if the database connection is successful
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1); // Exit the application if the database connection fails
    }
}))();
