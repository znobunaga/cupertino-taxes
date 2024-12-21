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
  contact_email: string;
  contact_phone: string;
}

const Member: React.FC = () => {
  const [councilMembers, setCouncilMembers] = useState<CouncilMember[]>([]);
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedParty, setSelectedParty] = useState("all");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [expandedSection, setExpandedSection] = useState<{
    id: number;
    section: "personal" | "political" | "contact" | null;
  } | null>(null);

  useEffect(() => {
    const fetchCouncilMembers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/council-members`);
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

    return matchesYear && matchesParty && matchesPosition;
  });

  return (
    <div className="h-full flex flex-col items-center space-y-6 mt-6">
      <h1 className="text-5xl font-bold text-bone-white mb-4">Council Members</h1>
      <div className="flex flex-wrap items-center gap-4">
        {/* Year Filter */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="p-2 border border-gray-400 rounded bg-gray-800 text-bone-white"
        >
          <option value="all">All Years</option>
          {Array.from(
            new Set(
              councilMembers.map((member) => member.term_start.split("-")[0])
            )
          )
            .sort((a, b) => parseInt(b) - parseInt(a))
            .map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
        </select>

        {/* Party Filter */}
        <select
          value={selectedParty}
          onChange={(e) => setSelectedParty(e.target.value)}
          className="p-2 border border-gray-400 rounded bg-gray-800 text-bone-white"
        >
          <option value="all">All Parties</option>
          {Array.from(new Set(councilMembers.map((member) => member.party_affiliation)))
            .filter((party) => party) // Exclude null/empty values
            .map((party) => (
              <option key={party} value={party}>
                {party}
              </option>
            ))}
        </select>

        {/* Position Filter */}
        <select
          value={selectedPosition}
          onChange={(e) => setSelectedPosition(e.target.value)}
          className="p-2 border border-gray-400 rounded bg-gray-800 text-bone-white"
        >
          <option value="all">All Positions</option>
          {Array.from(new Set(councilMembers.map((member) => member.position)))
            .filter((position) => position) // Exclude null/empty values
            .map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
        </select>
      </div>

      <div className="w-full max-w-6xl">
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <div key={member.id} className="bg-gray-700 p-4 rounded shadow-lg">
                <img
                  src={member.photo_url}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto"
                />
                <h2 className="text-xl font-bold text-bone-white text-center">
                  {member.name}
                </h2>

                {/* Buttons for expanding sections */}
                <div className="flex justify-center gap-2 mt-4">
                  <button
                    className={`px-2 py-1 text-xs rounded ${
                      expandedSection?.id === member.id &&
                      expandedSection.section === "personal"
                        ? "bg-gray-900 text-bone-white"
                        : "bg-gray-800 text-gray-300"
                    }`}
                    onClick={() =>
                      setExpandedSection((prev) =>
                        prev?.id === member.id &&
                        prev.section === "personal"
                          ? null
                          : { id: member.id, section: "personal" }
                      )
                    }
                  >
                    Personal
                  </button>
                  <button
                    className={`px-2 py-1 text-xs rounded ${
                      expandedSection?.id === member.id &&
                      expandedSection.section === "political"
                        ? "bg-gray-900 text-bone-white"
                        : "bg-gray-800 text-gray-300"
                    }`}
                    onClick={() =>
                      setExpandedSection((prev) =>
                        prev?.id === member.id &&
                        prev.section === "political"
                          ? null
                          : { id: member.id, section: "political" }
                      )
                    }
                  >
                    Political
                  </button>
                  <button
                    className={`px-2 py-1 text-xs rounded ${
                      expandedSection?.id === member.id &&
                      expandedSection.section === "contact"
                        ? "bg-gray-900 text-bone-white"
                        : "bg-gray-800 text-gray-300"
                    }`}
                    onClick={() =>
                      setExpandedSection((prev) =>
                        prev?.id === member.id &&
                        prev.section === "contact"
                          ? null
                          : { id: member.id, section: "contact" }
                      )
                    }
                  >
                    Contact
                  </button>
                </div>

                {/* Expanded Content */}
                {expandedSection?.id === member.id && (
                  <div className="mt-4">
                    {expandedSection.section === "personal" && (
                      <div className="space-y-2">
                        <h3 className="text-md font-bold text-bone-white">
                          Personal Details
                        </h3>
                        <p className="text-sm text-gray-300">
                          <strong>Education:</strong> {member.education}
                        </p>
                        <p className="text-sm text-gray-300">
                          <strong>Awards:</strong> {member.awards}
                        </p>
                        {member.controversies && (
                          <p className="text-sm text-gray-300">
                            <strong>Controversies:</strong> {member.controversies}
                          </p>
                        )}
                      </div>
                    )}
                    {expandedSection.section === "political" && (
                      <div className="space-y-2">
                        <h3 className="text-md font-bold text-bone-white">
                          Political Details
                        </h3>
                        <p className="text-sm text-gray-300">
                          <strong>Key Initiatives:</strong> {member.key_initiatives}
                        </p>
                        <p className="text-sm text-gray-300">
                          <strong>Focus Areas:</strong> {member.focus_areas}
                        </p>
                        <p className="text-sm text-gray-300">
                          <strong>Notable Achievements:</strong>{" "}
                          {member.notable_achievements}
                        </p>
                      </div>
                    )}
                    {expandedSection.section === "contact" && (
                      <div className="space-y-2">
                        <h3 className="text-md font-bold text-bone-white">
                          Contact Details
                        </h3>
                        <p className="text-sm text-gray-300">
                          <strong>Email:</strong>{" "}
                          <a href={`mailto:${member.contact_email}`} className="text-blue-400">
                            {member.contact_email}
                          </a>
                        </p>
                        <p className="text-sm text-gray-300">
                          <strong>Phone:</strong>{" "}
                          <a href={`tel:${member.contact_phone}`} className="text-blue-400">
                            {member.contact_phone}
                          </a>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">No council members found.</p>
        )}
      </div>
    </div>
  );
};

export default Member;
