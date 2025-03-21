import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Card from "@/components/ui/card";
import CardContent from "@/components/ui/card-content";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideUser, LucideMapPin } from "lucide-react";
import { Button } from "@mui/material";
import axiosInstance from "../../lib/axios";
import SearchSection from "../../components/ui/searcharea";
// import { Button } from "@heroui/react"; // Import the Button component from your UI library

const Contractors = () => {
  const [contractors, setContractors] = useState([]);
  const [filteredContractors, setFilteredContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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

  useEffect(() => {
    applySearch();
  }, [searchQuery, contractors]);

  const applySearch = () => {
    let result = contractors;

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

    setFilteredContractors(result);
  };

  const handleSearchChange = (e) => {
    console.log("Search Query:", e); // Debugging
    setSearchQuery(e);
  };

  const handleCardClick = (contractorId) => {
    navigate(`/contractor/contractorprofileforuser/${contractorId}`);
  };

  return (
    <div className="mt-20">
      <Navbar />
      <SearchSection onSearch={handleSearchChange} />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Contractors</h1>
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
                isFooterBlurred
                className="hover:shadow-xl transition-shadow rounded-2xl overflow-hidden border border-gray-200 cursor-pointer relative"
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

                <CardContent className="p-5 space-y-4">
                  {/* Header Section */}
                  <div className="flex items-center space-x-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {contractor.contractorName || "Unnamed Contractor"}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {contractor.companyName || "No Company"}
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

                {/* Footer Section */}
              
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