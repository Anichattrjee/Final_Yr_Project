import React, { useState } from "react";

const AdminDashboard = () => {
  const [electionDateTime, setElectionDateTime] = useState(
    localStorage.getItem("electionDateTime") || ""
  );
  const [candidates, setCandidates] = useState(
    JSON.parse(localStorage.getItem("candidates")) || []
  );
  const [newCandidate, setNewCandidate] = useState("");

  const handleDateChange = (e) => {
    const dateTime = e.target.value;
    setElectionDateTime(dateTime);
    localStorage.setItem("electionDateTime", dateTime);
  };

  const handleAddCandidate = () => {
    if (newCandidate.trim() === "") return;
    const updatedCandidates = [...candidates, newCandidate];
    setCandidates(updatedCandidates);
    localStorage.setItem("candidates", JSON.stringify(updatedCandidates));
    setNewCandidate("");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Election Date & Time */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Set Election Date & Time</h2>
        <input
          type="datetime-local"
          value={electionDateTime}
          onChange={handleDateChange}
          className="p-2 border rounded"
        />
      </div>

      {/* Add Candidates */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add Candidates</h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter candidate name"
            value={newCandidate}
            onChange={(e) => setNewCandidate(e.target.value)}
            className="p-2 border rounded flex-1"
          />
          <button
            onClick={handleAddCandidate}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>

      {/* Current Candidates */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Current Candidates</h2>
        {candidates.length > 0 ? (
          <ul className="list-disc pl-6">
            {candidates.map((candidate, index) => (
              <li key={index}>{candidate}</li>
            ))}
          </ul>
        ) : (
          <p>No candidates added yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
