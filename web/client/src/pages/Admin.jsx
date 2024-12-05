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

  const handleRemoveCandidate = (index) => {
    const updatedCandidates = candidates.filter((_, i) => i !== index);
    setCandidates(updatedCandidates);
    localStorage.setItem("candidates", JSON.stringify(updatedCandidates));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700">
      <div className="container mx-auto p-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">
            Admin Dashboard
          </h1>
          <p className="text-lg mt-2">
            Manage elections and candidates seamlessly.
          </p>
        </header>

        {/* Election Date & Time */}
        <section className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Set Election Date & Time
          </h2>
          <input
            type="datetime-local"
            value={electionDateTime}
            onChange={handleDateChange}
            className="p-3 border rounded-lg w-full focus:ring focus:ring-blue-300"
          />
          {electionDateTime && (
            <p className="mt-3 text-gray-500">
              Current Election Date & Time:{" "}
              <span className="font-medium text-gray-800">
                {new Date(electionDateTime).toLocaleString()}
              </span>
            </p>
          )}
        </section>

        {/* Add Candidates */}
        <section className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Add Candidates
          </h2>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Enter candidate name"
              value={newCandidate}
              onChange={(e) => setNewCandidate(e.target.value)}
              className="p-3 border rounded-lg flex-grow focus:ring focus:ring-blue-300"
            />
            <button
              onClick={handleAddCandidate}
              className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </section>

        {/* Current Candidates */}
        <section className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">
            Current Candidates
          </h2>
          {candidates.length > 0 ? (
            <ul className="space-y-2">
              {candidates.map((candidate, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border"
                >
                  <span className="font-medium text-gray-800">
                    {candidate}
                  </span>
                  <button
                    onClick={() => handleRemoveCandidate(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No candidates added yet.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
