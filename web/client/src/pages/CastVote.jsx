import React, { useState, useEffect } from "react";

const CastVotePage = ({ isLoggedIn, userName }) => {
  const [electionDateTime, setElectionDateTime] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [votedCandidate, setVotedCandidate] = useState(null);

  useEffect(() => {
    setElectionDateTime(localStorage.getItem("electionDateTime") || "Not Set");
    setCandidates(JSON.parse(localStorage.getItem("candidates")) || []);
  }, []);

  const handleVote = (candidate) => {
    if (!isLoggedIn) {
      alert("Please log in to vote!");
      return;
    }
    if (votedCandidate) {
      alert(`You have already voted for ${votedCandidate}`);
      return;
    }
    setVotedCandidate(candidate);
    alert(`You have successfully voted for ${candidate}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Cast Your Vote</h1>
      <p className="mb-4">Election Date: {electionDateTime}</p>
      {new Date(electionDateTime) > new Date() ? (
        <p>Voting not started yet. Starts at: {electionDateTime}</p>
      ) : (
        <div className="space-y-4">
          {candidates.length > 0 ? (
            candidates.map((candidate, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-white p-4 rounded shadow"
              >
                <p>{candidate}</p>
                <button
                  onClick={() => handleVote(candidate)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Vote
                </button>
              </div>
            ))
          ) : (
            <p>No candidates available for voting.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CastVotePage;
