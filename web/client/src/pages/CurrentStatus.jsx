import React, { useState, useEffect } from "react";

const CurrentStatusPage = () => {
  const [electionDateTime, setElectionDateTime] = useState("");
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    setElectionDateTime(localStorage.getItem("electionDateTime") || "Not Set");
    setCandidates(JSON.parse(localStorage.getItem("candidates")) || []);
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Current Election Status</h1>
      <p className="mb-4">Election Date: {electionDateTime}</p>
      {candidates.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold mb-2">Candidates</h2>
          <ul className="list-disc pl-6">
            {candidates.map((candidate, index) => (
              <li key={index}>{candidate}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No candidates added yet.</p>
      )}
    </div>
  );
};

export default CurrentStatusPage;
