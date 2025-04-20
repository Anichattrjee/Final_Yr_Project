// src/components/ElectionCard.jsx
import React from "react";
import { useCountdown } from "./countdown";

const ElectionCard = ({ election }) => {
  const timeLeft = useCountdown(election.endDate);

  // Merge candidates with their results
  const candidatesWithResults = election.candidates.map(candidate => {
    const result = election.results.find(r => r.candidate === candidate._id);
    return {
      ...candidate,
      votes: result?.votes || 0,
      percentage: result?.percentage || 0
    };
  }).sort((a, b) => b.votes - a.votes);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-blue-100 p-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-blue-800">{election.title}</h2>
            <p className="text-sm text-blue-600 mt-1">
              {election.constituency} • {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-blue-800">
              Time Remaining: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
            </div>
            <div className="text-sm text-blue-600">
              Total Votes: {election.totalVotes}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Candidate Results</h3>
        <div className="space-y-3">
          {candidatesWithResults.map((candidate, index) => (
            <div key={candidate._id} className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center">
                <span className="text-blue-600 font-medium mr-2">{index + 1}.</span>
                <div>
                  <p className="font-medium text-gray-800">{candidate.username}</p>
                  <p className="text-sm text-blue-600">{candidate.candidateInfo.party}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-800">{candidate.votes} votes</p>
                <p className="text-sm text-gray-600">{candidate.percentage.toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ElectionCard;