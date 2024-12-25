import React, { useState, useEffect } from "react";
import axios from "axios";

interface ProjectData {
  id: number;
  project_name: string;
  description: string;
  fiscal_year: string;
  department: string;
  category: string;
  budget_allocation: string;
  funding_source: string;
  start_date: string;
  end_date: string | null;
  status: string;
  stakeholders: string;
  community_impact: string;
  associated_council_members: string;
  major_initiatives: string;
}

const Projects: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/projects`);
        setProjects(response.data || []);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchProjectData();
  }, []);

  const toggleDetails = (id: number) => {
    setExpandedProjectId((prevId) => (prevId === id ? null : id));
  };

  const filteredProjects = projects.filter((project) => {
    const matchesYear =
      selectedYear === "all" || project.fiscal_year.includes(selectedYear);
    const matchesStatus =
      selectedStatus === "all" ||
      project.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesCategory =
      selectedCategory === "all" ||
      project.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesYear && matchesStatus && matchesCategory;
  });

  // Extract and sort years in ascending order
  const years = Array.from(
    new Set(
      projects
        .flatMap((project) => project.fiscal_year.split("-"))
        .map((year) => parseInt(year, 10))
    )
  )
    .filter((year) => !isNaN(year))
    .sort((a, b) => a - b)
    .map(String);

  const categories = Array.from(new Set(projects.map((project) => project.category)));

  return (
    <div className="h-full flex flex-col items-center space-y-6 mt-6 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-bone-white mb-4 text-center">
        Cupertino Projects
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-4 w-full max-w-6xl">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="min-w-[150px] p-2 border border-gray-400 rounded bg-gray-800 text-bone-white"
        >
          <option value="all">All Years</option>
          {years.map((year, index) => (
            <option key={index} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="min-w-[150px] p-2 border border-gray-400 rounded bg-gray-800 text-bone-white"
        >
          <option value="all">All Statuses</option>
          <option value="Proposed">Proposed</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="min-w-[150px] p-2 border border-gray-400 rounded bg-gray-800 text-bone-white"
        >
          <option value="all">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Projects List */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-700 p-6 rounded shadow-lg hover:shadow-xl transition"
            >
              <h2 className="text-lg sm:text-xl font-bold text-bone-white">
                {project.project_name}
              </h2>
              <p className="text-sm text-gray-400">Department: {project.department}</p>
              <p className="text-sm text-gray-400">
                Budget: ${parseFloat(project.budget_allocation).toLocaleString()}
              </p>
              <p className="text-sm text-gray-400 mb-4">Status: {project.status}</p>
              <button
                onClick={() => toggleDetails(project.id)}
                className="px-4 py-2 text-sm font-bold bg-[#6082B6] text-white rounded w-full"
              >
                {expandedProjectId === project.id ? "Hide Details" : "View Details"}
              </button>

              {/* Expanded Details */}
              {expandedProjectId === project.id && (
                <div className="mt-4 bg-gray-800 p-4 rounded text-white text-sm">
                  <h3 className="text-md font-bold underline mb-2">Project Details</h3>
                  <p className="mb-2"><strong>Description:</strong> {project.description}</p>
                  <p className="mb-2"><strong>Fiscal Year:</strong> {project.fiscal_year}</p>
                  <p className="mb-2"><strong>Funding Source:</strong> {project.funding_source}</p>
                  <p className="mb-2">
                    <strong>Associated Council Members:</strong>{" "}
                    {project.associated_council_members}
                  </p>
                  <p className="mb-2"><strong>Stakeholders:</strong> {project.stakeholders}</p>
                  <p className="mb-2">
                    <strong>Community Impact:</strong> {project.community_impact}
                  </p>
                  <p className="mb-2">
                    <strong>Major Initiatives:</strong> {project.major_initiatives}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-lg text-bone-white text-center">No projects found.</p>
      )}
    </div>
  );
};

export default Projects;
