import React, { useState, useEffect } from "react";

interface TaxData {
  year?: number; // Optional for "Overall Trend"
  totalTax: number;
  allocations: { [key: string]: number }; // Example: { "Education": 30, "Infrastructure": 20, "Health": 50 }
}

const User: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState("2024"); // Default to the most recent year
  const [taxData, setTaxData] = useState<TaxData | null>(null);

  useEffect(() => {
    // Fetch tax data from the backend
    const fetchTaxData = async () => {
      try {
        const response = await fetch(
          `/api/taxes${selectedOption === "overall" ? "/overall" : `?year=${selectedOption}`}`
        );
        const data: TaxData = await response.json();
        setTaxData(data);
      } catch (error) {
        console.error("Error fetching tax data:", error);
      }
    };

    fetchTaxData();
  }, [selectedOption]);

  return (
    <div className="h-full flex flex-col items-center space-y-6 mt-6">
      {/* Title */}
      <h1 className="text-5xl font-bold text-bone-white mb-4">
        Cupertino Resident Taxes
      </h1>

      {/* Dropdown for selecting year or overall trend */}
      <div className="flex flex-col items-center space-y-4">
        <label htmlFor="year" className="text-lg font-medium text-bone-white">
          View Tax Data:
        </label>
        <select
          id="year"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="border border-gray-400 rounded p-2 bg-gray-800 text-bone-white"
        >
          {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016].map((year) => (
            <option key={year} value={year.toString()}>
              {year}
            </option>
          ))}
          <option value="overall">Overall Trend</option>
        </select>
      </div>

      {/* Display tax data */}
      {taxData ? (
        <div className="w-full max-w-2xl bg-gray-800 p-6 rounded shadow">
          {selectedOption === "overall" ? (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-bone-white">
                Cupertino Tax Trends (2016-2024)
              </h2>
              {/* Trend graph placeholder */}
              <div className="text-lg text-center">
                <p>Visual representation of trends (e.g., graph or chart).</p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-bone-white">
                Tax Data for {taxData.year}
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
            </>
          )}
        </div>
      ) : (
        <p className="text-lg text-bone-white">Loading tax data...</p>
      )}
    </div>
  );
};

export default User;
