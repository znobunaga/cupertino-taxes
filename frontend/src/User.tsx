import React, { useState, useEffect } from "react";
import axios from "axios";

interface TaxData {
  id: number;
  fiscal_year: string;
  total_tax_revenue: string;
  average_tax_per_resident: string;
  population: number;
  general_fund_percentage: string;
  infrastructure_percentage: string;
  public_safety_percentage: string;
  education_percentage: string;
  community_services_percentage: string;
  sustainability_percentage: string;
  other_categories: string;
  funding_sources: string;
}

const User: React.FC = () => {
  const [filters, setFilters] = useState({ year: "2023-2024" });
  const [taxData, setTaxData] = useState<TaxData[]>([]);
  const [filteredData, setFilteredData] = useState<TaxData | null>(null);

  useEffect(() => {
    const fetchTaxData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tax-records`);
        setTaxData(response.data || []);
      } catch (error) {
        console.error("Error fetching tax data:", error);
      }
    };

    fetchTaxData();
  }, []);

  useEffect(() => {
    const yearData = taxData.find((record) => record.fiscal_year === filters.year);
    setFilteredData(yearData || null);
  }, [filters.year, taxData]);

  const categoryData = filteredData
    ? [
        {
          name: "General Fund",
          percentage: filteredData.general_fund_percentage,
          amount:
            (Number(filteredData.average_tax_per_resident) *
              Number(filteredData.general_fund_percentage)) /
            100,
        },
        {
          name: "Infrastructure",
          percentage: filteredData.infrastructure_percentage,
          amount:
            (Number(filteredData.average_tax_per_resident) *
              Number(filteredData.infrastructure_percentage)) /
            100,
        },
        {
          name: "Public Safety",
          percentage: filteredData.public_safety_percentage,
          amount:
            (Number(filteredData.average_tax_per_resident) *
              Number(filteredData.public_safety_percentage)) /
            100,
        },
        {
          name: "Education",
          percentage: filteredData.education_percentage,
          amount:
            (Number(filteredData.average_tax_per_resident) *
              Number(filteredData.education_percentage)) /
            100,
        },
        {
          name: "Community Services",
          percentage: filteredData.community_services_percentage,
          amount:
            (Number(filteredData.average_tax_per_resident) *
              Number(filteredData.community_services_percentage)) /
            100,
        },
        {
          name: "Sustainability",
          percentage: filteredData.sustainability_percentage,
          amount:
            (Number(filteredData.average_tax_per_resident) *
              Number(filteredData.sustainability_percentage)) /
            100,
        },
      ]
    : [];

  return (
    <div className="h-full flex flex-col items-center space-y-6 mt-6">
      <h1 className="text-5xl font-bold text-blue-500 mb-4">Cupertino Tax Overview</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <select
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          className="p-2 border rounded bg-gray-800 text-white"
        >
          {taxData.map((record) => (
            <option key={record.id} value={record.fiscal_year}>
              {record.fiscal_year}
            </option>
          ))}
        </select>
      </div>

      {/* Tax Data */}
      {filteredData ? (
        <div className="w-full max-w-6xl bg-gray-900 p-6 rounded shadow space-y-6">
          <h2 className="text-2xl font-bold text-green-400 text-center">
            Fiscal Year: {filteredData.fiscal_year}
          </h2>
          <p className="text-lg text-center text-white">
            Population: {filteredData.population.toLocaleString()}
          </p>
          <p className="text-lg text-center text-white">
            Average Tax Per Resident: $
            {Number(filteredData.average_tax_per_resident).toFixed(2)}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {categoryData.map((category, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded shadow text-center text-white"
              >
                <h3 className="text-lg font-bold">{category.name}</h3>
                <p className="text-sm text-gray-400">{category.percentage}%</p>
                <p className="text-md font-semibold">
                  Total: ${category.amount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-400">
                  Per Resident: ${category.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Funding Sources */}
          <div className="mt-6 text-white">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">Funding Sources</h3>
            <p>{filteredData.funding_sources}</p>
          </div>
        </div>
      ) : (
        <p className="text-lg text-red-400">No data available for the selected year.</p>
      )}
    </div>
  );
};

export default User;
