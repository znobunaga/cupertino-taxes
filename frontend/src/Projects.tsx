import React, { useState, useEffect } from "react";
import axios from "axios";

interface ProjectData {
  id: number;
  name: string;
  status: string;
  start_date: string;
  end_date: string | null;
  description: string;
  budget: string;
}

const Projects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectData[]>([]);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/projects`, {
          params: { year: selectedYear },
        });
        setProjects(response.data || []);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchProjectData();
  }, [selectedYear]);

  useEffect(() => {
    const filterData = () => {
      const filtered = projects.filter((project) => {
        const matchesSearch = project.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesStatus =
          selectedStatus === "all" ||
          project.status.toLowerCase() === selectedStatus.toLowerCase();
        return matchesSearch && matchesStatus;
      });
      setFilteredProjects(filtered);
    };

    filterData();
  }, [searchQuery, selectedStatus, projects]);

  return (
    <div className="h-full flex flex-col items-center space-y-6 mt-6">
      <h1 className="text-5xl font-bold text-bone-white mb-4">Cupertino Projects</h1>

      <div className="flex flex-wrap items-center justify-center gap-4 w-full max-w-6xl">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 p-2 border border-gray-400 rounded bg-gray-800 text-bone-white"
        />
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="min-w-[150px] p-2 border border-gray-400 rounded bg-gray-800 text-bone-white"
        >
          <option value="all">All</option>
          <option value="Proposed">Proposed</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="w-full max-w-4xl bg-gray-800 p-6 rounded shadow space-y-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-gray-700 p-4 rounded shadow">
              <h2 className="text-xl font-bold text-bone-white">{project.name}</h2>
              <p className="text-gray-400">{project.description}</p>
              <p className="text-sm text-gray-400">
                Budget: ${project.budget} | Status: {project.status}
              </p>
              <p className="text-sm text-gray-400">
                Start: {new Date(project.start_date).toLocaleDateString()}{" "}
                {project.end_date &&
                  `| End: ${new Date(project.end_date).toLocaleDateString()}`}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-lg text-bone-white">No projects found.</p>
      )}
    </div>
  );
};

export default Projects;
