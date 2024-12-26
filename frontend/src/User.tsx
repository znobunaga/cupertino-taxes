import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

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

const COLORS = [
  "#f1dac4",
  "#a69cac",
  "#474973",
  "#d9d9d9",
  "#6d597a",
  "#b56576",
];

const User: React.FC = () => {
  const [filters, setFilters] = useState({ year: "2023-2024" });
  const [taxData, setTaxData] = useState<TaxData[]>([]);
  const [filteredData, setFilteredData] = useState<TaxData | null>(null);
  const [outerRadius, setOuterRadius] = useState(150);

  useEffect(() => {
    const fetchTaxData = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL; // Rely solely on the .env value
        if (!backendUrl) {
          console.error("Backend URL is not defined. Please check your .env file.");
          return;
        }
        const response = await axios.get(`${backendUrl}/api/tax-records`);
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

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 600) setOuterRadius(80);
      else if (width < 768) setOuterRadius(100);
      else setOuterRadius(150);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const categoryData = filteredData
    ? [
        {
          name: "General Fund",
          percentage: filteredData.general_fund_percentage,
          amount:
            (Number(filteredData.total_tax_revenue) *
              Number(filteredData.general_fund_percentage)) /
            100,
        },
        {
          name: "Infrastructure",
          percentage: filteredData.infrastructure_percentage,
          amount:
            (Number(filteredData.total_tax_revenue) *
              Number(filteredData.infrastructure_percentage)) /
            100,
        },
        {
          name: "Public Safety",
          percentage: filteredData.public_safety_percentage,
          amount:
            (Number(filteredData.total_tax_revenue) *
              Number(filteredData.public_safety_percentage)) /
            100,
        },
        {
          name: "Education",
          percentage: filteredData.education_percentage,
          amount:
            (Number(filteredData.total_tax_revenue) *
              Number(filteredData.education_percentage)) /
            100,
        },
        {
          name: "Community Services",
          percentage: filteredData.community_services_percentage,
          amount:
            (Number(filteredData.total_tax_revenue) *
              Number(filteredData.community_services_percentage)) /
            100,
        },
        {
          name: "Sustainability",
          percentage: filteredData.sustainability_percentage,
          amount:
            (Number(filteredData.total_tax_revenue) *
              Number(filteredData.sustainability_percentage)) /
            100,
        },
      ]
    : [];

  return (
    <div className="h-full flex flex-col items-center space-y-6 mt-6 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <h1 className="text-5xl font-bold text-bone-white mb-4 text-center">
        Resident Tax Overview
      </h1>

      {/* Year Filter */}
      <div className="flex flex-wrap gap-4 items-center">
        <select
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          className="p-2 border border-gray-400 rounded bg-gray-800 text-bone-white"
        >
          {taxData.map((record) => (
            <option key={record.id} value={record.fiscal_year}>
              {record.fiscal_year}
            </option>
          ))}
        </select>
      </div>

      {filteredData ? (
        <div className="w-full max-w-6xl bg-gray-900 p-6 rounded shadow space-y-6">
          <div className="bg-gray-800 p-4 rounded shadow text-center">
            <h2 className="text-2xl font-bold text-bone-white">
              Fiscal Year: {filteredData.fiscal_year}
            </h2>
          </div>
          <p className="text-lg text-center text-bone-white underline">
            Total Budget: ${Number(filteredData.total_tax_revenue).toLocaleString()}
          </p>

          {/* Funding Sources */}
          <div className="text-center text-bone-white mt-4">
            <h3 className="text-lg font-bold mb-2">Funding Sources</h3>
            <p className="text-sm">{filteredData.funding_sources}</p>
          </div>

          {/* Pie Chart */}
          <div className="w-full">
            <h3 className="text-xl font-bold text-bone-white text-center mb-4">
              Budget Distribution
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={outerRadius}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Key */}
            <div className="flex flex-wrap justify-center mt-4 space-x-4">
              {categoryData.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-sm text-bone-white"
                >
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {categoryData.map((category, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded shadow text-center text-bone-white"
              >
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <h3 className="text-lg font-bold">{category.name}</h3>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  {category.percentage}%
                </p>
                <p className="text-xl font-bold">
                  Per Resident: ${(category.amount / filteredData.population).toFixed(2)}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Total: ${category.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-lg text-red-400">No data available for the selected year.</p>
      )}
    </div>
  );
};

export default User;
