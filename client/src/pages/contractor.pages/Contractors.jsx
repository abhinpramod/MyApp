import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Card from '@/components/ui/card';
import CardContent from '@/components/ui/card-content';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { LucideUser, LucideMapPin, LucideSearch } from 'lucide-react';
import axiosInstance from '../../lib/axios';

const Contractors = () => {
  const [contractors, setContractors] = useState([]); // All contractors from the API
  const [filteredContractors, setFilteredContractors] = useState([]); // Contractors after applying search
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // Search query state

  // Fetch contractors from the backend
  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const response = await axiosInstance.get('/user/all-contractors');
        setContractors(response.data);
        setFilteredContractors(response.data); // Initialize filtered contractors with all contractors
      } catch (error) {
        console.error('Error fetching contractors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContractors();
  }, []);

  // Handle search changes
  useEffect(() => {
    applySearch();
  }, [searchQuery, contractors]);

  // Apply search
  const applySearch = () => {
    let result = contractors;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((contractor) => {
        const contractorName = contractor.contractorName?.toLowerCase() || '';
        const companyName = contractor.companyName?.toLowerCase() || '';
        const country = contractor.country?.toLowerCase() || '';
        const state = contractor.state?.toLowerCase() || '';
        const city = contractor.city?.toLowerCase() || '';
        const jobTypes = contractor.jobTypes?.map((job) => job.toLowerCase()) || [];

        return (
          contractorName.includes(query) ||
          companyName.includes(query) ||
          country.includes(query) ||
          state.includes(query) ||
          city.includes(query) ||
          jobTypes.some((job) => job.includes(query))
        );
      });
    }

    setFilteredContractors(result);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="mt-20">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">All Contractors</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden max-w-md">
            <input
              type="text"
              placeholder="Search by name, company, job type, or location..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="flex-1 px-4 py-2 outline-none"
            />
            <button className="p-3 bg-gray-100 hover:bg-gray-200 transition-colors">
              <LucideSearch className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Contractors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            Array(8)
              .fill(0)
              .map((_, index) => (
                <Skeleton key={index} className="h-40 rounded-lg" />
              ))
          ) : filteredContractors.length > 0 ? (
            filteredContractors.map((contractor) => (
              <Card
                key={contractor._id}
                className="hover:shadow-xl transition-shadow rounded-2xl overflow-hidden border border-gray-200"
              >
                <CardContent className="p-5 space-y-4">
                  {/* Header Section */}
                  <div className="flex items-center space-x-4">
                    {contractor.profilePicture ? (
                      <img
                        src={contractor.profilePicture}
                        alt={contractor.contractorName || 'Contractor'}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                      />
                    ) : (
                      <LucideUser className="w-16 h-16 text-gray-400" />
                    )}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {contractor.contractorName || 'Unnamed Contractor'}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {contractor.companyName || 'No Company'}
                      </p>
                    </div>
                  </div>

                  {/* Location Section */}
                  <div className="flex items-center text-sm text-gray-600">
                    <LucideMapPin className="w-4 h-4 mr-1 text-primary" />
                    {contractor.country || 'Unknown Country'}, {contractor.state || 'Unknown State'}, {contractor.city || 'Unknown City'}
                  </div>

                  {/* Job Types Section */}
                  <div className="flex flex-wrap gap-2">
                    {contractor.jobTypes?.map((job, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="text-xs px-3 py-1"
                      >
                        {job}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center col-span-full">No contractors found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contractors;