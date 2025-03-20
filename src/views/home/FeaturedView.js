import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const FeaturedView = () => {
    const { id } = useParams();
    const [movieDetails, setMovieDetails] = useState({});
    const [genreNames, setGenreNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MzJjZTRhNTJiMjhjYTcyYjVjNjViYWVkMGI3OGY4MiIsIm5iZiI6MTc0MDkxMjYzOS4yNzYsInN1YiI6IjY3YzQzN2ZmYTVlMWUzNThjNDRiMTI4YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mN-kk5w2tbnGvClSvc-LLu0xAKjQKAqU5J-c73U4Ujs'
        }
    };

    const fetchMovie = async () => {
        if (retryCount >= 5) {
            setError("Failed to fetch a valid movie after multiple attempts.");
            setLoading(false);
            return;
        }

        try {
            const randomPage = Math.floor(Math.random() * 500) + 1;
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${randomPage}`,
                options
            );
            const data = await response.json();

            const genreResponse = await fetch(
                "https://api.themoviedb.org/3/genre/movie/list?language=en",
                options
            );
            const genreData = await genreResponse.json();

            if (!data.results || data.results.length === 0) {
                setRetryCount((prev) => prev + 1);
                fetchMovie(); // Retry if no movies found
                return;
            }

            const selectedMovie = data.results[0];

            if (!selectedMovie.poster_path || selectedMovie.vote_count < 4000 || selectedMovie.vote_average < 7) {
                setRetryCount((prev) => prev + 1);
                fetchMovie(); // Retry if movie doesn't meet criteria
                return;
            }

            setMovieDetails(selectedMovie);
            setLoading(false);

            const genreList = genreData.genres;
            const genreNames = selectedMovie.genre_ids.map((id) => {
                const genre = genreList.find((g) => g.id === id);
                return genre ? genre.name : "Unknown";
            });

            setGenreNames(genreNames);
        } catch (error) {
            console.error("Error fetching movie:", error);
            setError("An error occurred while fetching movie data.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovie(); // Fetch on mount
        const interval = setInterval(fetchMovie, 86400000); // Refresh every 24 hours

        return () => clearInterval(interval); // Cleanup on unmount
    }, [id]);

    const detailUrl = `/movies/${movieDetails.id}`;

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center bg-dark p-5">
                <div className="d-flex justify-content-middle align-middle h-100">
                    <span className="loader" />
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="bg-dark text-warning">{error}</div>;
    }

    return (
        <>
            {movieDetails && (
                <div className={`w-100 featured-view bg-dark text-light p-5 d-flex position-relative z-2 overflow-hidden mb-5
                    ${!movieDetails.poster_path ? "justify-content-center text-center" : ""}`}
                    style={{
                        paddingLeft: "50px",
                        background: "rgb(2,0,36)",
                        backgroundImage:
                            "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(52,52,91,1) 49%, rgba(17,17,79,1) 100%)",
                    }}
                >
                    <div className="details d-inline-block w-50 position-relative z-2 p-5">
                        <div className="text-start d-inline">
                            <h6 className="text-warning">Featured Today:</h6>
                            <div className="title display-4">
                                <Link className="text-white" to={detailUrl}>{movieDetails.title}</Link>
                            </div>
                            <div className="star">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-star-fill"
                                    viewBox="0 0 16 16"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194-3.046-2.969a.75.75 0 0 1 .416-1.28l4.21-.611 1.882-3.815A.75.75 0 0 1 8 .25z"
                                    />
                                </svg>
                                <span className="ms-2 text-secondary d-inline-block align-middle card-text">
                                    {movieDetails.vote_average}
                                </span>
                                <span className="ms-2 text-secondary d-inline-block align-middle card-text">
                                    ({new Intl.NumberFormat().format(movieDetails.vote_count)} votes)
                                </span>
                            </div>
                            <p className="overview mt-5">{movieDetails.overview}</p>
                            <div>
                                {genreNames.map((genre, index) => (
                                    <span key={index} className="badge bg-secondary me-1">
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {movieDetails.poster_path && (
                        <div className="w-50 d-inline-block text-center position-relative z-2">
                            <img className="img-fluid w-50"
                                src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                                alt="Movie Poster"
                            />
                        </div>
                    )}

                    {movieDetails.backdrop_path && (
                        <div className="backdrop position-absolute top-0 start-0 w-100 h-100 z-1" style={{ opacity: 0.1 }}>
                            <img className=""
                                src={`https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`}
                                alt="Movie Poster"
                            />
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default FeaturedView;
