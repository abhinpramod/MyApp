// src/pages/Projects.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../lib/axios'; // Adjust the import path as needed
import toast from 'react-hot-toast';

const InterestCard = ({ interest }) => {
  return (
    <div className="p-6 mt-5 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800">{interest.name}</h3>
      <p className="text-gray-600 mt-2"><strong>Address:</strong> {interest.address}</p>
      <p className="text-gray-600 mt-2"><strong>Expected Date:</strong> {interest.expectedDate}</p>
      <p className="text-gray-600 mt-2"><strong>Job Type:</strong> {interest.jobTypes}</p>
      <p className="text-gray-600 mt-2"><strong>Phone Number:</strong> {interest.phoneNumber}</p>
      <p className="text-gray-600 mt-2"><strong>Email:</strong> {interest.email}</p>
    </div>
  );
};

const ContractorProjects = () => {
  const [interests, setInterests] = useState([]);

  // Fetch interests when the component mounts
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await axiosInstance.get('/contractor/all-interests');
        setInterests(response.data);

      } catch (error) {
        console.error('Error fetching interests:', error);
        toast.error('Failed to fetch interests');
      }
    };

    fetchInterests();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800">Interests</h1>
      <p className="text-gray-600 mt-2">View and manage your ongoing projects.</p>
      {interests.length === 0 && <p className="text-gray-600 mt-2">No projects found.</p>}
      <div className="mt-5">
        {interests.map(interest => (
          <InterestCard key={interest.id} interest={interest} />
        ))}
      </div>
    </div>
  );
};

export default ContractorProjects;