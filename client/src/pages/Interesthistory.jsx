import React, { useEffect, useState } from 'react';
import { Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Badge, Paper, Typography, Tooltip } from '@mui/material';
import { LucideCheckCircle, LucideClock } from 'lucide-react';
import axiosInstance from "../lib/axios";
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const InterestSentHistory = () => {
  const [interestHistory, setInterestHistory] = useState([]);

  useEffect(() => {
    const fetchInterestHistory = async () => {
      try {
        const response = await axiosInstance.get('/contractor/all-interests');
        setInterestHistory(response.data || []);
      } catch (error) {
        console.error('Failed to fetch interest history:', error);
      }
    };

    fetchInterestHistory();
  }, []);

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

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (

    <>
    <Navbar/>
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-blue-50 mt-16 to-gray-100"
    >
      <Typography variant="h3" className="text-center font-bold mb-8">
        Interest Sent History
      </Typography>
      <Card 
        component={Paper} 
        elevation={5} 
        className="shadow-xl max-w-5xl mx-auto rounded-xl overflow-hidden border border-gray-200"
      >
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow className="bg-blue-200">
                  <TableCell className="font-bold text-blue-300">Company Name</TableCell>
                  <TableCell className="font-bold text-blue-300">Email</TableCell>
                  <TableCell className="font-bold text-blue-300">Address</TableCell>
                  <TableCell className="font-bold text-blue-300">Job Types</TableCell>
                  <TableCell className="font-bold text-blue-300">Expected Date</TableCell>
                  <TableCell className="font-bold text-blue-300 text-center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {interestHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="6" className="text-center py-8 text-gray-500">
                      No interests sent yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  interestHistory.map((interest) => (
                    <motion.tr 
                      key={interest._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-blue-50"
                    >
                      <TableCell className="font-medium text-gray-800">
                        {interest.companyName}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {interest.contractorEmail}
                      </TableCell>
                      <TableCell className="text-gray-600 max-w-xs truncate">
                        <Tooltip title={interest.address} placement="top">
                          {truncateText(interest.address, 20)}
                        </Tooltip>
                      </TableCell>
                      <TableCell className="text-gray-600 max-w-xs truncate">
                        <Tooltip title={interest.jobTypes.join(', ')} placement="top">
                          {truncateText(interest.jobTypes.join(', '), 30)}
                        </Tooltip>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {interest.expectedDate}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {statusIcon(interest.seenByContractor)}
                          <Badge color={interest.seenByContractor ? 'success' : 'warning'}>
                            {interest.seenByContractor ? 'Seen' : 'Pending'}
                          </Badge>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </motion.div>
    </>
  );
};

export default InterestSentHistory;
