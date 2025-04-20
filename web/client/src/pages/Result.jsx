
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCompletedElections } from "../apiCalls/apis";

const CompletedElectionsList = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompletedElections = async () => {
      try {
        const completedElections = await getCompletedElections();
        setElections(completedElections);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedElections();
  }, []);

  if (loading) return <div className="text-center p-8 text-blue-600">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="bg-gradient-to-b from-blue-50 to-lightBlue-100 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-8">Completed Elections</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {elections.map(election => (
            <div
              key={election._id}
             
              onClick={() =>{
                console.log(election);
                 navigate(`/results/${election._id}`)}}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <h2 className="text-xl font-bold text-blue-800">{election.title}</h2>
              <p className="text-sm text-blue-600 mt-2">{election.constituency}</p>
              <div className="mt-4 text-sm text-gray-600">
                <p>Voting Period: {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}</p>
                <p>Total Votes: {election.totalVotes}</p>
              </div>
            </div>
          ))}
        </div>
        {elections.length === 0 && (
          <div className="text-center p-8 text-gray-600">
            No completed elections available
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedElectionsList;