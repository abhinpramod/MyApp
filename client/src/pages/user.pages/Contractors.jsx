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
  LucideLoader2,
  LucideFilter,
  LucideUsers,
  LucideBuilding
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
  const [showFilters, setShowFilters] = useState(false);
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
      <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
        <Skeleton className="h-48 w-full" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex space-x-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </div>
    ));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      <Navbar />
      <div className="container mx-auto px-4 mt-16 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Find Professional Contractors
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with skilled professionals for your construction projects
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by name, location, or job type"
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <LucideSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            {loading && searchQuery && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <LucideLoader2 className="w-5 h-5 animate-spin text-blue-500" />
              </div>
            )}
          </div>
          
          {/* Filters Toggle Button */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-blue-600 font-medium"
            >
              <LucideFilter className="mr-2 h-4 w-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
            <p className="text-sm text-gray-500">
              {contractors.length} of {total} contractors
            </p>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Employee Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <LucideUsers className="inline mr-2 h-4 w-4" />
                  Company Size
                </label>
                <select
                  value={employeeRange}
                  onChange={handleEmployeeRangeChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Sizes</option>
                  <option value="1-10">1-10 Employees</option>
                  <option value="10-20">10-20 Employees</option>
                  <option value="20-50">20-50 Employees</option>
                  <option value="50-100">50-100 Employees</option>
                  <option value="100-Infinity">100+ Employees</option>
                </select>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleAvailabilityChange("all")}
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                      availability === "all"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => handleAvailabilityChange("available")}
                    className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center transition-colors ${
                      availability === "available"
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <LucideCheckCircle className="w-4 h-4 mr-1" />
                    Available
                  </button>
                </div>
              </div>

              {/* Reset Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setEmployeeRange("");
                    setAvailability("all");
                    setSelectedJobTypes([]);
                    fetchContractors(true);
                  }}
                  className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>

            {/* Job Types Filter */}
            {allJobTypes.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <LucideBuilding className="inline mr-2 h-4 w-4" />
                  Job Specializations
                </label>
                <div className="flex flex-wrap gap-2">
                  {allJobTypes.map((jobType) => (
                    <div
                      key={jobType}
                      className={`cursor-pointer text-sm px-4 py-2 rounded-full transition-colors ${
                        selectedJobTypes.includes(jobType) 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
          </div>
        )}

        {/* Contractors Grid */}
        <InfiniteScroll
          dataLength={contractors.length}
          next={fetchContractors}
          hasMore={hasMore}
          loader={
            <div className="flex justify-center items-center py-8">
              <LucideLoader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          }
          endMessage={
            <div className="text-center py-8">
              <p className="text-gray-500">
                {contractors.length > 0 
                  ? "You've seen all available contractors" 
                  : "No contractors found matching your criteria"}
              </p>
              {contractors.length === 0 && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setEmployeeRange("");
                    setAvailability("all");
                    setSelectedJobTypes([]);
                    fetchContractors(true);
                  }}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Reset Filters
                </button>
              )}
            </div>
          }
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {loading && contractors.length === 0 ? (
            renderSkeletons()
          ) : (
            contractors.map((contractor) => (
              <Card
                key={contractor._id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                onClick={() => handleCardClick(contractor._id)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={contractor.profilePicture || "../../../public/avatar.png"}
                    alt={contractor.contractorName || "Contractor"}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {availability === "available" && contractor.available && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                        <LucideCheckCircle className="w-3 h-3 mr-1" />
                        Available
                      </div>
                    </div>
                  )}
                </div>
                <CardContent className="p-5">
                  <div className="mb-3">
                    <h2 className="text-xl font-bold text-gray-900 truncate">
                      {contractor.companyName || "Unnamed Contractor"}
                    </h2>
                    <h4 className="text-sm text-gray-500 font-medium">
                      {contractor.contractorName || "No Company"}
                    </h4>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <LucideMapPin className="w-4 h-4 mr-1 text-blue-500" />
                    <span className="truncate">
                      {contractor.city || "Unknown City"}, {contractor.state || "Unknown State"}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <LucideUsers className="w-4 h-4 mr-1 text-blue-500" />
                    <span>
                      {contractor.numberOfEmployees || "0"} Employees
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {contractor.jobTypes?.map((job, idx) => (
                      <Badge
                        key={idx}
                        className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
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