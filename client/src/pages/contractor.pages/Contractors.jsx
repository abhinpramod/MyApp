import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Card from "@/components/ui/card";
import CardContent from "@/components/ui/card-content";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideMapPin, LucideCheckCircle, LucideXCircle, LucideSearch } from "lucide-react";
import axiosInstance from "../../lib/axios";

const Contractors = () => {
  const [contractors, setContractors] = useState([]);
  const [filteredContractors, setFilteredContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [employeeRange, setEmployeeRange] = useState("");
  const [availability, setAvailability] = useState("all"); // 'all', 'available', 'unavailable'
  const [selectedJobTypes, setSelectedJobTypes] = useState([]); // Array of selected job types
  const navigate = useNavigate();

  // Fetch contractors on component mount
  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const response = await axiosInstance.get("/user/all-contractors");
        setContractors(response.data);
        setFilteredContractors(response.data);
      } catch (error) {
        console.error("Error fetching contractors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContractors();
  }, []);

  // Apply filters whenever searchQuery, employeeRange, availability, or selectedJobTypes change
  useEffect(() => {
    applySearch();
  }, [searchQuery, contractors, employeeRange, availability, selectedJobTypes]);

  // Function to apply all filters
  const applySearch = () => {
    let result = contractors;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((contractor) => {
        const contractorName = contractor.contractorName?.toLowerCase() || "";
        const companyName = contractor.companyName?.toLowerCase() || "";
        const country = contractor.country?.toLowerCase() || "";
        const state = contractor.state?.toLowerCase() || "";
        const city = contractor.city?.toLowerCase() || "";
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

    // Filter by employee range
    if (employeeRange) {
      const [min, max] = employeeRange.split("-").map(Number);
      result = result.filter((contractor) => {
        const numberOfEmployees = contractor.numberOfEmployees || 0;
        if (max === Infinity) {
          return numberOfEmployees >= min;
        } else {
          return numberOfEmployees >= min && numberOfEmployees <= max;
        }
      });
    }

    // Filter by availability
    if (availability !== "all") {
      result = result.filter((contractor) => {
        const isAvailable = contractor.availability || false;
        return availability === "available" ? isAvailable : !isAvailable;
      });
    }

    // Filter by selected job types
    if (selectedJobTypes.length > 0) {
      result = result.filter((contractor) => {
        const contractorJobTypes = contractor.jobTypes?.map((job) => job.toLowerCase()) || [];
        return selectedJobTypes.some((jobType) =>
          contractorJobTypes.includes(jobType.toLowerCase())
        );
      });
    }

    setFilteredContractors(result);
  };

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle employee range change
  const handleEmployeeRangeChange = (e) => {
    setEmployeeRange(e.target.value);
  };

  // Handle availability change
  const handleAvailabilityChange = (value) => {
    setAvailability(value);
  };

  // Handle job type selection
  const handleJobTypeClick = (jobType) => {
    setSelectedJobTypes((prev) =>
      prev.includes(jobType)
        ? prev.filter((type) => type !== jobType) // Deselect if already selected
        : [...prev, jobType] // Select if not already selected
    );
  };

  // Handle card click to navigate to contractor profile
  const handleCardClick = (contractorId) => {
    navigate(`/contractor/contractorprofileforuser/${contractorId}`);
  };

  // Unique job types from all contractors
  const allJobTypes = [
    ...new Set(contractors.flatMap((contractor) => contractor.jobTypes || [])),
  ];

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
              onChange={handleSearchChange}
              placeholder="Search by name, location, or job type"
              className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <LucideSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
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

        {/* Job Type Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {allJobTypes.map((jobType) => (
            <Badge
              key={jobType}
              variant={selectedJobTypes.includes(jobType) ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                selectedJobTypes.includes(jobType) ? "bg-primary text-white" : "hover:bg-gray-100"
              }`}
              onClick={() => handleJobTypeClick(jobType)}
            >
              {jobType}
            </Badge>
          ))}
        </div>

        {/* Contractors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            Array(8)
              .fill(0)
              .map((_, index) => (
                <Skeleton key={index} className="h-64 rounded-lg" />
              ))
          ) : filteredContractors.length > 0 ? (
            filteredContractors.map((contractor) => (
              <Card
                key={contractor._id}
                className="hover:shadow-lg transition-shadow rounded-lg overflow-hidden border border-gray-200 cursor-pointer"
                onClick={() => handleCardClick(contractor._id)}
              >
                {/* Image Section */}
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={contractor.profilePicture || "../../../public/avatar.png"}
                    alt={contractor.contractorName || "Contractor"}
                    className="w-full h-full object-cover"
                  />
                </div>

                <CardContent className="p-4 space-y-4">
                  {/* Header Section */}
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

                  {/* Location Section */}
                  <div className="flex items-center text-sm text-gray-600">
                    <LucideMapPin className="w-4 h-4 mr-1 text-primary" />
                    {contractor.country || "Unknown Country"},{" "}
                    {contractor.state || "Unknown State"},{" "}
                    {contractor.city || "Unknown City"}
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