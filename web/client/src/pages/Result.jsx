import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getElectionResults } from "../apiCalls/apis";

const Result = () => {
  const { id } = useParams();
  const [electionData, setElectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getElectionResults(id);
        setElectionData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  if (loading) return <div className="text-center p-8 text-blue-600">Loading results...</div>;
  if (error) return <div className="text-center p-8 text-red-600">Error: {error}</div>;
  if (!electionData) return <div className="text-center p-8">No results found</div>;

  const { title, constituency, totalVotes, results, startDate, endDate, isResultPublished } = electionData;
  const winner = results.reduce((prev, current) => (prev.votes > current.votes ? prev : current));

  return (
    <div className="bg-gradient-to-b from-blue-50 to-lightBlue-100 min-h-screen p-8">
      <header className="bg-white shadow-lg rounded-lg p-6 mb-8 text-center relative">
        {isResultPublished && (
          <div className="absolute top-2 right-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            Official Results
          </div>
        )}
        <h1 className="text-3xl font-bold text-blue-700">{title} Results</h1>
        <p className="text-gray-600 mt-2">{constituency}</p>
        <div className="mt-4 flex justify-center gap-4 text-sm text-gray-500">
          <p>Total Votes: {totalVotes}</p>
          <p>Voting Period: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}</p>
        </div>
      </header>

      <div className="bg-lightBlue-200 shadow-lg rounded-lg p-8 text-center mb-8">
        <h2 className="text-2xl font-bold text-blue-800">🏆 Winner</h2>
        <p className="text-3xl font-extrabold text-blue-900 mt-4">
          {winner.candidate.username}
        </p>
        <div className="mt-2 space-y-1">
          <p className="text-xl text-gray-700">Party: {winner.candidate.party}</p>
          <p className="text-xl text-gray-700">{winner.votes} votes ({winner.percentage.toFixed(1)}%)</p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">Detailed Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.sort((a, b) => b.votes - a.votes).map((candidate, index) => (
            <div
              key={candidate.candidate.username}
              className="bg-blue-50 p-4 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-600 font-medium">#{index + 1}</span>
                {index === 0 && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                    Winner
                  </span>
                )}
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                {candidate.candidate.username}
              </h3>
              <p className="text-blue-600">{candidate.candidate.party}</p>
              <div className="mt-2 space-y-1">
                <p className="text-gray-600">Votes: {candidate.votes}</p>
                <p className="text-gray-600">Percentage: {candidate.percentage.toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="mt-8 text-center text-gray-500">
        <p>© 2024 Voting System. All rights reserved.</p>
        {isResultPublished ? (
          <p className="mt-2 text-sm">Certified results published on {new Date().toLocaleDateString()}</p>
        ) : (
          <p className="mt-2 text-sm text-yellow-600">Unofficial results - pending certification</p>
        )}
      </footer>
    </div>
  );
};

export default Result;