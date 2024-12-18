import React, { useState, useEffect } from "react";

interface ProjectData {
  year?: number; // Optional for "Overall Trend"
  proposed: string[];
  inProgress: string[];
  completed: string[];
}

const Projects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState(""); // For the search bar
  const [selectedYear, setSelectedYear] = useState("2024"); // Default to the most recent year
  const [selectedStatus, setSelectedStatus] = useState("all"); // Filter for project status
  const [projectData, setProjectData] = useState<ProjectData | null>(null);

  useEffect(() => {
    // Fetch project data from the backend
    const fetchProjectData = async () => {
      try {
        const response = await fetch(`/api/projects?year=${selectedYear}`);
        const data: ProjectData = await response.json();
        setProjectData(data);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchProjectData();
  }, [selectedYear]);

  const filterProjects = (projects: string[]) => {
    if (searchQuery.trim()) {
      return projects.filter((project) =>
        project.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return projects;
  };

  const getFilteredProjects = () => {
    if (!projectData) return {};
    switch (selectedStatus) {
      case "proposed":
        return { proposed: filterProjects(projectData.proposed) };
      case "inProgress":
        return { inProgress: filterProjects(projectData.inProgress) };
      case "completed":
        return { completed: filterProjects(projectData.completed) };
      default:
        return {
          proposed: filterProjects(projectData.proposed),
          inProgress: filterProjects(projectData.inProgress),
          completed: filterProjects(projectData.completed),
        };
    }
  };

  const filteredProjects = getFilteredProjects();

  return (
    <div className="h-full flex flex-col items-center space-y-6 mt-6">
      {/* Title */}
      <h1 className="text-5xl font-bold text-bone-white mb-4">Cupertino Projects</h1>

      {/* Search bar and filters */}
      <div className="flex flex-col items-center space-y-4 w-full max-w-4xl">
        <div className="flex w-full space-x-4">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow border border-gray-400 rounded p-2 bg-gray-800 text-bone-white"
          />
          {/* Year Filter */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border border-gray-400 rounded p-2 bg-gray-800 text-bone-white"
          >
            {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016].map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-400 rounded p-2 bg-gray-800 text-bone-white"
          >
            <option value="all">All</option>
            <option value="proposed">Proposed</option>
            <option value="inProgress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Display project data */}
      {projectData ? (
        <div className="w-full max-w-4xl bg-gray-800 p-6 rounded shadow space-y-6">
          {/* Proposed Projects */}
          {filteredProjects.proposed && filteredProjects.proposed.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-yellow-300 mb-2">Proposed Projects</h2>
              <ul className="list-disc pl-6">
                {filteredProjects.proposed.map((project, index) => (
                  <li key={index} className="text-lg text-bone-white">
                    {project}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* In Progress Projects */}
          {filteredProjects.inProgress && filteredProjects.inProgress.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-blue-400 mb-2">In Progress</h2>
              <ul className="list-disc pl-6">
                {filteredProjects.inProgress.map((project, index) => (
                  <li key={index} className="text-lg text-bone-white">
                    {project}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Completed Projects */}
          {filteredProjects.completed && filteredProjects.completed.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-green-400 mb-2">Completed Projects</h2>
              <ul className="list-disc pl-6">
                {filteredProjects.completed.map((project, index) => (
                  <li key={index} className="text-lg text-bone-white">
                    {project}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* No Results */}
          {Object.values(filteredProjects).every((category) => category.length === 0) && (
            <p className="text-lg text-gray-400">No projects match your search or filters.</p>
          )}
        </div>
      ) : (
        <p className="text-lg text-bone-white">Loading project data...</p>
      )}
    </div>
  );
};

export default Projects;
