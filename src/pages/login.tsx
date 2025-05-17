import { useState } from "react";
import Logos from "../assets/LogoPurple.svg";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function LoginRegisterPage() {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://listory-backend.vercel.app/api/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log("Login successful:", data);

      localStorage.setItem("user_id", data.data.id);
      localStorage.setItem("name", data.data.username);

      alert("Login successful!");
      navigate("/movies");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleRegister = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://listory-backend.vercel.app/api/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            username: name,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      console.log("Registration successful:", data);

      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <a href="/" className="mt-10 flex justify-center z-10 max-lg:hidden">
        <img src={Logos} alt="Logo" className="h-18 w-auto" />
      </a>

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4">
        <a href="/" className="mb-8 lg:hidden">
          <img src={Logos} alt="Logo" className="h-20 w-auto" />
        </a>

        <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold">
              {tab === "login" ? "Sign In" : "Register"}
            </h1>
            <div className="grid grid-cols-2">
              <button
                className={`px-4 py-2 border ${
                  tab === "login"
                    ? "font-bold border-b-2 border-purple-500"
                    : "text-gray-500"
                }`}
                onClick={() => setTab("login")}
              >
                Login
              </button>
              <button
                className={`px-4 py-2 border ${
                  tab === "register"
                    ? "font-bold border-b-2 border-purple-500"
                    : "text-gray-500"
                }`}
                onClick={() => setTab("register")}
              >
                Register
              </button>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          {tab === "login" && (
            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border p-2 rounded"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border p-2 rounded"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="text-right">
                <div className="text-sm text-purple-600 hover:underline">
                  Need help?
                </div>
              </div>
              <button
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded flex justify-center items-center transition duration-300 ease-in-out"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? <span className="loader"></span> : "Continue"}
              </button>
            </div>
          )}

          {tab === "register" && (
            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border p-2 rounded"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border p-2 rounded"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full border p-2 rounded"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <button
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded flex justify-center items-center transition duration-300 ease-in-out"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? <span className="loader"></span> : "Register"}
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="py-4 text-center text-sm text-gray-600 relative z-10">
        <div className="flex justify-center items-center space-x-4">
          <span>© 2025, Listory</span>
        </div>
      </footer>
    </div>
  );
}
