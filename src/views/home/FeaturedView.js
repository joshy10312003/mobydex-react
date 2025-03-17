import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const FeaturedView = () => {
    const {id} = useParams();
    const [movieDetails, setMovieDetails] = useState({});
    const [genreNames, setGenreNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MzJjZTRhNTJiMjhjYTcyYjVjNjViYWVkMGI3OGY4MiIsIm5iZiI6MTc0MDkxMjYzOS4yNzYsInN1YiI6IjY3YzQzN2ZmYTVlMWUzNThjNDRiMTI4YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mN-kk5w2tbnGvClSvc-LLu0xAKjQKAqU5J-c73U4Ujs'
        }
      };
    

    const fetchMovie = async () => {
        try {
            const randomPage = Math.floor(Math.random() * 500) + 1;
            const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${randomPage}`, options);
            const data = await response.json();

            const fetchGenres = await fetch("https://api.themoviedb.org/3/genre/movie/list?language=en", options);
            const genreData = await fetchGenres.json();

            if (data.results.length === 0) {
                fetchMovie(); // Retry if no movies found
            } else {
                if(data.results[0].poster_path === null){
                    fetchMovie();
                } else {
                    if (data.results[0].vote_count < 4000 || data.results[0].vote_average < 7) {
                        fetchMovie(); // Retry if movie rating is less than 7.5
                    } else {
                        setLoading(false);
                        const selectedMovie = data.results[0];
                        setMovieDetails(selectedMovie); // Set only one movie
                        
                        const genreList = genreData.genres; // Store genres in state
                        const genreNames = selectedMovie.genre_ids.map((id) => { 
                            const genre = genreList.find((g) => g.id === id);
                            return genre ? genre.name : "Unknown"; 
                        });
                        setGenreNames(genreNames);
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching movie:", error);
        }
    };

    useEffect(() => {
        fetchMovie(); // Fetch on mount
        const interval = setInterval(fetchMovie, 4000); // Refresh every 24 hours

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [id]);

    const detailUrl = `/movies/${movieDetails.id}`;

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error loading movie details.</p>;
    }

    return (
        <>
            {movieDetails ? (
                <div className={`w-100 featured-view bg-dark text-light p-5 d-flex position-relative z-2 overflow-hidden mb-5
                ${!movieDetails.poster_path ? "justify-content-center text-center" : ""}`}

                style={{
                    paddingLeft: "50px",
                    background: "rgb(2,0,36)",
                    backgroundImage:
                    "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(52,52,91,1) 49%, rgba(17,17,79,1) 100%)",
                }}>
                        <div className="details d-inline-block w-50 position-relative z-2 p-5">
                            <div className="text-start d-inline">
                                <h6 className="text-warning">Featured Today:</h6>
                                <div className="title display-4">
                                    <Link className="text-white " to={detailUrl}>{movieDetails.title}</Link>
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
                                    <span className="ms-2 text-secondary d-inline-block align-middle card-text">{movieDetails.vote_average}</span>
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
                        <>
                            {movieDetails.poster_path && (
                                <div className="w-50 d-inline-block text-center position-relative z-2">
                                    <img className="img-fluid w-50" 
                                        src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`} 
                                        alt="Movie Poster" 
                                    />
                                </div>
                            )}
                        </>

                        <>
                            {movieDetails.backdrop_path && (
                                <div className="backdrop position-absolute top-0 start-0 w-100 h-100 z-1" style={{ opacity: 0.1 }}>
                                    <img className="" 
                                        src={`https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`} 
                                        alt="Movie Poster" 
                                    />
                                </div>
                            )}
                        </>
                </div>
                
            ) : (
                <p>Loading...</p>
            )}
        </>
    );
}
export default FeaturedView;