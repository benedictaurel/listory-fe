import { Star, Calendar, User } from "lucide-react";
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

import ToKillAMockingBird from "../assets/ToKillAMockingBird.webp";
import NavbarHome from "@/components/navbarHome";

// Define book type
interface Book {
  id: string;
  title: string;
  rating: string;
  releaseYear: string;
  coverUrl: string;
  author?: string;
  genre?: string[];
  description?: string;
}

// Define review type
interface Review {
  id: string;
  userId: string;
  bookId: string;
  rating: string;
  review: string;
  createdAt: string;
  isReview?: boolean;
  user?: {
    username: string;
  };
}

// Define Bookmark item type
interface BookmarkItem {
  id: string;
  userId: string;
  bookId: string;
  book: Book;
  isAdded?: boolean;
}

export default function Home() {
  const navigate = useNavigate();
  const [books, setbooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedbook, setSelectedbook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState<boolean>(false);
  const [Bookmark, setBookmark] = useState<BookmarkItem[]>([]);
  const [isLoadingBookmark, setIsLoadingBookmark] = useState<boolean>(false);
  const [isAddingToBookmark, setIsAddingToBookmark] = useState<boolean>(false);
  const [isRemovingFromBookmark, setIsRemovingFromBookmark] =
    useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
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

    // Fetch books from API
    const fetchbooks = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://listory-backend.vercel.app/api/books"
        );
        const data = await response.json();
        setbooks(data.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
        setIsLoading(false);
      }
    };

    fetchbooks();
    fetchBookmark();
  }, [navigate]); // Function to fetch user's Bookmark
  const fetchBookmark = async () => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    try {
      setIsLoadingBookmark(true);
      const response = await fetch(
        `https://listory-backend.vercel.app/api/lists/books/${userId}`
      );
      const data = await response.json();

      const BookmarkItems = data.data.map((book: any) => {
        return {
          id: book.id.toString(),
          userId: userId,
          bookId: book.id.toString(),
          isAdded: true,
          book: {
            id: book.id.toString(),
            title: book.title,
            rating: book.rating.toString(),
            releaseYear: book.releaseYear.toString(),
            coverUrl: book.coverUrl,
            author: book.author,
            genre: book.genre,
            cast: book.cast,
            description: book.description,
            linkYoutube: book.linkYoutube,
          },
        };
      });

      setBookmark(BookmarkItems);

      // Update the current selected book's bookmark status if there is a selected book
      if (selectedbook) {
        const isInBookmark: boolean = BookmarkItems.some(
          (item: BookmarkItem) => item.bookId === selectedbook.id
        );
        setIsBookmarked(isInBookmark);
      }

      setIsLoadingBookmark(false);
    } catch (error) {
      console.error("Error fetching Bookmark:", error);
      setIsLoadingBookmark(false);
    }
  };

  // Function to handle book card click
  const handlebookClick = async (book: Book) => {
    setSelectedbook(book);
    setIsModalOpen(true);
    await fetchbookReviews(book.id);

    // Check if book is already in bookmark
    checkIsBookmarked(book.id);
  };

  // Helper function to check if a book is in the bookmark
  const checkIsBookmarked = (bookId: string) => {
    const isInBookmark = Bookmark.some((item) => item.bookId === bookId);
    setIsBookmarked(isInBookmark);
  };

  // Function to fetch book reviews
  const fetchbookReviews = async (bookId: string) => {
    if (!bookId) return;

    try {
      setIsLoadingReviews(true);
      const response = await fetch(
        `https://listory-backend.vercel.app/api/reviews/books/${bookId}`
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

      setReviews(reviewsWithUserData); // Check if the current user has already submitted a review using isReview field
      const currentUserId = localStorage.getItem("user_id");
      if (currentUserId) {
        // Check if any review has the current user's ID and isReview is true
        const userHasReviewed = data.data.some(
          (review: Review) =>
            review.userId == currentUserId
        );
        setHasUserReviewed(userHasReviewed);
      }

      setIsLoadingReviews(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setIsLoadingReviews(false);
    }
  };
  // Function to toggle book in Bookmark (add or remove)
  const handleBookmarkToggle = async (book: Book) => {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("Please log in to manage your Bookmark");
      return;
    }

    if (isBookmarked) {
      // Remove from bookmark
      await handleRemoveFromBookmark(book);
    } else {
      // Add to bookmark
      await handleAddToBookmark(book);
    }
  };

  // Function to add a book to the Bookmark
  const handleAddToBookmark = async (book: Book) => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    try {
      setIsAddingToBookmark(true);
      const response = await fetch(
        "https://listory-backend.vercel.app/api/lists/books",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            bookId: book.id,
          }),
        }
      );

      if (response.ok) {
        // Refresh Bookmark after adding
        await fetchBookmark();
        setIsBookmarked(true);
        alert(`${book.title} added to your Bookmark!`);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to add to Bookmark"}`);
      }
    } catch (error) {
      console.error("Error adding to Bookmark:", error);
      alert("Failed to add to Bookmark. Please try again.");
    } finally {
      setIsAddingToBookmark(false);
    }
  };

  // Function to remove a book from the Bookmark
  const handleRemoveFromBookmark = async (book: Book) => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    try {
      setIsRemovingFromBookmark(true);
      const response = await fetch(
        `https://listory-backend.vercel.app/api/lists/books/${userId}/${book.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Refresh Bookmark after removing
        await fetchBookmark();
        setIsBookmarked(false);
        alert(`${book.title} removed from your Bookmark!`);
      } else {
        const errorData = await response.json();
        alert(
          `Error: ${errorData.message || "Failed to remove from Bookmark"}`
        );
      }
    } catch (error) {
      console.error("Error removing from Bookmark:", error);
      alert("Failed to remove from Bookmark. Please try again.");
    } finally {
      setIsRemovingFromBookmark(false);
    }
  };

  // Function to submit a new book review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedbook) return;

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("Please log in to submit a review");
      return;
    }

    try {
      setIsSubmittingReview(true);
      const response = await fetch(
        `https://listory-backend.vercel.app/api/reviews/books/?bookId=${selectedbook.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            bookId: selectedbook.id,
            rating: reviewRating,
            review: reviewText,
            isReview: true,
          }),
        }
      );
      if (response.ok) {
        // Refresh reviews after adding
        await fetchbookReviews(selectedbook.id);
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

  // Get trending books (latest 6 by release year)
  const trendingbooks = [...books]
    .sort((a, b) => parseInt(b.releaseYear) - parseInt(a.releaseYear))
    .slice(0, 6);

  // Get top rated books (highest 6 by rating)
  const topRatedbooks = [...books]
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
                src={ToKillAMockingBird}
                alt="Featured content"
                className="object-cover brightness-65 w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                <Badge className="mb-2 bg-purple-400 text-black hover:bg-purple-500 duration-300 transition-all">
                  Featured
                </Badge>
                <h1 className="mb-2 text-4xl font-bold md:text-6xl">
                  To Kill a Mockingbird
                </h1>
                <div className="mb-4 flex items-center gap-4">
                  <span className="text-gray-300">1960</span>
                  <span className="text-gray-300">281 Pages</span>
                  <span className="text-gray-300">Harper Lee</span>
                </div>
                <p className="mb-2 max-w-2xl text-lg text-gray-200">
                  To Kill a Mockingbird is a 1960 Southern Gothic novel by
                  American author Harper Lee. It became instantly successful
                  after its release; in the United States, it is widely read in
                  high schools and middle schools.
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
                  <h2 className="text-2xl font-bold">Trending Books</h2>
                </div>

                {isLoading ? (
                  <div className="text-center py-10">
                    Loading trending books...
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {trendingbooks.map((book, index) => (
                      <Card
                        key={index}
                        className="overflow-hidden bg-gray-900 border-gray-800 hover:border-gray-700 duration-300 transition-all cursor-pointer"
                        onClick={() => handlebookClick(book)}
                      >
                        <div className="relative aspect-[2/3]">
                          <img
                            src={
                              book.coverUrl ||
                              "/placeholder.svg?height=450&width=300"
                            }
                            alt={book.title}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-purple-400 text-purple-400" />
                              <span className="ml-1 text-sm font-medium">
                                {formatRating(book.rating)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-medium line-clamp-1">
                            {book.title}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {book.releaseYear}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="top-rated" className="mt-0">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Top Rated Books</h2>
                </div>

                {isLoading ? (
                  <div className="text-center py-10">
                    Loading top rated books...
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {topRatedbooks.map((book, index) => (
                      <Card
                        key={index}
                        className="overflow-hidden bg-gray-900 border-gray-800 hover:border-gray-700 duration-300 transition-all cursor-pointer"
                        onClick={() => handlebookClick(book)}
                      >
                        <div className="relative aspect-[2/3]">
                          <img
                            src={
                              book.coverUrl ||
                              "/placeholder.svg?height=450&width=300"
                            }
                            alt={book.title}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-purple-400 text-purple-400" />
                              <span className="ml-1 text-sm font-medium">
                                {formatRating(book.rating)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-medium line-clamp-1">
                            {book.title}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {book.releaseYear}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              {/* All books Section - Always visible regardless of tab selection */}
              <div className="mt-12">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">All Books</h2>
                </div>

                {isLoading ? (
                  <div className="text-center py-10">Loading all books...</div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {books.map((book, index) => (
                      <Card
                        key={index}
                        className="overflow-hidden bg-gray-900 border-gray-800 hover:border-gray-700 duration-300 transition-all cursor-pointer"
                        onClick={() => handlebookClick(book)}
                      >
                        <div className="relative aspect-[2/3]">
                          <img
                            src={
                              book.coverUrl ||
                              "/placeholder.svg?height=450&width=300"
                            }
                            alt={book.title}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-purple-400 text-purple-400" />
                              <span className="ml-1 text-sm font-medium">
                                {formatRating(book.rating)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <h3 className="font-medium line-clamp-1">
                            {book.title}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {book.releaseYear}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Tabs>
          </section>{" "}
          {/* My Bookmark */}
          <section className="container py-8">
            <h2 className="mb-6 text-2xl font-bold">My Bookmark</h2>

            {isLoadingBookmark ? (
              <div className="text-center py-10">Loading your Bookmark...</div>
            ) : Bookmark.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {Bookmark.map((item, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden bg-gray-900 border-gray-800 hover:border-gray-700 duration-300 transition-all cursor-pointer"
                    onClick={() => handlebookClick(item.book)}
                  >
                    <div className="relative aspect-[2/3]">
                      <img
                        src={
                          item.book?.coverUrl ||
                          "/placeholder.svg?height=450&width=300"
                        }
                        alt={item.book?.title}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-purple-400 text-purple-400" />
                          <span className="ml-1 text-sm font-medium">
                            {item.book?.rating
                              ? formatRating(item.book.rating)
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-medium line-clamp-1">
                        {item.book?.title || "Unknown Title"}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {item.book?.releaseYear || "N/A"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-400 mb-4">Your Bookmark is empty.</p>
                <p className="text-gray-500">
                  Add books to your Bookmark by clicking "Add to Bookmark" on
                  any book.
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
      {/* book Detail Modal */}{" "}      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-7xl max-lg:max-w-4xl p-4 md:overflow-hidden max-h-[90vh]">
          {selectedbook && (
            <div className="flex flex-col md:flex-row text-white max-sm:overflow-y-auto max-sm:max-h-full">
              {/* Left side: book Poster */}
              <div className="md:w-1/3 relative md:flex md:items-center md:justify-center max-sm:mb-4">
                <img
                  src={
                    selectedbook.coverUrl ||
                    "/placeholder.svg?height=450&width=300"
                  }
                  alt={selectedbook.title}
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Right side: book Details */}
              <div className="md:w-2/3 p-6 space-y-4 md:overflow-y-auto md:max-h-[90vh] scrollbar-hide">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold">
                    {selectedbook.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="flex items-center gap-2 text-gray-300">
                  {" "}
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-purple-400 text-purple-400" />
                    <span className="ml-1 font-medium">
                      {formatRating(selectedbook.rating)}
                    </span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{selectedbook.releaseYear}</span>
                  </div>
                </div>
                {selectedbook.author && (
                  <div className="space-y-1">
                    <h4 className="font-semibold text-gray-400">Author:</h4>
                    <p>{selectedbook.author}</p>
                  </div>
                )}
                {selectedbook.genre && selectedbook.genre.length > 0 && (
                  <div className="space-y-1">
                    <h4 className="font-semibold text-gray-400">Genre:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedbook.genre.map((g, i) => (
                        <Badge key={i} className="bg-gray-900">
                          {g}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {selectedbook.description && (
                  <div className="space-y-1">
                    <h4 className="font-semibold text-gray-400">
                      Description:
                    </h4>
                    <p className="text-gray-300">{selectedbook.description}</p>
                  </div>
                )}{" "}
                <div className="flex gap-3 mt-4">
                  <Button
                    className={`gap-2 duration-300 transition-all ${
                      isBookmarked
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                    onClick={() => handleBookmarkToggle(selectedbook)}
                    disabled={isAddingToBookmark || isRemovingFromBookmark}
                  >
                    {isAddingToBookmark
                      ? "Adding..."
                      : isRemovingFromBookmark
                      ? "Removing..."
                      : isBookmarked
                      ? "Remove from Bookmark"
                      : "Add to Bookmark"}
                  </Button>{" "}
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
                      </div>
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
                  <div className="mt-8 p-4 bg-purple-600 rounded-lg mr-2">
                    <p className="text-gray-300">
                      You've already submitted a review for this book.
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
