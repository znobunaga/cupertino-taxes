import React, { useState, useEffect } from "react";

interface CouncilMember {
  name: string;
  title: string;
  bio: string;
  projectsSupported: string[];
  term: string;
  image: string; // URL for their image
}

const Member: React.FC = () => {
  const [selectedTerm, setSelectedTerm] = useState("2020-2024"); // Default to the most recent term
  const [councilMembers, setCouncilMembers] = useState<CouncilMember[]>([]);

  useEffect(() => {
    // Fetch council member data for the selected term
    const fetchCouncilMembers = async () => {
      try {
        const response = await fetch(`/api/council?term=${selectedTerm}`);
        const data: CouncilMember[] = await response.json();
        setCouncilMembers(data);
      } catch (error) {
        console.error("Error fetching council member data:", error);
      }
    };

    fetchCouncilMembers();
  }, [selectedTerm]);

  return (
    <div className="h-full flex flex-col items-center space-y-6 mt-6">
      {/* Title */}
      <h1 className="text-4xl font-bold text-bone-white mb-4">
        Understanding Your Council Members
      </h1>

      {/* Dropdown for selecting council term */}
      <div className="flex flex-col items-center space-y-4">
        <label htmlFor="term" className="text-lg font-medium text-bone-white">
          Select Council Term:
        </label>
        <select
          id="term"
          value={selectedTerm}
          onChange={(e) => setSelectedTerm(e.target.value)}
          className="border border-gray-400 rounded p-2 bg-gray-800 text-bone-white"
        >
          <option value="2020-2024">2020-2024</option>
          <option value="2016-2020">2016-2020</option>
          <option value="2012-2016">2012-2016</option>
        </select>
      </div>

      {/* Section: Meet Your City Council */}
      <div className="w-full max-w-6xl bg-gray-800 p-6 rounded shadow space-y-6">
        <h2 className="text-2xl font-semibold text-bone-white">
          Council Members ({selectedTerm})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {councilMembers.map((member, index) => (
            <div
              key={index}
              className="bg-gray-700 p-4 rounded shadow-lg space-y-4"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto"
              />
              <div className="text-center">
                <p className="text-lg font-bold text-bone-white">{member.name}</p>
                <p className="text-sm text-gray-400">{member.title}</p>
                <p className="text-sm text-gray-300 mt-2">{member.bio}</p>
              </div>
              <div className="text-left space-y-2">
                <h3 className="text-lg font-medium text-bone-white">
                  Supported Projects:
                </h3>
                <ul className="list-disc pl-6 text-gray-300">
                  {member.projectsSupported.map((project, idx) => (
                    <li key={idx}>{project}</li>
                  ))}
                </ul>
                <p className="text-sm text-gray-400 mt-2">
                  Term: {member.term}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Member;
