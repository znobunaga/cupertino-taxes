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
  contact_email: string;
  contact_phone: string;
}

const Member: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [councilMembers, setCouncilMembers] = useState<CouncilMember[]>([]);

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

  const filteredMembers = councilMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col items-center space-y-6 mt-6">
      <h1 className="text-5xl font-bold text-bone-white mb-4">Council Members</h1>
      <div className="flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow p-2 border border-gray-400 rounded bg-gray-800 text-bone-white"
        />
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
                <h2 className="text-lg font-bold text-bone-white text-center">
                  {member.name}
                </h2>
                <p className="text-sm text-gray-400 text-center">{member.position}</p>
                <p className="text-sm text-gray-300 mt-2">{member.supported_projects}</p>
                <p className="text-sm text-gray-400">
                  Term: {member.term_start} - {member.term_end}
                </p>
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
