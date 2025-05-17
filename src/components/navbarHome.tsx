import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus2, LogOut } from "lucide-react";
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
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/95 backdrop-blur px-4 md:px-12">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          {" "}
          <div
            onClick={() => navigate("/")}
            className="flex items-center cursor-pointer"
          >
            <img src={LogoPurple} alt="Logo" className="h-10 w-auto" />
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/movies")}
            size="sm"
            className="ml-4 h-8 gap-1 border-gray-700 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <span>Movies</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/books")}
            size="sm"
            className="ml-4 h-8 gap-1 border-gray-700 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <span>Books</span>
          </Button>
        </div>
        <div className="flex items-center gap-4">
          {/* Desktop User Name Display */}
          {userName ? (
            <>
              <div className="hidden text-gray-300 md:flex mr-2">
                Welcome, {userName}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="hidden text-gray-300 hover:bg-gray-800 hover:text-white md:flex"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="hidden text-gray-300 hover:bg-gray-800 hover:text-white md:flex"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hidden text-gray-300 hover:bg-gray-800 hover:text-white md:flex"
                onClick={() => navigate("/login")}
              >
                Create Account
              </Button>
            </>
          )}{" "}
          {/* Mobile Auth Button */}
          <Button
            variant="ghost"
            size="icon"
            className="flex text-gray-300 hover:bg-gray-800 hover:text-white md:hidden"
            onClick={userName ? handleLogout : () => navigate("/login")}
          >
            {userName ? (
              <LogOut className="h-5 w-5" />
            ) : (
              <UserPlus2 className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
