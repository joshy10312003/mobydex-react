import { useEffect, useState, useRef } from "react";
import '../../style/card.css';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import 'swiper/css';

const UpcomingMovieView = () => {

    const [movieDetails, setMovieDetails] = useState([]); // USE ARRAY SO MULTIPLE OBJECTS CAN BE STORED
    const [genreList, setGenreList] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // LOADING STATE
    const swiperRef = useRef(null);

    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MzJjZTRhNTJiMjhjYTcyYjVjNjViYWVkMGI3OGY4MiIsIm5iZiI6MTc0MDkxMjYzOS4yNzYsInN1YiI6IjY3YzQzN2ZmYTVlMWUzNThjNDRiMTI4YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mN-kk5w2tbnGvClSvc-LLu0xAKjQKAqU5J-c73U4Ujs'
        }
    };

    const MovieCard = ({ movie }) => { // GENERATE MULTIPLE CARD
        const posterURL = `https://image.tmdb.org/t/p/w500${movie.poster_path}`; // THIS IS URL FOR IMAGE 
        const detailURL = `/movies/${movie.id}`;    // THIS IS THE LINK FOR THE BUTTON OR ANCHOR

        const genreNames = movie.genre_ids.map((id) => { 
            const genre = genreList.find((g) => g.id === id);
            return genre ? genre.name : "Unknown"; 
        });
        
        if(!isLoading){  
            return (
                <div className="card-panel">
                    <div className="card shadow">
                        <img src={posterURL} className="card-img-top" alt={movie.title} />
                        <div className="card-body">
                            <div className="mb-2">
                                <p className="text-secondary d-inline-block align-middle card-text">Date: {movie.release_date}</p>
                            </div>
                            <p className="card-title">{movie.title}</p>
                            <div>
                                {genreNames.map((genre, index) => (
                                    <div key={index} className="badge bg-secondary me-1">
                                        {genre}
                                    </div>
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
        }
        else {
            return (
                <div className="card" aria-hidden="true">
                    <img src="..." className="card-img-top" alt="..."/>
                    <div className="card-body">
                        <h5 className="card-title placeholder-glow">
                        <span class="placeholder col-6"></span>
                        </h5>
                        <p className="card-text placeholder-glow">
                        <span className="placeholder col-7"></span>
                        <span className="placeholder col-4"></span>
                        <span className="placeholder col-4"></span>
                        <span className="placeholder col-6"></span>
                        <span className="placeholder col-8"></span>
                        </p>
                        <a className="btn btn-primary disabled placeholder col-6" aria-disabled="true"></a>
                    </div>
                </div>
            )
        }
        
    };

    useEffect(() => {
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
    
                // Filter only movies that have been released (current date or earlier)
                const newlyReleasedMovies = data.results
                    .filter(movie => movie.poster_path !== null && new Date(movie.release_date) <= currentDate)
                    .sort((a, b) => new Date(b.release_date) - new Date(a.release_date)); // Sort latest first
    
                setIsLoading(false);
                setMovieDetails(newlyReleasedMovies);
                setGenreList(genreData.genres);
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };
    
        fetchMovies();
    }, []);
    

    return (
        <div className="m-0 w-100 py-5">
            <div className="prev col-2 d-inline-block align-center text-end">
                <button className="release-view-prev btn text-light me-5 px-0 py-3">
                    <i className="bi bi-chevron-left fs-4"></i>
                </button>
            </div>
            <div className="col-8 d-inline-block">  
                <div className="row paginationContainer">
                    <h1 className="title border-start border-5 border-warning px-3">Newly Released Movies</h1>
                    <span className="pageBox">
                        <div className="release-view-pagination w-100"/>
                    </span>
                </div>
                <div className="row">
                    {movieDetails.length > 0 ? ( 
        
                    <Swiper
                        slidesPerView={3} 
                        pagination={{ el: '.release-view-pagination', clickable: true, dynamicBullets: true }} 
                        navigation={{ nextEl: '.release-view-next', prevEl: '.release-view-prev' }}
                        modules={[Navigation, Pagination]}
                        breakpoints={{
                            640: { slidesPerView: 2},
                            1024: { slidesPerView: 4},
                            1440: { slidesPerView: 5},
                        }}
                        onSlideChange={() => console.log('slide change from new released movie slides')}
                        onSwiper={(swiper) => console.log(swiper)}
                    >
                            {movieDetails.map((movie) => (
                                <SwiperSlide key={movie.id}>
                                    <MovieCard movie={movie} />
                                </SwiperSlide>
                        ))}
                    </Swiper>

                    ) : (
                        <p>Loading...</p> 
                    )}
                </div>
            </div>
            <div className="next col-2 d-inline-block">
                <button className="release-view-next btn text-light ms-5 px-0 py-3">
                    <i className="bi bi-chevron-right fs-4"></i>
                </button>
            </div>
        </div>
    );
}

export default UpcomingMovieView;