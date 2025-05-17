import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LogoPurple from "../assets/LogoPurple.svg";

export default function Navbar() {
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("name");
    setUserName(name);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("user_id");
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/95 backdrop-blur px-4 md:px-12">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            onClick={() => navigate("/")}
            className="flex items-center cursor-pointer"
          >
            <img src={LogoPurple} alt="Logo" className="h-10 w-auto" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {userName ? (
            <>
              <div className="text-gray-200">Welcome, {userName}</div>
              <Button
                onClick={handleLogout}
                className="text-gray-300 hover:bg-gray-800 hover:text-white md:flex"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              className="text-gray-300 hover:bg-gray-800 hover:text-white md:flex"
            >
              <LogIn className="h-5 w-5" />
              Sign In/Create Account
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
