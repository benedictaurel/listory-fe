import { Star, Film, BookOpen, Users, Search, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import Navbar from "@/components/navbarLanding";
import NavbarHome from "@/components/navbarHome";
import Footer from "../src/components/footer";

import Endgame from "../src/assets/endgame.webp";
import DunePartTwoMobile from "../src/assets/DunePartTwoMobile.webp";
import TheCatcher from "../src/assets/TheCatcher.webp";
import Gatsby from "../src/assets/gatsby.webp";

export default function App() {
  const userName = localStorage.getItem("name");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen items-center">
      {userName ? <NavbarHome /> : <Navbar />}
      <section className="container mx-auto px-4 py-20 flex flex-col lg:flex-row items-center gap-12 text-white">
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Your Personal{" "}
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Library
            </span>{" "}
            of Movies & Books
          </h1>
          <p className="text-lg text-gray-300 max-w-xl">
            Discover, track, and review your favorite movies and books all in
            one place. Build your watchlist and reading list with Listory.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6"
              onClick={() => navigate("/login")}
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              className="border-purple-600 text-purple-400 hover:bg-purple-950 hover:text-purple-300 px-8 py-6"
              onClick={() => {
                const el = document.getElementById("features");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Learn More
            </Button>
          </div>
        </div>
        <div className="lg:w-1/2 relative">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="relative grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                <img
                  src={Endgame}
                  alt="Endgame"
                  width={300}
                  height={400}
                  className="w-full h-auto"
                />
                <div className="p-4">
                  <div className="flex items-center gap-1">
                    <Star
                      className="w-4 h-4 text-purple-500"
                      fill="currentColor"
                    />
                    <span className="text-sm">9.5/10</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                <img
                  src={DunePartTwoMobile}
                  alt="Dune Part Two"
                  width={300}
                  height={400}
                  className="w-full h-auto"
                />
                <div className="p-4">
                  <div className="flex items-center gap-1">
                    <Star
                      className="w-4 h-4 text-purple-500"
                      fill="currentColor"
                    />
                    <span className="text-sm">9/10</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4 mt-8">
              <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                <img
                  src={TheCatcher}
                  alt="The Catcher in the Rye"
                  width={300}
                  height={400}
                  className="w-full h-auto"
                />
                <div className="p-4">
                  <div className="flex items-center gap-1">
                    <Star
                      className="w-4 h-4 text-purple-500"
                      fill="currentColor"
                    />
                    <span className="text-sm">9.8/10</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                <img
                  src={Gatsby}
                  alt="The Great Gatsby"
                  width={300}
                  height={400}
                  className="w-full h-auto"
                />
                <div className="p-4">
                  <div className="flex items-center gap-1">
                    <Star
                      className="w-4 h-4 text-purple-500"
                      fill="currentColor"
                    />
                    <span className="text-sm">9.1/10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Listory combines the best features for movie and book enthusiasts
              in a single platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-6 rounded-xl hover:bg-gray-800 transition-colors">
              <div className="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover</h3>
              <p className="text-gray-300">
                Find new movies and books based on your preferences and what's
                trending.
              </p>
            </div>

            <div className="bg-gray-900 p-6 rounded-xl hover:bg-gray-800 transition-colors">
              <div className="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <Bookmark className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Save & Organize</h3>
              <p className="text-gray-300">
                Create watchlists and reading lists to keep track of what you
                want to experience next.
              </p>
            </div>

            <div className="bg-gray-900 p-6 rounded-xl hover:bg-gray-800 transition-colors">
              <div className="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rate & Review</h3>
              <p className="text-gray-300">
                Share your thoughts and see what others think about your
                favorite titles.
              </p>
            </div>

            <div className="bg-gray-900 p-6 rounded-xl hover:bg-gray-800 transition-colors">
              <div className="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <Film className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Movies Database</h3>
              <p className="text-gray-300">
                Access comprehensive information about thousands of films from
                all eras and genres.
              </p>
            </div>

            <div className="bg-gray-900 p-6 rounded-xl hover:bg-gray-800 transition-colors">
              <div className="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Books Library</h3>
              <p className="text-gray-300">
                Explore our extensive collection of books across all literary
                categories.
              </p>
            </div>

            <div className="bg-gray-900 p-6 rounded-xl hover:bg-gray-800 transition-colors">
              <div className="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-300">
                We have a vibrant community of users who share their
                recommendations and reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Listory Works
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Your journey to better movie and book tracking starts here.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
              <p className="text-gray-300">
                Sign up for free and set up your profile with your preferences.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Explore Content</h3>
              <p className="text-gray-300">
                Browse our vast library of movies and books or search for
                specific titles.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Track & Share</h3>
              <p className="text-gray-300">
                Save to your lists, rate what you've watched or read, and share
                reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Join thousands of satisfied users who have transformed how they
              track their entertainment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-6 rounded-xl">
              <div className="flex items-center gap-1 mb-4">
                <Star className="w-4 h-4 text-purple-500" fill="currentColor" />
                <Star className="w-4 h-4 text-purple-500" fill="currentColor" />
                <Star className="w-4 h-4 text-purple-500" fill="currentColor" />
                <Star className="w-4 h-4 text-purple-500" fill="currentColor" />
                <Star className="w-4 h-4 text-purple-500" fill="currentColor" />
              </div>
              <p className="text-gray-300 mb-4">
                "Listory has completely changed how I keep track of movies I
                want to watch. The interface is intuitive and the
                recommendations are spot on!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full"></div>
                <div>
                  <p className="font-medium">Alex Johnson</p>
                  <p className="text-sm text-gray-400">Movie Enthusiast</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-xl">
              <div className="flex items-center gap-1 mb-4">
                <Star className="w-4 h-4 text-purple-500" fill="currentColor" />
                <Star className="w-4 h-4 text-purple-500" fill="currentColor" />
                <Star className="w-4 h-4 text-purple-500" fill="currentColor" />
                <Star className="w-4 h-4 text-purple-500" fill="currentColor" />
                <Star className="w-4 h-4 text-purple-500" fill="currentColor" />
              </div>
              <p className="text-gray-300 mb-4">
                "As an avid reader, I've tried many book tracking apps, but
                Listory stands out with its clean design and comprehensive
                database. Love it!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full"></div>
                <div>
                  <p className="font-medium">Sarah Miller</p>
                  <p className="text-sm text-gray-400">Book Lover</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-xl">
              <div className="flex items-center gap-1 mb-4">
                <Star className="w-4 h-4 text-purple-500" fill="currentColor" />
                <Star className="w-4 h-4 text-purple-500" fill="currentColor" />
                <Star className="w-4 h-4 text-purple-500" fill="currentColor" />
                <Star className="w-4 h-4 text-purple-500" fill="currentColor" />
                <Star className="w-4 h-4 text-purple-500" fill="currentColor" />
              </div>
              <p className="text-gray-300 mb-4">
                "The community aspect of Listory is what makes it special. I've
                discovered so many hidden gems through friends'
                recommendations!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full"></div>
                <div>
                  <p className="font-medium">Michael Chen</p>
                  <p className="text-sm text-gray-400">Film & Book Critic</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-purple-900 to-purple-700 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Listory?
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
              Join thousands of users who are tracking, discovering, and sharing
              their favorite movies and books.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-white text-purple-900 hover:bg-purple-900 px-8 py-6 hover:text-white transition-all ease-in-out duration-300"
                onClick={() => navigate("/login")}
              >
                Sign Up for Free
              </Button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
