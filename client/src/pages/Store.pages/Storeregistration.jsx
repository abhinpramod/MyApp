import React, { useState } from 'react';
import axiosInstance from '@/lib/axios';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Card from '@/components/ui/card';
import CardContent from '@/components/ui/card-content';
import { toast } from 'react-hot-toast';
import { Country, State, City } from 'country-state-city';
import { useNavigate } from 'react-router-dom';
import OTPModal from '@/components/Register/Otpmodal'; 
import Navbar from '@/components/Register/Registernav';
import { Loader } from 'lucide-react';

const StoreRegistration = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    country: '', // Store full country name
    countryCode: '', // Store country ISO code (optional)
    state: '', // Store full state name
    stateCode: '', // Store state ISO code (optional)
    city: '',
    address: '',
    email: '',
    phone: '',
    storeType: '',
    gstNumber: '',
    gstDocument: null,
    storeLicense: null,
    password: '',
    confirmPassword: '',
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // OTP as an array of digits
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false); // State to control OTP modal visibility
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'country') {
      const selectedCountry = Country.getAllCountries().find((c) => c.isoCode === value);
      setFormData({
        ...formData,
        country: selectedCountry ? selectedCountry.name : '', // Save full country name
        countryCode: value, // Save country ISO code (optional)
        state: '', // Reset state when country changes
        stateCode: '', // Reset state code when country changes
        city: '', // Reset city when country changes
      });
    } else if (name === 'state') {
      const selectedState = State.getStatesOfCountry(formData.countryCode).find((s) => s.isoCode === value);
      setFormData({
        ...formData,
        state: selectedState ? selectedState.name : '', // Save full state name
        stateCode: value, // Save state ISO code (optional)
        city: '', // Reset city when state changes
      });
    } else {
      setFormData({
        ...formData,
        [name]: files ? files[0] : value,
      });
    }
  };

  const validateStep1 = () => {
    const { storeName, ownerName, country, state, city, address, email, phone, storeType } = formData;
    if (!storeName || !ownerName || !country || !state || !city || !address || !email || !phone || !storeType) {
      toast.error('All fields are required in Step 1');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Invalid email address');
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      toast.error('Phone number must be 10 digits');
      return false;
    }
    return true;
  };

  const sendOtp = async () => {
    if (!validateStep1()) return;
    try {
      await axiosInstance.post('/store/send-otp', { email: formData.email });
      setIsOtpModalOpen(true); // Open the OTP modal
      toast.success('OTP sent to your email');
    } catch (error) {
      toast.error('Failed to send OTP');
    }
  };

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === 'Backspace' && index > 0 && !otp[index]) {
      // Move focus to the previous input on backspace
      document.getElementById(`otp-input-${index - 1}`).focus();
    } else if (event.key !== 'Backspace' && index < otp.length - 1 && otp[index]) {
      // Move focus to the next input on digit entry
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const verifyOtp = async () => {
    const otpString = otp.join('');
    if (!otpString || otpString.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    try {
      await axiosInstance.post('/store/verify-otp', { email: formData.email, otp: otpString });
      toast.success('OTP verified');
      setIsOtpModalOpen(false); // Close the OTP modal
      setStep(2); // Move to the next step
    } catch (error) {
      toast.error('Invalid OTP');
    }
  };

  const validateStep2 = () => {
    const { gstNumber, gstDocument, storeLicense, password, confirmPassword } = formData;
    if (!gstNumber || !gstDocument || !storeLicense || !password || !confirmPassword) {
      toast.error('All fields are required in Step 2');
      return false;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setIsLoading(true);

    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const Response = await axiosInstance.post('/store/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Registration successful. Waiting for admin approval.');

      if (Response.status === 200) {
        navigate('/');
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error('Registration failed');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className='flex justify-center items-center'><Loader className="size-10 mt-60 animate-spin" /></div>;
  }

  return (
    <>

    <Navbar type="store" login="register" />

    <Card className="max-w-6xl mx-auto p-6 mt-1 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="hidden md:block bg-gray-200 rounded-xl"></div>
      <CardContent>
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Store Registration - Step 1</h2>
            <Input name="storeName" placeholder="Store Name" onChange={handleChange} className="mb-3 p-3 text-lg" />
            <Input name="ownerName" placeholder="Owner Name" onChange={handleChange} className="mb-3 p-3 text-lg" />
            <select name="country" onChange={handleChange} className="w-full mb-3 p-3 border rounded text-lg">
              <option value="">Select Country</option>
              {Country.getAllCountries().map((c) => (
                <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
              ))}
            </select>
            <select name="state" onChange={handleChange} className="w-full mb-3 p-3 border rounded text-lg">
              <option value="">Select State</option>
              {State.getStatesOfCountry(formData.countryCode).map((s) => (
                <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
              ))}
            </select>
            <select name="city" onChange={handleChange} className="w-full mb-3 p-3 border rounded text-lg">
              <option value="">Select City</option>
              {City.getCitiesOfState(formData.countryCode, formData.stateCode).map((city) => (
                <option key={city.name} value={city.name}>{city.name}</option>
              ))}
            </select>
            <Input name="address" placeholder="Address" onChange={handleChange} className="mb-3 p-3 text-lg" />
            <Input name="email" placeholder="Email" type="email" onChange={handleChange} className="mb-3 p-3 text-lg" />
            <Input name="phone" placeholder="Phone" onChange={handleChange} className="mb-3 p-3 text-lg" />
            <Input name="storeType" placeholder="Store Type" onChange={handleChange} className="mb-3 p-3 text-lg" />
            <Button onClick={sendOtp} className="mt-3 w-full p-3 text-lg">Send OTP</Button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Store Registration - Step 2</h2>
            <Input name="gstNumber" placeholder="GST Number" onChange={handleChange} className="mb-3 p-3 text-lg" />
            <Input name="gstDocument" type="file" onChange={handleChange} className="mb-3 p-3 text-lg" />
            <Input name="storeLicense" type="file" onChange={handleChange} className="mb-3 p-3 text-lg" />
            <Input name="password" type="password" placeholder="Password" onChange={handleChange} className="mb-3 p-3 text-lg" />
            <Input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} className="mb-3 p-3 text-lg" />
            <Button type="submit" className="mt-3 w-full p-3 text-lg">Submit</Button>
          </form>
        )}
      </CardContent>

      {/* OTP Modal */}
      <OTPModal
        showOtpModal={isOtpModalOpen}
        setShowOtpModal={setIsOtpModalOpen}
        otp={otp}
        handleOtpChange={handleOtpChange}
        handleOtpKeyDown={handleOtpKeyDown}
        verifyOtp={verifyOtp}
      />
    </Card>

    </>
  );
};

export default StoreRegistration;