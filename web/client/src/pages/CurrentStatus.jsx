// src/pages/CurrentStatus.jsx
import React, { useState, useEffect } from "react";
import { getAllElections } from "../apiCalls/apis";
import ElectionCard from "../components/ElectionCard";

const CurrentStatusPage = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllElections();
        // Filter only active elections
        const activeElections = data.filter(election => 
          new Date() > new Date(election.startDate) && 
          new Date() < new Date(election.endDate)
        );
        setElections(activeElections);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-center p-8 text-blue-600">Loading elections...</div>;
  if (error) return <div className="text-center p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 text-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">Live Election Results</h1>
        
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {elections.map(election => (
            <ElectionCard 
              key={election._id}
              election={election}
            />
          ))}
        </div>

        {elections.length === 0 && (
          <div className="text-center p-8 text-gray-600">
            No active elections currently running
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentStatusPage;