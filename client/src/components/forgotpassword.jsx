import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import  Button  from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const ForgotPassword = ({ userType, onBackToLogin }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await axiosInstance.post(`/${userType}/forgot-password`, { email });
      
      if (response.data.msg !== "OTP sent to email") {
        toast.error(response.data.msg || "Failed to send OTP");
        // throw new Error(response.data.msg || "Failed to send OTP");
      }

    //   setMessage("OTP sent to your email. Please check your inbox.");
    toast.success("OTP sent to your email. Please check your inbox.");
      setStep(2);
    } catch (err) {
        toast.error(err.response?.data?.msg || err.message || "Failed to send OTP");
    //   setError(err.response?.data?.msg || err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
    //   setError("Please enter a valid 6-digit OTP");
    toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    
    setLoading(true);
    // setError("");
    
    try {
      const response = await axiosInstance.post(`/${userType}/verify-otpforget`, { email, otp });
      
      if (response.data.msg !== "OTP verified") {
        toast.error(response.data.msg || "Invalid OTP");
        // throw new Error(response.data.msg || "Invalid OTP");
      }

      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.msg || err.message || "Invalid OTP");
    //   setError(err.response?.data?.msg || err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const response = await axiosInstance.post(`/${userType}/reset-password`, { 
        email, 
        otp, 
        newPassword 
      });
      
      if (response.data.msg !== "Password reset successful") {
        toast.error(response.data.msg || "Failed to reset password");
        // throw new Error(response.data.msg || "Failed to reset password");
      }

    //   setMessage("Password reset successfully. You can now login with your new password.");
    toast.success("Password reset successfully. You can now login with your new password.");
      setTimeout(() => {
        onBackToLogin();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Failed to reset password");
      toast.error(err.response?.data?.msg || err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="text-muted-foreground">
            {step === 1 && "Enter your email to receive a verification code"}
            {step === 2 && "Enter the OTP sent to your email"}
            {step === 3 && "Enter your new password"}
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        {message && (
          <div className="p-3 text-sm text-green-500 bg-green-50 rounded-md">
            {message}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        )}

        <div className="text-center">
          <button
            onClick={onBackToLogin}
            className="text-sm text-primary hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;