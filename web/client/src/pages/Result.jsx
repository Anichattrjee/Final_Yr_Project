import React, { useState, useEffect } from "react";

function Result() {
  // Simulated data
  const [candidates, setCandidates] = useState([
    { name: "Alice Johnson", votes: 120 },
    { name: "Bob Smith", votes: 95 },
    { name: "Charlie Brown", votes: 80 },
  ]);

  const winner = candidates.reduce((prev, current) =>
    prev.votes > current.votes ? prev : current
  );

  return (
    <div className="bg-gradient-to-b from-blue-50 to-lightBlue-100 min-h-screen p-8">
      <header className="bg-white shadow-lg rounded-lg p-6 mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-700">Election Results</h1>
        <p className="text-gray-600 mt-2">
          Discover the winner and detailed voting stats for this election.
        </p>
      </header>

      <div className="bg-lightBlue-200 shadow-lg rounded-lg p-8 text-center mb-8">
        <h2 className="text-2xl font-bold text-blue-800">🏆 Winner</h2>
        <p className="text-3xl font-extrabold text-blue-900 mt-4">
          {winner.name}
        </p>
        <p className="text-xl text-gray-700 mt-2">Votes: {winner.votes}</p>
      </div>

      {/* Other Candidates */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Other Candidates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {candidates
            .filter((candidate) => candidate.name !== winner.name)
            .map((candidate, index) => (
              <div
                key={index}
                className="bg-lightBlue-50 p-4 rounded-md shadow-md hover:bg-lightBlue-100 transition"
              >
                <h3 className="text-lg font-bold text-gray-700">
                  {candidate.name}
                </h3>
                <p className="text-gray-600">Votes: {candidate.votes}</p>
              </div>
            ))}
        </div>
      </div>

      <footer className="mt-8 text-center text-gray-500">
        <p>© 2024 Voting System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Result;
