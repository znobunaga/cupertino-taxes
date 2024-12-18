import React, { useState, useEffect } from "react";
import { FiDownload } from "react-icons/fi"; // Import a download icon

interface TaxData {
  year?: number; // Optional for "Overall Trend"
  totalTax: number;
  allocations: { [key: string]: number }; // Example: { "Education": 30, "Infrastructure": 20, "Health": 50 }
}

const User: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("2024"); // Default to the most recent year
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [taxData, setTaxData] = useState<TaxData | null>(null);

  useEffect(() => {
    // Fetch tax data from the backend
    const fetchTaxData = async () => {
      try {
        const response = await fetch(
          `/api/taxes?year=${selectedYear}&category=${selectedCategory}`
        );
        const data: TaxData = await response.json();
        setTaxData(data);
      } catch (error) {
        console.error("Error fetching tax data:", error);
      }
    };

    fetchTaxData();
  }, [selectedYear, selectedCategory]);

  return (
    <div className="h-full flex flex-col items-center space-y-6 mt-6">
      {/* Title */}
      <h1 className="text-5xl font-bold text-bone-white mb-4">
        Cupertino Resident Taxes
      </h1>

      {/* Filters and Search */}
      <div className="flex flex-wrap items-center justify-center gap-4 w-full max-w-6xl">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-[400px] max-w-[500px] p-2 h-12 border border-gray-400 rounded bg-gray-800 text-bone-white"
        />

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="min-w-[120px] p-2 h-12 border border-gray-400 rounded bg-gray-800 text-bone-white"
        >
          <option value="all">All Categories</option>
          <option value="law-enforcement">Law Enforcement</option>
          <option value="public-works">Public Works</option>
          <option value="parks-recreation">Parks & Recreation</option>
          <option value="administration">Administration</option>
          <option value="community-development">Community Development</option>
          <option value="other-services">Other Services</option>
        </select>

        {/* Year Filter */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="min-w-[150px] p-2 h-12 border border-gray-400 rounded bg-gray-800 text-bone-white"
        >
          {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016].map((year) => (
            <option key={year} value={year.toString()}>
              {year}
            </option>
          ))}
        </select>

        {/* Tax Report Button */}
        <button
          className={`flex items-center px-4 h-12 border rounded bg-gray-800 text-bone-white ${
            selectedYear === "all" ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={selectedYear === "all"}
          onClick={() => {
            if (selectedYear !== "all") {
              // Logic for downloading PDF
              console.log(`Downloading tax report for ${selectedYear}`);
            }
          }}
        >
          <FiDownload className="mr-2" />
          Tax Report
        </button>
      </div>

      {/* Display tax data */}
      {taxData ? (
        <div className="w-full max-w-4xl bg-gray-800 p-6 rounded shadow space-y-6">
          <h2 className="text-2xl font-semibold mb-4 text-bone-white">
            Tax Data for {selectedYear}
          </h2>
          <p className="text-lg mb-4">
            Average Tax Paid:{" "}
            <span className="font-bold text-yellow-300">${taxData.totalTax}</span>
          </p>
          <h3 className="text-xl font-medium mb-2">Allocations:</h3>
          <ul className="list-disc pl-6">
            {Object.entries(taxData.allocations).map(([key, value]) => (
              <li key={key} className="text-lg text-bone-white">
                {key}: {value}%
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-lg text-bone-white">Loading tax data...</p>
      )}
    </div>
  );
};

export default User;
