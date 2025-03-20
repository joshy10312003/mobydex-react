import { useEffect, useState } from "react";
import '../../style/card.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from "swiper/modules";
import 'swiper/css';
import Link from 'react';

const PopularMovieView = () => {
    const [movieDetails, setMovieDetails] = useState([]);
    const [genreList, setGenreList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MzJjZTRhNTJiMjhjYTcyYjVjNjViYWVkMGI3OGY4MiIsIm5iZiI6MTc0MDkxMjYzOS4yNzYsInN1YiI6IjY3YzQzN2ZmYTVlMWUzNThjNDRiMTI4YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mN-kk5w2tbnGvClSvc-LLu0xAKjQKAqU5J-c73U4Ujs'
        }
    };

    const fetchMovies = async () => {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`,
                options
            );
            const data = await response.json();

            const genreResponse = await fetch(
                "https://api.themoviedb.org/3/genre/movie/list?language=en",
                options
            );
            const genreData = await genreResponse.json();

            const filteredMovies = data.results
                .filter(movie => movie.poster_path !== null && movie.popularity >= 10) // Filter based on popularity
                .sort((a, b) => b.popularity - a.popularity); // Sort by highest popularity

            setMovieDetails(filteredMovies);
            setGenreList(genreData.genres);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const MovieCard = ({ movie }) => {
        const posterURL = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        const detailURL = `/movies/${movie.id}`;
        const genreNames = movie.genre_ids.map(id => {
            const genre = genreList.find(g => g.id === id);
            return genre ? genre.name : "Unknown";
        });

        return (
            <div className="card-panel">
                <div className="card shadow">
                    <img src={posterURL} className="card-img-top" alt={movie.title} />
                    <div className="card-body">
                        <p className="text-secondary d-inline-block align-middle card-text">
                            Popularity: {movie.popularity.toFixed(1)}
                        </p>
                        <p className="card-title">{movie.title}</p>
                        <div>
                            {genreNames.map((genre, index) => (
                                <span key={index} className="badge bg-secondary me-1">
                                    {genre}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="buttonBox">
                        <a href={detailURL} className="more-detail btn-primary">More Details</a>
                        <div className="buttonbg"/>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="m-0 w-100 py-5">
            <div className="prev col-2 d-inline-block align-center text-end">
                <button className="popular-view-prev btn text-light me-5 px-0 py-3">
                    <i className="bi bi-chevron-left fs-4"></i>
                </button>
            </div>
            <div className="col-8 d-inline-block">
                <div className="row paginationContainer">
                    <h1 className="title border-start border-5 border-warning px-3">Popular Movies</h1>
                    <span className="pageBox">
                        <div className="popular-view-pagination w-100"/>
                    </span>
                </div>
                <div className="row">
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <Swiper
                            slidesPerView={3}
                            pagination={{ el: '.popular-view-pagination', clickable: true, dynamicBullets: true }}
                            navigation={{ nextEl: '.popular-view-next', prevEl: '.popular-view-prev' }}
                            modules={[Navigation, Pagination]}
                            breakpoints={{
                                640: { slidesPerView: 2 },
                                1024: { slidesPerView: 4 },
                                1440: { slidesPerView: 5 },
                            }}
                        >
                            {movieDetails.map(movie => (
                                <SwiperSlide key={movie.id}>
                                    <MovieCard movie={movie} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>
            </div>
            <div className="next col-2 d-inline-block">
                <button className="popular-view-next btn text-light ms-5 px-0 py-3">
                    <i className="bi bi-chevron-right fs-4"></i>
                </button>
            </div>
        </div>
    );
};

export default PopularMovieView;
