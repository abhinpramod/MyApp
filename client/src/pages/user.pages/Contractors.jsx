import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Card from "@/components/ui/card";
import CardContent from "@/components/ui/card-content";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  LucideMapPin, 
  LucideCheckCircle, 
  LucideXCircle, 
  LucideSearch,
  LucideLoader2 
} from "lucide-react";
import axiosInstance from "../../lib/axios";
import InfiniteScroll from "react-infinite-scroll-component";

const Contractors = () => {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [employeeRange, setEmployeeRange] = useState("");
  const [availability, setAvailability] = useState("all");
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const { JobType: paramJobType } = useParams();
  const searchTimeoutRef = useRef(null);

  // Initialize with URL param if present
  useEffect(() => {
    if (paramJobType) {
      setSelectedJobTypes([paramJobType]);
    }
  }, [paramJobType]);

  const fetchContractors = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      const currentPage = reset ? 1 : page;
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: 5,
        availability: availability,
      });

      if (searchQuery.trim() !== '') {
        params.append('search', searchQuery);
      }

      if (employeeRange !== '') {
        params.append('employeeRange', employeeRange);
      }

      // Add each job type as separate parameter (jobTypes[]=type1&jobTypes[]=type2)
      selectedJobTypes.forEach(type => {
        params.append('jobTypes', type);
      });

      const response = await axiosInstance.get(`/user/contractors?${params.toString()}`);
      
      if (reset) {
        setContractors(response.data.contractors);
        setPage(2);
      } else {
        setContractors(prev => [...prev, ...response.data.contractors]);
        setPage(prev => prev + 1);
      }
      
      setTotal(response.data.total);
      setHasMore(response.data.hasMore);
    } catch (error) {
      console.error("Error fetching contractors:", error);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, employeeRange, availability, selectedJobTypes]);

  // Debounced search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      fetchContractors(true);
    }, 500);
  };

  // Immediate filter changes
  const handleEmployeeRangeChange = (e) => {
    setEmployeeRange(e.target.value);
    fetchContractors(true);
  };

  const handleAvailabilityChange = (value) => {
    setAvailability(value);
    fetchContractors(true);
  };

  const handleJobTypeClick = (jobType) => {
    setSelectedJobTypes(prev => {
      const newTypes = prev.includes(jobType)
        ? prev.filter(type => type !== jobType)
        : [...prev, jobType];
      return newTypes;
    });
    
    // Use timeout to ensure state is updated before fetch
    setTimeout(() => fetchContractors(true), 0);
  };

  // Initial load and when dependencies change
  useEffect(() => {
    fetchContractors(true);
  }, [availability, employeeRange, selectedJobTypes]);

  const handleCardClick = (contractorId) => {
    navigate(`/contractor/contractorprofileforuser/${contractorId}`);
  };

  // Get unique job types from current contractors
  const allJobTypes = useMemo(() => {
    const types = new Set();
    contractors.forEach(contractor => {
      (contractor.jobTypes || []).forEach(type => types.add(type));
    });
    return Array.from(types);
  }, [contractors]);

  const renderSkeletons = useCallback(() => {
    return Array(4).fill(0).map((_, index) => (
      <Skeleton key={index} className="h-64 rounded-lg" />
    ));
  }, []);

  return (
    <div className="mt-20">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center">
          Contractors
        </h1>

        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          {/* Employee Range Filter */}
          <div className="flex items-center space-x-4">
            <label htmlFor="employeeRange" className="text-sm font-medium text-gray-700">
              Filter by Employees:
            </label>
            <select
              id="employeeRange"
              value={employeeRange}
              onChange={handleEmployeeRangeChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All</option>
              <option value="1-10">1-10</option>
              <option value="10-20">10-20</option>
              <option value="20-50">20-50</option>
              <option value="50-100">50-100</option>
              <option value="100-Infinity">100+</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by name, location, or job type"
              className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <LucideSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            {loading && searchQuery && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <LucideLoader2 className="w-4 h-4 animate-spin text-gray-500" />
              </div>
            )}
          </div>

          {/* Availability Filter */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Availability:</label>
            <div className="flex space-x-2">
              <button
                onClick={() => handleAvailabilityChange("all")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  availability === "all"
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleAvailabilityChange("available")}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  availability === "available"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <LucideCheckCircle className="w-4 h-4" />
                <span>Available</span>
              </button>
            </div>
          </div>
        </div>

        {/* Job Types Filter */}
        {allJobTypes.length > 0 && (
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 block mb-2">Job Types:</label>
            <div className="flex flex-wrap gap-2">
              {allJobTypes.map((jobType) => (
                <div
                  key={jobType}
                  variant={selectedJobTypes.includes(jobType) ? "default" : "secondary"}
                  className={`cursor-pointer text-xs px-3 py-1 ${
                    selectedJobTypes.includes(jobType) ? 'bg-primary text-white' : ''
                  }`}
                  onClick={() => handleJobTypeClick(jobType)}
                >
                  {jobType}
                  {selectedJobTypes.includes(jobType) && (
                    <span className="ml-1">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Infinite Scroll Container */}
        <InfiniteScroll
          dataLength={contractors.length}
          next={fetchContractors}
          hasMore={hasMore}
          loader={
            <div className="flex justify-center items-center p-4">
              <LucideLoader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          }
          endMessage={
            <p className="text-center text-gray-500 mt-4">
              {contractors.length > 0 ? "You've seen all contractors" : "No contractors found"}
            </p>
          }
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {loading && contractors.length === 0 ? (
            renderSkeletons()
          ) : (
            contractors.map((contractor) => (
              <Card
                key={contractor._id}
                className="hover:shadow-lg transition-shadow rounded-lg overflow-hidden border border-gray-200 cursor-pointer"
                onClick={() => handleCardClick(contractor._id)}
              >
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={contractor.profilePicture || "../../../public/avatar.png"}
                    alt={contractor.contractorName || "Contractor"}
                    className="w-full h-full object-cover"
                  />
                </div>

                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                        {contractor.companyName || "Unnamed Contractor"}
                      </h2>
                      <h4 className="text-sm text-gray-500 font-semibold">
                        {contractor.contractorName || "No Company"}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Employees: {contractor.numberOfEmployees || "0"} Employees
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <LucideMapPin className="w-4 h-4 mr-1 text-primary" />
                    {contractor.country || "Unknown Country"},{" "}
                    {contractor.state || "Unknown State"},{" "}
                    {contractor.city || "Unknown City"}
                  </div>

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
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Contractors;