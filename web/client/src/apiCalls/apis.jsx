// src/api/authApi.js
import { axiosInstance } from "./axiosInstance";

const api = axiosInstance();

// — Register a new user (voter or candidate) —  
// userData should include:
//   { username, email, password, voterID, role }
// if role === 'candidate', it may also include:
//   { party, position, constituency }
export const registerUser = async (userData) => {
  const res = await api.post("/api/auth/register", userData);
  return res.data; // { message: 'Registration successful, awaiting approval if candidate' }
};

// — Login —  
// creds: { email, password }
export const loginUser = async (creds) => {
  const res = await api.post("/api/auth/login", creds);
  const { token, user } = res.data;

  // persist token for future requests
  localStorage.setItem("token", token);

  return user; 
};

// — Logout —  
// Simply remove token from storage
export const logoutUser = () => {
  localStorage.removeItem("token");
};

// — Request a password‐reset token —  
// email: string

export const getCompletedElections = async () => {
  const res = await api.get('/api/elections/results');
  return res.data;
};

export const requestPasswordReset = async (email) => {
  const res = await api.post("/api/auth/reset-password-request", { email });
  return res.data; // { message, resetToken } (in prod you’d email it instead)
};

export const resetPassword = async (token, newPassword) => {
  const res = await api.post("/api/auth/reset-password", { token, newPassword });
  return res.data; // { message: 'Password reset successful' }
};


export const getPendingCandidates = async () => {
    const response = await api.get("/api/admin/pending-candidates");
    return response.data;
  };

  export const setCandidateApproval = async (candidateId, approved) => {
    const response = await api.post(
      `/api/admin/approve-candidate/${candidateId}`,
      { approved }
    );
    return response.data;
  };

  export const getApprovedCandidates = async () => {
    const res = await api.get('/api/admin/approved-candidates');
    return res.data;
  };
  

  export const getAllElections = async () => {
    const res = await api.get("/api/elections");
    return res.data;
  };
  
  export const getElectionById = async (electionId) => {
    const res = await api.get(`/api/elections/${electionId}`);
    return res.data;
  };
  
  export const createElection = async (electionData) => {
    const res = await api.post("/api/elections", electionData);
    return res.data;
  };
  
  // ——— Voting Actions ———
  export const castVote = async (electionId, candidateId) => {
    const res = await api.post(`/api/elections/${electionId}/vote`, { candidateId });
    return res.data;
  };
  
  export const getMyVotingHistory = async (userId) => {
    const res = await api.post("/api/elections/my-voting-history", { userId });
    return res.data;
  };
  
  // ——— Admin Controls ———
  export const endElection = async (electionId) => {
    const res = await api.post(`/api/elections/${electionId}/end`);
    return res.data;
  };
  export const startElection = async (electionId) => {
    const res = await api.patch(`/api/elections/${electionId}/start`);
    return res.data;
  };
  export const getElectionResults = async (electionId) => {
    console.log("Fetching election results...", electionId);
    const res = await api.get(`/api/elections/results/${electionId}`);
    return res.data;
  };

  export const deleteElection = async (electionId) => {
    const res = await api.delete(`/api/elections/${electionId}`);
    return res.data;
  };

  
  // ——— Candidate Management ———
  export const getElectionCandidates = async (electionId) => {
    const res = await api.get(`/api/elections/${electionId}`);
    return res.data.candidates;
  };
  export const getCandidateElections = async (candidateId) => {
    const res = await api.get(`/api/elections/${candidateId}/elections`);
    return res.data;
  };