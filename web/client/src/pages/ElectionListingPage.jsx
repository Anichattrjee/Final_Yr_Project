import React, { useState, useEffect } from "react";
import { getAllElections } from "../apiCalls/apis"; // Adjust import path
import { Link } from "react-router-dom";

const ElectionListingPage = ({ isLoggedIn}) => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    constituency: 'all'
  });

  // Get unique constituencies for filter options
  const constituencies = [...new Set(elections.map(e => e.constituency))];

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const data = await getAllElections();
        setElections(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchElections();
  }, []);

  const filterElections = () => {
    return elections.filter(election => {
      const now = new Date();
      const statusMatch = filters.status === 'all' || 
        (filters.status === 'upcoming' && new Date(election.startDate) > now) ||
        (filters.status === 'active' && new Date(election.startDate) <= now && new Date(election.endDate) >= now) ||
        (filters.status === 'completed' && new Date(election.endDate) < now);
      
      const constituencyMatch = filters.constituency === 'all' || 
        election.constituency === filters.constituency;

      return statusMatch && constituencyMatch;
    });
  };

  const getElectionStatus = (start, end) => {
    const now = new Date();
    if (now < new Date(start)) return 'upcoming';
    if (now > new Date(end)) return 'completed';
    return 'active';
  };

  if (loading) return <div className="text-center p-8 text-blue-600">Loading elections...</div>;
  if (error) return <div className="text-center p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-lightBlue-100 text-gray-800">
      <header className="bg-blue-500 text-white p-6 shadow-md">
        <h1 className="text-3xl font-bold">Elections</h1>
        <p className="mt-2">Participate in democratic process</p>
      </header>

      <main className="container mx-auto p-8">
        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-blue-800 mb-2">Status</label>
            <select 
              className="w-full p-2 border border-blue-200 rounded"
              value={filters.status}
              onChange={e => setFilters({...filters, status: e.target.value})}
            >
              <option value="all">All Statuses</option>
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div>
            <label className="block text-blue-800 mb-2">Constituency</label>
            <select 
              className="w-full p-2 border border-blue-200 rounded"
              value={filters.constituency}
              onChange={e => setFilters({...filters, constituency: e.target.value})}
            >
              <option value="all">All Constituencies</option>
              {constituencies.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Elections Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filterElections().map(election => {
            const status = getElectionStatus(election.startDate, election.endDate);
            const canVote = status === 'active' && isLoggedIn;

            return (
              <div key={election._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className={`p-4 ${status === 'active' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <h3 className="text-xl font-semibold text-blue-800">{election.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{election.constituency}</p>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between text-sm mb-4">
                    <div>
                      <p className="font-medium">Starts:</p>
                      <p>{new Date(election.startDate).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="font-medium">Ends:</p>
                      <p>{new Date(election.endDate).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      status === 'upcoming' ? 'bg-blue-200 text-blue-800' :
                      status === 'active' ? 'bg-green-200 text-green-800' :
                      'bg-gray-200 text-gray-800'
                    }`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>

                    {status === 'completed' ? (
  <Link 
    to={`/elections/${election._id}/results`}
    className="text-blue-600 hover:underline"
  >
    View Results
  </Link>
) : (
  <Link 
    to={`/elections/${election._id}`}
    className={`px-4 py-2 rounded ${
      canVote 
        ? 'bg-blue-600 text-white hover:bg-blue-700'
        : 'bg-gray-400 text-gray-700 cursor-not-allowed'
    }`}
    onClick={(e) => {
      if ( !canVote) {
        e.preventDefault();
      }
    }}
  >
    {status === 'upcoming' ? 'View Details' : 'Vote Now'}
  </Link>
)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filterElections().length === 0 && (
          <div className="text-center p-8 text-gray-600">
            No elections found matching current filters
          </div>
        )}
      </main>
    </div>
  );
};

export default ElectionListingPage;