import React, { useState, useEffect } from "react";
import axios from "axios";

interface CouncilMember {
  id: number;
  name: string;
  photo_url: string;
  position: string;
  previous_positions: string;
  term_start: string;
  term_end: string;
  party_affiliation: string;
  supported_projects: string;
  key_initiatives: string;
  key_votes: string;
  policy_stances: string;
  committee_memberships: string;
  education: string;
  awards: string;
  controversies: string | null;
  notable_achievements: string;
  focus_areas: string;
  email: string;
  phone_number: string | null;
  current_council_member: boolean;
}

const Member: React.FC = () => {
  const [councilMembers, setCouncilMembers] = useState<CouncilMember[]>([]);
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedParty, setSelectedParty] = useState("all");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [showCurrentMembers, setShowCurrentMembers] = useState(false);
  const [expandedSection, setExpandedSection] = useState<{
    id: number;
    section: "personal" | "political" | "contact" | null;
  } | null>(null);

  useEffect(() => {
    const fetchCouncilMembers = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL; // Use environment variable for the backend URL
        if (!backendUrl) {
          console.error("Backend URL is not defined. Please check your .env file.");
          return;
        }
        const response = await axios.get(`${backendUrl}/api/council-members`);
        setCouncilMembers(response.data);
      } catch (error) {
        console.error("Error fetching council member data:", error);
      }
    };
    fetchCouncilMembers();
  }, []);

  const filteredMembers = councilMembers.filter((member) => {
    const matchesYear =
      selectedYear === "all" || member.term_start.split("-")[0] === selectedYear;
    const matchesParty =
      selectedParty === "all" ||
      member.party_affiliation.toLowerCase() === selectedParty.toLowerCase();
    const matchesPosition =
      selectedPosition === "all" ||
      member.position.toLowerCase() === selectedPosition.toLowerCase();
    const matchesCurrentMember =
      !showCurrentMembers || member.current_council_member;

    return matchesYear && matchesParty && matchesPosition && matchesCurrentMember;
  });

  const years = Array.from(
    new Set(councilMembers.map((member) => member.term_start.split("-")[0]))
  ).sort((a, b) => parseInt(b) - parseInt(a));

  const parties = Array.from(
    new Set(councilMembers.map((member) => member.party_affiliation))
  ).filter((party) => party);

  const positions = Array.from(
    new Set(councilMembers.map((member) => member.position))
  ).filter((position) => position);

  return (
    <div className="h-full flex flex-col items-center space-y-6 mt-6 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <h1 className="text-5xl font-bold text-bone-white mb-4 text-center">
        Council Members
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap justify-center items-center gap-4 w-full max-w-6xl">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="p-2 border border-gray-400 rounded bg-gray-800 text-bone-white w-full sm:w-auto"
        >
          <option value="all">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
          value={selectedParty}
          onChange={(e) => setSelectedParty(e.target.value)}
          className="p-2 border border-gray-400 rounded bg-gray-800 text-bone-white w-full sm:w-auto"
        >
          <option value="all">All Parties</option>
          {parties.map((party) => (
            <option key={party} value={party}>
              {party}
            </option>
          ))}
        </select>

        <select
          value={selectedPosition}
          onChange={(e) => setSelectedPosition(e.target.value)}
          className="p-2 border border-gray-400 rounded bg-gray-800 text-bone-white w-full sm:w-auto"
        >
          <option value="all">All Positions</option>
          {positions.map((position) => (
            <option key={position} value={position}>
              {position}
            </option>
          ))}
        </select>

        <label className="flex items-center space-x-2 text-bone-white w-full sm:w-auto">
          <input
            type="checkbox"
            checked={showCurrentMembers}
            onChange={() => setShowCurrentMembers((prev) => !prev)}
            className="w-4 h-4"
          />
          <span>Current Council Members Only</span>
        </label>
      </div>

      {/* Council Members */}
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <div key={member.id} className="bg-gray-700 p-6 rounded shadow-lg">
              <img
                src={member.photo_url}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto"
              />
              <h2 className="text-xl font-bold text-bone-white text-center mt-2">
                {member.name}
              </h2>
              <p className="text-sm text-gray-400 text-center">{member.position}</p>
              <p className="text-sm text-gray-400 text-center italic">
                Previous: {member.previous_positions}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-2 mt-4">
                <button
                  className="px-4 py-2 text-sm font-bold bg-[#6082B6] text-white rounded"
                  onClick={() =>
                    setExpandedSection((prev) =>
                      prev?.id === member.id && prev.section === "personal"
                        ? null
                        : { id: member.id, section: "personal" }
                    )
                  }
                >
                  Personal
                </button>
                <button
                  className="px-4 py-2 text-sm font-bold bg-[#6082B6] text-white rounded"
                  onClick={() =>
                    setExpandedSection((prev) =>
                      prev?.id === member.id && prev.section === "political"
                        ? null
                        : { id: member.id, section: "political" }
                    )
                  }
                >
                  Political
                </button>
                <button
                  className="px-4 py-2 text-sm font-bold bg-[#6082B6] text-white rounded"
                  onClick={() =>
                    setExpandedSection((prev) =>
                      prev?.id === member.id && prev.section === "contact"
                        ? null
                        : { id: member.id, section: "contact" }
                    )
                  }
                >
                  Contact
                </button>
              </div>
              {expandedSection?.id === member.id && (
                <div className="mt-4 bg-gray-800 p-4 rounded text-white text-sm text-left">
                  {expandedSection.section === "personal" && (
                    <>
                      <h3 className="text-md font-bold underline mb-2">Personal Details</h3>
                      <p className="mb-2"><strong>Education:</strong> {member.education}</p>
                      <p className="mb-2"><strong>Awards:</strong> {member.awards}</p>
                      {member.controversies && (
                        <p className="mb-2"><strong>Controversies:</strong> {member.controversies}</p>
                      )}
                    </>
                  )}
                  {expandedSection.section === "political" && (
                    <>
                      <h3 className="text-md font-bold underline mb-2">Political Details</h3>
                      <p className="mb-2"><strong>Key Initiatives:</strong> {member.key_initiatives}</p>
                      <p className="mb-2"><strong>Key Votes:</strong> {member.key_votes}</p>
                      <p className="mb-2"><strong>Policy Stances:</strong> {member.policy_stances}</p>
                      <p className="mb-2"><strong>Supported Projects:</strong> {member.supported_projects}</p>
                      <p className="mb-2"><strong>Committee Memberships:</strong> {member.committee_memberships}</p>
                    </>
                  )}
                  {expandedSection.section === "contact" && (
                    <>
                      <h3 className="text-md font-bold underline mb-2">Contact Details</h3>
                      <p className="mb-2">
                        <strong>Email:</strong>{" "}
                        <a href={`mailto:${member.email}`} className="text-blue-400">
                          {member.email}
                        </a>
                      </p>
                      <p className="mb-2">
                        <strong>Phone:</strong>{" "}
                        <a href={`tel:${member.phone_number}`} className="text-blue-400">
                          {member.phone_number || "Not Available"}
                        </a>
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-lg text-bone-white text-center">
            No council members found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Member;
