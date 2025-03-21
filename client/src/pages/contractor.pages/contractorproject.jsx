import React, { useState, useEffect } from 'react';
import axiosInstance from '../../lib/axios'; // Adjust the import path as needed
import toast from 'react-hot-toast';
import { LucideCheckCircle, LucideClock,Badge } from 'lucide-react';

  const statusIcon = (status) => {
    switch (status) {
      case true:
        return <LucideCheckCircle className="text-green-500" />;
      case false:
        return <LucideClock className="text-yellow-500" />;
      default:
        return null;
    }
  };

const InterestCard = ({ interest }) => {
  return (
    <div className="p-6 mt-5 bg-white rounded-2xl shadow-lg border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl">
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{interest.name}</h3>
      <div className="space-y-2">
        <p className="text-gray-700"><span className="font-semibold">Address:</span> {interest.address}</p>
        <p className="text-gray-700"><span className="font-semibold">Expected Date:</span> {interest.expectedDate}</p>
        <p className="text-gray-700"><span className="font-semibold">Job Type:</span> {interest.jobTypes}</p>
        <p className="text-gray-700"><span className="font-semibold">Phone Number:</span> {interest.phoneNumber}</p>
        <p className="text-gray-700"><span className="font-semibold">Email:</span> {interest.email}</p>
        <div className="flex items-center gap-2 mt-2">
                          {statusIcon(interest.seenByContractor)}
                          <Badge
                            color={
                              interest.seenByContractor ? "success" : "warning"
                            }
                          >
                            {interest.seenByContractor ? "Seen" : "Pending"}
                          </Badge>
                        </div>
      </div>
    </div>
  );
};

const ContractorProjects = () => {
  const [interests, setInterests] = useState([]);

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
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900">Interests</h1>
      <p className="text-lg text-gray-600 mt-2">View and manage your ongoing projects.</p>
      {interests.length === 0 && (
        <p className="text-gray-500 mt-6 text-center">No projects found.</p>
      )}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interests.map((interest) => (
          <InterestCard key={interest._id} interest={interest} />
        ))}
      </div>
    </div>
  );
};

export default ContractorProjects;
  