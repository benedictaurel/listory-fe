import { Star, Calendar, User, Video } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import DunePartTwo from "../assets/DunePartTwo.webp";
import DunePartTwoMobile from "../assets/DunePartTwoMobile.webp";
import NavbarHome from "@/components/navbarHome";

// Define movie type
interface Movie {
  id: string;
  title: string;
  rating: string;
  releaseYear: string;
  posterUrl: string;
  director?: string;
  genre?: string[];
  cast?: string[];
  synopsis?: string;
  linkYoutube?: string;
}

// Define review type
interface Review {
  id: string;
  userId: string;
  movieId: string;
  rating: string;
  review: string;
  createdAt: string;
  isReview?: boolean;
  user?: {
    username: string;
  };
}

// Define watchlist item type
interface WatchlistItem {
  id: string;
  userId: string;
  movieId: string;
  movie: Movie;
  isAdded?: boolean;
}

export default function Home() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState<boolean>(false);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoadingWatchlist, setIsLoadingWatchlist] = useState<boolean>(false);
  const [isAddingToWatchlist, setIsAddingToWatchlist] =
    useState<boolean>(false);
  const [isRemovingFromWatchlist, setIsRemovingFromWatchlist] =
    useState<boolean>(false);
  const [isWatchlisted, setIsWatchlisted] = useState<boolean>(false);
  // New state variables for review submission
  const [reviewText, setReviewText] = useState<string>("");
  const [reviewRating, setReviewRating] = useState<string>("");
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
  const [hasUserReviewed, setHasUserReviewed] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is logged in
    const userName = localStorage.getItem("name");
    if (!userName) {
      navigate("/login");
    }

    // Fetch movies from API
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://listory-backend.vercel.app/api/movies"
        );
        const data = await response.json();
        setMovies(data.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setIsLoading(false);
      }
    };

    fetchMovies();
    fetchWatchlist();
  }, [navigate]);
  // Function to fetch user's watchlist
  const fetchWatchlist = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    try {
      setIsLoadingWatchlist(true);
      const response = await fetch(
        `https://listory-backend.vercel.app/api/lists/movies/${userId}`
      );
      const data = await response.json();

      const watchlistItems = data.data.map((movie: any) => {
        return {
          id: movie.id.toString(),
          userId: userId,
          movieId: movie.id.toString(),
          isAdded: true,
          movie: {
            id: movie.id.toString(),
            title: movie.title,
            rating: movie.rating.toString(),
            releaseYear: movie.releaseYear.toString(),
            posterUrl: movie.posterUrl,
            director: movie.director,
            genre: movie.genre,
            cast: movie.cast,
            synopsis: movie.synopsis,
            linkYoutube: movie.linkYoutube,
          },
        };
      });

      setWatchlist(watchlistItems);

      // Update the current selected movie's watchlist status if there is a selected movie
      if (selectedMovie) {
        const isInWatchlist = watchlistItems.some(
          (item: WatchlistItem) => item.movieId === selectedMovie.id
        );
        setIsWatchlisted(isInWatchlist);
      }

      setIsLoadingWatchlist(false);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      setIsLoadingWatchlist(false);
    }
  };

  // Helper function to check if a movie is in the watchlist
  const checkIsWatchlisted = (movieId: string) => {
    const isInWatchlist = watchlist.some((item) => item.movieId === movieId);
    setIsWatchlisted(isInWatchlist);
  };
  // Function to handle movie card click
  const handleMovieClick = async (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
    await fetchMovieReviews(movie.id);

    // Check if movie is already in watchlist
    checkIsWatchlisted(movie.id);
  };
  // Function to fetch movie reviews
  const fetchMovieReviews = async (movieId: string) => {
    if (!movieId) return;

    try {
      setIsLoadingReviews(true);
      const response = await fetch(
        `https://listory-backend.vercel.app/api/reviews/movies/${movieId}`
      );
      const data = await response.json();

      // Fetch user data for each review
      const reviewsWithUserData = await Promise.all(
        data.data.map(async (review: Review) => {
          try {
            const userResponse = await fetch(
              `https://listory-backend.vercel.app/api/users/${review.userId}`
            );
            const userData = await userResponse.json();
            return {
              ...review,
              user: {
                username: userData.data.username,
              },
            };
          } catch (error) {
            console.error("Error fetching user data:", error);
            return review;
          }
        })
      );

      setReviews(reviewsWithUserData);

      // Check if the current user has already submitted a review using isReview field
      const currentUserId = localStorage.getItem("user_id");
      if (currentUserId) {
        // Check if any review has the current user's ID and isReview is true
        const userHasReviewed = data.data.some(
          (review: Review) => review.userId == currentUserId
        );
        setHasUserReviewed(userHasReviewed);
      }

      setIsLoadingReviews(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setIsLoadingReviews(false);
    }
  };
  // Function to toggle movie in watchlist (add or remove)
  const handleWatchlistToggle = async (movie: Movie) => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("Please log in to manage your watchlist");
      return;
    }

    if (isWatchlisted) {
      // Remove from watchlist
      await handleRemoveFromWatchlist(movie);
    } else {
      // Add to watchlist
      await handleAddToWatchlist(movie);
    }
  };

  // Function to add a movie to the watchlist
  const handleAddToWatchlist = async (movie: Movie) => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("Please log in to add movies to your watchlist");
      return;
    }

    try {
      setIsAddingToWatchlist(true);
      const response = await fetch(
        "https://listory-backend.vercel.app/api/lists/movies",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            movieId: movie.id,
          }),
        }
      );

      if (response.ok) {
        // Refresh watchlist after adding
        await fetchWatchlist();
        setIsWatchlisted(true);
        alert(`${movie.title} added to your watchlist!`);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to add to watchlist"}`);
      }
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      alert("Failed to add to watchlist. Please try again.");
    } finally {
      setIsAddingToWatchlist(false);
    }
  };

  // Function to remove a movie from the watchlist
  const handleRemoveFromWatchlist = async (movie: Movie) => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    try {
      setIsRemovingFromWatchlist(true);
      const response = await fetch(
        `https://listory-backend.vercel.app/api/lists/movies/${userId}/${movie.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Refresh watchlist after removing
        await fetchWatchlist();
        setIsWatchlisted(false);
        alert(`${movie.title} removed from your watchlist!`);
      } else {
        const errorData = await response.json();
        alert(
          `Error: ${errorData.message || "Failed to remove from watchlist"}`
        );
      }
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      alert("Failed to remove from watchlist. Please try again.");
    } finally {
      setIsRemovingFromWatchlist(false);
    }
  };
  // Function to submit a new review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMovie) return;

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("Please log in to submit a review");
      return;
    }

    try {
      setIsSubmittingReview(true);
      const response = await fetch(
        `https://listory-backend.vercel.app/api/reviews/movies/?movieId=${selectedMovie.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            movieId: selectedMovie.id,
            rating: reviewRating,
            review: reviewText,
            isReview: true,
          }),
        }
      );
      if (response.ok) {
        // Refresh reviews after adding
        await fetchMovieReviews(selectedMovie.id);
        setReviewText("");
        setReviewRating("5.0");
        setHasUserReviewed(true); // Update state to show user has reviewed
        alert("Review submitted successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to submit review"}`);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Get trending movies (latest 6 by release year)
  const trendingMovies = [...movies]
    .sort((a, b) => parseInt(b.releaseYear) - parseInt(a.releaseYear))
    .slice(0, 6);

  // Get top rated movies (highest 6 by rating)
  const topRatedMovies = [...movies]
    .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
    .slice(0, 6);

  // Format rating to display with 2 decimal places
  const formatRating = (rating: string) => {
    return parseFloat(rating).toFixed(2);
  };

  return (
    <div className="flex flex-col min-h-screen items-center">
      <NavbarHome />
      <div className="min-h-screen bg-black text-white mx-4 md:mx-12">
        <main>
          {/* Hero Section */}
          <section className="relative">
            <div className="relative h-[70vh] w-full overflow-hidden">
              <img
                src={DunePartTwo}
                alt="Featured content"
                className="object-cover brightness-65 w-full max-sm:hidden"
              />
              <img
                src={DunePartTwoMobile}
                alt="Featured content"
                className="object-cover brightness-50 w-full sm:hidden"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                <Badge className="mb-2 bg-purple-400 text-black hover:bg-purple-500 duration-300 transition-all">
                  Featured
                </Badge>
                <h1 className="mb-2 text-4xl font-bold md:text-6xl">
                  Dune: Part Two
                </h1>
                <div className="mb-4 flex items-center gap-4">
                  <span className="text-gray-300">2024</span>
                  <span className="text-gray-300">PG-13</span>
                  <span className="text-gray-300">2h 46m</span>
                </div>
                <p className="mb-6 max-w-2xl text-lg text-gray-200">
                  Paul Atreides unites with Chani and the Fremen while seeking
                  revenge against the conspirators who destroyed his family.
                </p>
              </div>
            </div>
          </section>
          {/* Tabs Section */}
          <section className="container py-8">
            <Tabs defaultValue="trending" className="w-full">
              <TabsList className="mb-6 grid w-full grid-cols-2 bg-transparent">
                <TabsTrigger
                  value="trending"
                  className="data-[state=active]:bg-gray-900 data-[state=active]:text-white"
                >
                  Trending
                </TabsTrigger>
                <TabsTrigger
                  value="top-rated"
                  className="data-[state=active]:bg-gray-900 data-[state=active]:text-white"
                >
                  Top Rated
                </TabsTrigger>
              </TabsList>{" "}
              <TabsContent value="trending" className="mt-0">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Trending Movies</h2>
                </div>

                {isLoading ? (
                  <div className="text-center py-10">
                    Loading trending movies...
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {trendingMovies.map((movie, index) => (
                      <Card
                        key={index}
                        className="overflow-hidden bg-gray-900 border-gray-800 hover:border-gray-700 duration-300 transition-all cursor-pointer"
                        onClick={() => handleMovieClick(movie)}
                      >
                        <div className="relative aspect-[2/3]">
                          <img
                            src={
                              movie.posterUrl ||
                              "/placeholder.svg?height=450&width=300"
                            }
                            alt={movie.title}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-purple-400 text-purple-400" />
                              <span className="ml-1 text-sm font-medium">
                                {formatRating(movie.rating)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-medium line-clamp-1">
                            {movie.title}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {movie.releaseYear}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="top-rated" className="mt-0">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Top Rated Movies</h2>
                </div>

                {isLoading ? (
                  <div className="text-center py-10">
                    Loading top rated movies...
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {topRatedMovies.map((movie, index) => (
                      <Card
                        key={index}
                        className="overflow-hidden bg-gray-900 border-gray-800 hover:border-gray-700 duration-300 transition-all cursor-pointer"
                        onClick={() => handleMovieClick(movie)}
                      >
                        <div className="relative aspect-[2/3]">
                          <img
                            src={
                              movie.posterUrl ||
                              "/placeholder.svg?height=450&width=300"
                            }
                            alt={movie.title}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-purple-400 text-purple-400" />
                              <span className="ml-1 text-sm font-medium">
                                {formatRating(movie.rating)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-medium line-clamp-1">
                            {movie.title}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {movie.releaseYear}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              {/* All Movies Section - Always visible regardless of tab selection */}
              <div className="mt-12">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">All Movies</h2>
                </div>

                {isLoading ? (
                  <div className="text-center py-10">Loading all movies...</div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {movies.map((movie, index) => (
                      <Card
                        key={index}
                        className="overflow-hidden bg-gray-900 border-gray-800 hover:border-gray-700 duration-300 transition-all cursor-pointer"
                        onClick={() => handleMovieClick(movie)}
                      >
                        <div className="relative aspect-[2/3]">
                          <img
                            src={
                              movie.posterUrl ||
                              "/placeholder.svg?height=450&width=300"
                            }
                            alt={movie.title}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-purple-400 text-purple-400" />
                              <span className="ml-1 text-sm font-medium">
                                {formatRating(movie.rating)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-medium line-clamp-1">
                            {movie.title}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {movie.releaseYear}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Tabs>
          </section>{" "}
          {/* My Watchlist */}
          <section className="container py-8">
            <h2 className="mb-6 text-2xl font-bold">My Watchlist</h2>

            {isLoadingWatchlist ? (
              <div className="text-center py-10">Loading your watchlist...</div>
            ) : watchlist.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {watchlist.map((item, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden bg-gray-900 border-gray-800 hover:border-gray-700 duration-300 transition-all cursor-pointer"
                    onClick={() => handleMovieClick(item.movie)}
                  >
                    <div className="relative aspect-[2/3]">
                      <img
                        src={
                          item.movie?.posterUrl ||
                          "/placeholder.svg?height=450&width=300"
                        }
                        alt={item.movie?.title}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-purple-400 text-purple-400" />
                          <span className="ml-1 text-sm font-medium">
                            {item.movie?.rating
                              ? formatRating(item.movie.rating)
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-medium line-clamp-1">
                        {item.movie?.title || "Unknown Title"}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {item.movie?.releaseYear || "N/A"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-400 mb-4">Your watchlist is empty.</p>
                <p className="text-gray-500">
                  Add movies to your watchlist by clicking "Add to Watchlist" on
                  any movie.
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
      {/* Movie Detail Modal */}{" "}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-7xl max-lg:max-w-4xl p-4 md:overflow-hidden max-h-[90vh]">
          {selectedMovie && (
            <div className="flex flex-col md:flex-row text-white max-sm:overflow-y-auto max-sm:max-h-full">
              {/* Left side: Movie Poster */}
              <div className="md:w-1/3 relative md:flex md:items-center md:justify-center max-sm:mb-4">
                <img
                  src={
                    selectedMovie.posterUrl ||
                    "/placeholder.svg?height=450&width=300"
                  }
                  alt={selectedMovie.title}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Right side: Movie Details */}
              <div className="md:w-2/3 p-6 space-y-4 md:overflow-y-auto md:max-h-[90vh] scrollbar-hide">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold">
                    {selectedMovie.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="flex items-center gap-2 text-gray-300">
                  {" "}
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-purple-400 text-purple-400" />
                    <span className="ml-1 font-medium">
                      {formatRating(selectedMovie.rating)}
                    </span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{selectedMovie.releaseYear}</span>
                  </div>
                </div>
                {selectedMovie.director && (
                  <div className="space-y-1">
                    <h4 className="font-semibold text-gray-400">Director:</h4>
                    <p>{selectedMovie.director}</p>
                  </div>
                )}
                {selectedMovie.genre && selectedMovie.genre.length > 0 && (
                  <div className="space-y-1">
                    <h4 className="font-semibold text-gray-400">Genre:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMovie.genre.map((g, i) => (
                        <Badge key={i} className="bg-gray-900">
                          {g}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {selectedMovie.cast && selectedMovie.cast.length > 0 && (
                  <div className="space-y-1">
                    <h4 className="font-semibold text-gray-400">Cast:</h4>
                    <p>{selectedMovie.cast.join(", ")}</p>
                  </div>
                )}
                {selectedMovie.synopsis && (
                  <div className="space-y-1">
                    <h4 className="font-semibold text-gray-400">Synopsis:</h4>
                    <p className="text-gray-300">{selectedMovie.synopsis}</p>
                  </div>
                )}{" "}
                <div className="flex gap-3 mt-4">
                  {selectedMovie.linkYoutube && (
                    <Button
                      className="gap-2 bg-white hover:bg-red-700 text-black hover:text-white duration-300 transition-all"
                      onClick={() =>
                        window.open(selectedMovie.linkYoutube, "_blank")
                      }
                    >
                      <Video className="h-4 w-4" />
                      Watch Trailer
                    </Button>
                  )}
                  <Button
                    className={`gap-2 duration-300 transition-all ${
                      isWatchlisted
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                    onClick={() => handleWatchlistToggle(selectedMovie)}
                    disabled={isAddingToWatchlist || isRemovingFromWatchlist}
                  >
                    {isAddingToWatchlist
                      ? "Adding..."
                      : isRemovingFromWatchlist
                      ? "Removing..."
                      : isWatchlisted
                      ? "Remove from Watchlist"
                      : "Add to Watchlist"}
                  </Button>
                </div>
                {/* Reviews Section */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4">Reviews</h3>

                  {isLoadingReviews ? (
                    <p className="text-gray-400">Loading reviews...</p>
                  ) : reviews && reviews.length > 0 ? (
                    <div className="space-y-4 pr-2">
                      {reviews.map((review, index) => (
                        <div key={index} className="bg-gray-900 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                              <User className="h-5 w-5 mr-2 text-gray-400" />
                              <span className="font-medium">
                                {review.user?.username || "Anonymous"}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-purple-400 text-purple-400" />
                              <span className="ml-1">{review.rating}</span>
                            </div>
                          </div>
                          <p className="text-gray-300 mb-2">{review.review}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">No reviews yet.</p>
                  )}
                </div>{" "}
                {/* Add Review Section - Only visible if user hasn't already reviewed */}
                {!hasUserReviewed ? (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Add a Review</h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <Label htmlFor="rating" className="block text-gray-300">
                          Rating
                        </Label>
                        <Input
                          id="rating"
                          type="number"
                          min="1"
                          max="10"
                          step="0.1"
                          value={reviewRating}
                          onChange={(e) => setReviewRating(e.target.value)}
                          className="mt-1 bg-gray-900 text-white"
                          placeholder="Enter your rating (1.00-10.00)"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="review" className="block text-gray-300">
                          Review
                        </Label>
                        <Textarea
                          id="review"
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          className="mt-1 bg-gray-900 text-white"
                          placeholder="Write your review here"
                          rows={3}
                          required
                        />
                      </div>{" "}
                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          className="flex-1 bg-purple-600 hover:bg-purple-700 duration-300 transition-all"
                          disabled={isSubmittingReview}
                        >
                          {isSubmittingReview ? (
                            <span className="loader"></span>
                          ) : (
                            "Submit Review"
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="mt-8 p-4 bg-purple-600 rounded-lg">
                    <p className="text-gray-300">
                      You've already submitted a review for this movie.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
