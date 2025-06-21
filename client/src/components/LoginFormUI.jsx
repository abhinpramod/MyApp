import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GalleryVerticalEnd, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginFormUI = ({
  formData,
  errors,
  onSubmit,
  onChange,
  onNavigateRegister,
  logoText,
  welcomeMessage,
  currentUserType, // 'user', 'contractor', or 'store'
  welcomehead,
  onForgotPassword // Add this prop
}) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogoClick = () => {
    navigate("/");
  };

  const getAvailableLogins = () => {
    switch (currentUserType) {
      case "user":
        return [
          { label: "Contractor Login", path: "/contractor/Logincontractors" },
          { label: "Store Login", path: "/storeLogin" },
        ];
      case "contractor":
        return [
          { label: "User Login", path: "/loginuser" },
          { label: "Store Login", path: "/storeLogin" },
        ];
      case "store":
        return [
          { label: "User Login", path: "/loginuser" },
          { label: "Contractor Login", path: "/contractor/Logincontractors" },
        ];
      default:
        return [
          { label: "User Login", path: "/loginuser" },
          { label: "Contractor Login", path: "/contractor/Logincontractors" },
          { label: "Store Login", path: "/storeLogin" },
        ];
    }
  };

  const availableLogins = getAvailableLogins();

  return (
    <div className="flex flex-col gap-4 p-6 md:p-10">
      {/* Header with logo on left and dropdown on right */}
      <div className="flex justify-between items-center">
        {/* Logo on left */}
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 font-medium hover:underline"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <h1>{logoText}</h1>
        </button>

        {/* Dropdown on right */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1 px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-50"
          >
            <span className="text-sm">Switch Account</span>
            <ChevronDown
              className={`size-4 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 rounded-md border bg-white shadow-lg z-50">
              {availableLogins.map((login) => (
                <button
                  key={login.path}
                  onClick={() => {
                    navigate(login.path);
                    setDropdownOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                >
                  {login.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Login form */}
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-xs">
          <form className={cn("flex flex-col gap-6")} onSubmit={onSubmit}>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">{welcomehead}</h1>
              <p className="text-balance text-sm text-muted-foreground">
                {welcomeMessage}
              </p>
            </div>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="text"
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={onChange}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={onChange}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <button
                onClick={onNavigateRegister}
                className="underline underline-offset-4"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginFormUI;