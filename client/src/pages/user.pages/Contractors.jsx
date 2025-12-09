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
  LucideBuilding,
  LucideArrowRight
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
    // === BACKGROUND: Light Teal Gradient ===
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 mt-16 py-10 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Connect with <span className="text-teal-600">Skilled Professionals</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Search, filter, and find the perfect contractor for your next project.
          </p>
        </div>

        {/* Search Bar & Filters Toggle */}
        <div className="bg-white rounded-xl shadow-lg p-5 mb-8 border border-gray-100">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by name, location, or job type"
              // === Focus Ring: Primary Teal ===
              className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
            />
            <LucideSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            {loading && searchQuery && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                {/* Loading Spinner: Primary Teal */}
                <LucideLoader2 className="w-5 h-5 animate-spin text-teal-500" />
              </div>
            )}
          </div>
          
          {/* Filters Toggle Button & Count */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              // === Toggle Button: Primary Teal ===
              className="flex items-center text-teal-600 font-semibold hover:text-teal-700 transition-colors"
            >
              <LucideFilter className={`mr-2 h-4 w-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
            <p className="text-sm text-gray-500 font-medium">
              Showing {contractors.length} of {total} contractors
            </p>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b pb-6 mb-6 border-gray-100">
              {/* Employee Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <LucideUsers className="inline mr-2 h-4 w-4 text-teal-500" />
                  Company Size
                </label>
                <select
                  value={employeeRange}
                  onChange={handleEmployeeRangeChange}
                  // === Focus Ring: Primary Teal ===
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="">All Sizes</option>
                  <option value="1-10">1-10 Employees (Micro)</option>
                  <option value="10-20">10-20 Employees (Small)</option>
                  <option value="20-50">20-50 Employees (Medium)</option>
                  <option value="50-100">50-100 Employees (Large)</option>
                  <option value="100-Infinity">100+ Employees (Enterprise)</option>
                </select>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <div className="flex space-x-3">
                  {/* All Button (Teal Selected) */}
                  <button
                    onClick={() => handleAvailabilityChange("all")}
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors font-medium ${
                      availability === "all"
                        ? "bg-teal-600 text-white hover:bg-teal-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All
                  </button>
                  {/* Available Button (Green Selected) */}
                  <button
                    onClick={() => handleAvailabilityChange("available")}
                    className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center transition-colors font-medium ${
                      availability === "available"
                        ? "bg-green-500 text-white hover:bg-green-600"
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
                  className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-200"
                >
                  Reset Filters
                </button>
              </div>
            </div>

            {/* Job Types Filter */}
            {allJobTypes.length > 0 && (
              <div className="mt-6">
                <label className="block text-lg font-bold text-gray-800 mb-3">
                  <LucideBuilding className="inline mr-2 h-5 w-5 text-teal-600" />
                  Filter by Specialization
                </label>
                <div className="flex flex-wrap gap-3">
                  {allJobTypes.map((jobType) => (
                    <div
                      key={jobType}
                      className={`cursor-pointer text-sm font-medium px-4 py-2 rounded-full transition-colors border ${
                        selectedJobTypes.includes(jobType) 
                          // === Selected: Primary Teal ===
                          ? 'bg-teal-600 text-white border-teal-600 hover:bg-teal-700' 
                          // === Unselected: Subtle Gray ===
                          : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                      }`}
                      onClick={() => handleJobTypeClick(jobType)}
                    >
                      {jobType}
                      {selectedJobTypes.includes(jobType) && (
                        <span className="ml-1 font-bold">✓</span>
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
              {/* Loader: Primary Teal */}
              <LucideLoader2 className="w-8 h-8 animate-spin text-teal-500" />
            </div>
          }
          endMessage={
            <div className="text-center py-12 bg-white rounded-xl shadow-inner my-6">
              <p className="text-gray-500 font-medium text-lg mb-4">
                {contractors.length > 0 
                  ? "You've reached the end of the available contractors." 
                  : "No contractors found matching your current criteria."}
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
                  // === Reset Button: Accent Orange ===
                  className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center mx-auto"
                >
                  Reset All Filters <LucideFilter className="w-4 h-4 ml-2" />
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
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                onClick={() => handleCardClick(contractor._id)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={contractor.profilePicture || "/avatar.png"} // Fixed relative path issue
                    alt={contractor.contractorName || "Contractor"}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {contractor.available && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-md">
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
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      {/* Icon: Primary Teal */}
                      <LucideMapPin className="w-4 h-4 mr-2 text-teal-500" />
                      <span className="truncate">
                        {contractor.city || "Unknown City"}, {contractor.state || "Unknown State"}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      {/* Icon: Primary Teal */}
                      <LucideUsers className="w-4 h-4 mr-2 text-teal-500" />
                      <span>
                        {contractor.numberOfEmployees || "0"} Employees
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {contractor.jobTypes?.slice(0, 3).map((job, idx) => ( // Show max 3 badges
                      <Badge
                        key={idx}
                        // === Badge Color: Primary Teal (Light background) ===
                        className="bg-teal-100 text-teal-800 font-medium hover:bg-teal-200 transition-colors"
                      >
                        {job}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <button className="text-teal-600 text-sm font-semibold flex items-center hover:text-teal-700">
                      View Profile <LucideArrowRight className="w-4 h-4 ml-2" />
                    </button>
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