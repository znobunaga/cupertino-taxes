import React, { useState, useEffect } from "react";
import axios from "axios";

interface TaxData {
  id: number;
  fiscal_year: string;
  total_tax_per_resident: string;
  population_size: number;
  law_enforcement: string;
  public_works: string;
  parks_recreation: string;
  administration: string;
  community_development: string;
  other_services: string;
  [key: string]: string | number;
}

const User: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState("2023-2024");
  const [taxData, setTaxData] = useState<TaxData[]>([]);
  const [filteredData, setFilteredData] = useState<TaxData | null>(null);

  useEffect(() => {
    const fetchTaxData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tax-records`);
        setTaxData(response.data || []);
        const defaultYearData = response.data.find(
          (record: TaxData) => record.fiscal_year === selectedYear
        );
        setFilteredData(defaultYearData || null);
      } catch (error) {
        console.error("Error fetching tax data:", error);
      }
    };

    fetchTaxData();
  }, []);

  useEffect(() => {
    const yearData = taxData.find((record) => record.fiscal_year === selectedYear);
    setFilteredData(yearData || null);
  }, [selectedYear, taxData]);

  return (
    <div className="h-full flex flex-col items-center space-y-6 mt-6">
      {/* Title */}
      <h1 className="text-5xl font-bold text-bone-white mb-4">
        Cupertino Tax Breakdown
      </h1>

      {/* Year Filter */}
      <div className="flex items-center space-x-4">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="min-w-[150px] p-2 h-12 border border-gray-400 rounded bg-gray-800 text-bone-white"
        >
          {taxData.map((record) => (
            <option key={record.id} value={record.fiscal_year}>
              {record.fiscal_year}
            </option>
          ))}
        </select>
      </div>

      {/* Data Display */}
      {filteredData ? (
        <div className="w-full max-w-6xl bg-gray-800 p-6 rounded shadow space-y-6">
          {/* Total Taxes */}
          <div className="flex flex-col items-center space-y-2">
            <h2 className="text-3xl font-semibold text-blue-400">
              Fiscal Year: {filteredData.fiscal_year}
            </h2>
            <p className="text-xl text-bone-white">
              Total Tax Per Resident: $
              <span className="font-bold text-green-400">
                {filteredData.total_tax_per_resident}
              </span>
            </p>
          </div>

          {/* Tax Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-4">
            {[
              "law_enforcement",
              "public_works",
              "parks_recreation",
              "administration",
              "community_development",
              "other_services",
            ].map((category) => (
              <div
                key={category}
                className="p-4 bg-gray-700 rounded shadow flex flex-col items-center space-y-2"
              >
                <p className="text-lg text-bone-white capitalize">
                  {category.replace("_", " ")}
                </p>
                <p className="text-xl font-bold text-green-400">
                  ${filteredData[category]}
                </p>
                <p className="text-sm text-gray-400">
                  {filteredData[`${category}_percent`]}% of Total Taxes
                </p>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-6">
            <h3 className="text-2xl font-semibold text-blue-400 mb-4">
              Additional Information
            </h3>
            <ul className="list-disc pl-6 text-bone-white text-lg">
              <li>Population Size: {filteredData.population_size}</li>
              <li>Property Tax Revenue: ${filteredData.property_tax_revenue}</li>
              <li>Sales Tax Revenue: ${filteredData.sales_tax_revenue}</li>
              <li>Business Tax Revenue: ${filteredData.business_tax_revenue}</li>
              <li>Major Initiatives: {filteredData.major_initiatives}</li>
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-lg text-bone-white">
          No data available for the selected year.
        </p>
      )}
    </div>
  );
};

export default User;
