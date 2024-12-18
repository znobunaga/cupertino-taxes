import React, { useState, useEffect } from "react";

interface ProjectData {
  year?: number; // Optional for "Overall Trend"
  proposed: string[];
  inProgress: string[];
  completed: string[];
}

const Projects: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState("2024"); // Default to the most recent year
  const [projectData, setProjectData] = useState<ProjectData | null>(null);

  useEffect(() => {
    // Fetch project data from the backend
    const fetchProjectData = async () => {
      try {
        const response = await fetch(
          `/api/projects?year=${selectedOption}`
        );
        const data: ProjectData = await response.json();
        setProjectData(data);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchProjectData();
  }, [selectedOption]);

  return (
    <div className="h-full flex flex-col items-center space-y-6 mt-6">
      {/* Title */}
      <h1 className="text-5xl font-bold text-bone-white mb-4">
        Cupertino Projects
      </h1>

      {/* Dropdown for selecting year */}
      <div className="flex flex-col items-center space-y-4">
        <label htmlFor="year" className="text-lg font-medium text-bone-white">
          View Projects by Year:
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
        </select>
      </div>

      {/* Display project data */}
      {projectData ? (
        <div className="w-full max-w-2xl bg-gray-800 p-6 rounded shadow space-y-6">
          {/* Proposed Projects */}
          <div>
            <h2 className="text-2xl font-semibold text-yellow-300 mb-2">
              Proposed Projects
            </h2>
            {projectData.proposed.length > 0 ? (
              <ul className="list-disc pl-6">
                {projectData.proposed.map((project, index) => (
                  <li key={index} className="text-lg text-bone-white">
                    {project}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-lg text-gray-400">No proposed projects for this year.</p>
            )}
          </div>

          {/* In Progress Projects */}
          <div>
            <h2 className="text-2xl font-semibold text-blue-400 mb-2">
              In Progress
            </h2>
            {projectData.inProgress.length > 0 ? (
              <ul className="list-disc pl-6">
                {projectData.inProgress.map((project, index) => (
                  <li key={index} className="text-lg text-bone-white">
                    {project}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-lg text-gray-400">No projects in progress for this year.</p>
            )}
          </div>

          {/* Completed Projects */}
          <div>
            <h2 className="text-2xl font-semibold text-green-400 mb-2">
              Completed Projects
            </h2>
            {projectData.completed.length > 0 ? (
              <ul className="list-disc pl-6">
                {projectData.completed.map((project, index) => (
                  <li key={index} className="text-lg text-bone-white">
                    {project}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-lg text-gray-400">No completed projects for this year.</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-lg text-bone-white">Loading project data...</p>
      )}
    </div>
  );
};

export default Projects;
