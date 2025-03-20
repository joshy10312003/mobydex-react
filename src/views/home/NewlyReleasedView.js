import { useEffect, useState } from "react";
import '../../style/card.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from "swiper/modules";
import 'swiper/css';

const UpcomingMovieView = () => {
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
                `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1`,
                options
            );
            const data = await response.json();

            const genreResponse = await fetch(
                "https://api.themoviedb.org/3/genre/movie/list?language=en",
                options
            );
            const genreData = await genreResponse.json();

            const currentDate = new Date();

            // Filter movies with future release dates
            const upcomingMovies = data.results
                .filter(movie => movie.poster_path !== null && new Date(movie.release_date) >= currentDate)
                .sort((a, b) => new Date(a.release_date) - new Date(b.release_date)); // Sort earliest release first

            setMovieDetails(upcomingMovies);
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
                            Release Date: 
                            <div>{movie.release_date}</div>
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
                <button className="upcoming-view-prev btn text-light me-5 px-0 py-3">
                    <i className="bi bi-chevron-left fs-4"></i>
                </button>
            </div>
            <div className="col-8 d-inline-block">
                <div className="row paginationContainer">
                    <h1 className="title border-start border-5 border-warning px-3">Upcoming Movies</h1>
                    <span className="pageBox">
                        <div className="upcoming-view-pagination w-100"/>
                    </span>
                </div>
                <div className="row">
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <Swiper
                            slidesPerView={3}
                            pagination={{ el: '.upcoming-view-pagination', clickable: true, dynamicBullets: true }}
                            navigation={{ nextEl: '.upcoming-view-next', prevEl: '.upcoming-view-prev' }}
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
                <button className="upcoming-view-next btn text-light ms-5 px-0 py-3">
                    <i className="bi bi-chevron-right fs-4"></i>
                </button>
            </div>
        </div>
    );
};

export default UpcomingMovieView;
