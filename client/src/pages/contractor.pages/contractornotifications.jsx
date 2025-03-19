import React, { useState, useEffect } from 'react';
import axiosInstance from '../../lib/axios'; // Adjust the import path as needed
import toast from 'react-hot-toast';
import { CheckCheck } from 'lucide-react';

const InterestCard = ({ interest, onMarkAsSeen }) => {
  const handleMarkAsSeen = async (interest) => {
    console.log('Interest ID:', interest);
    
    
    try {
      await axiosInstance.patch(`/contractor/mark-interest-seen/${interest}`);
      toast.success('Marked as seen');
    //   onMarkAsSeen(interest.id);
    } catch (error) {
      console.error('Error marking interest as seen:', error);
      toast.error('Failed to mark as seen');
    }
  };

  return (
    <div className="p-6 mt-5 bg-white rounded-2xl shadow-lg border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl">
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{interest.name}</h3>
      <div className="space-y-2">
        <p className="text-gray-700"><span className="font-semibold">Address:</span> {interest.address}</p>
        <p className="text-gray-700"><span className="font-semibold">Expected Date:</span> {interest.expectedDate}</p>
        <p className="text-gray-700"><span className="font-semibold">Job Type:</span> {interest.jobTypes}</p>
        <p className="text-gray-700"><span className="font-semibold">Phone Number:</span> {interest.phoneNumber}</p>
        <p className="text-gray-700"><span className="font-semibold">Email:</span> {interest.email}</p>
      </div>
      <button
        onClick={ () => handleMarkAsSeen(interest._id)}
        className="mt-4 px-4 py-2 text-white bg-red-500 display flex items-center gap-2 text-dark rounded-lg hover:bg-red-600 transition-colors"
      >
        Mark as Seen <CheckCheck />
      </button>
    </div>
  );
};

const ContractorNotifications = () => {
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await axiosInstance.get('/contractor/all-interests');
        const filteredInterests = response.data.filter(
            (interest) => !interest.seeenByContractor
          );
          setInterests(filteredInterests);
      } catch (error) {
        console.error('Error fetching interests:', error);
        toast.error('Failed to fetch interests');
      }
    };

    fetchInterests();
  }, []);

  const handleMarkAsSeen = (id) => {
    setInterests(interests.filter((interest) => interest.id !== id));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900">Interests notifications</h1>
      <p className="text-lg text-gray-600 mt-2">View and manage your  projects.</p>
      {interests.length === 0 && (
        <p className="text-gray-500 mt-6 text-center">No projects found.</p>
      )}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interests.map((interest) => (
          <InterestCard key={interest._id} interest={interest} onMarkAsSeen={handleMarkAsSeen} />
        ))}
      </div>
    </div>
  );
};

export default ContractorNotifications;
