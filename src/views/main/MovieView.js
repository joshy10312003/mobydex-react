import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import '../../style/loading.css';

const MovieView = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [movieDetails, setMovieDetails] = useState({});

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2MzJjZTRhNTJiMjhjYTcyYjVjNjViYWVkMGI3OGY4MiIsIm5iZiI6MTc0MDkxMjYzOS4yNzYsInN1YiI6IjY3YzQzN2ZmYTVlMWUzNThjNDRiMTI4YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mN-kk5w2tbnGvClSvc-LLu0xAKjQKAqU5J-c73U4Ujs'
        }
    };

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
            .then(res => res.json())
            .then(data => {
                setMovieDetails(data);
                setIsLoading(false);
            })
            .catch(err => console.error("Error fetching movie:", err));
    }, [id]);

    return (
        <div className="bg-dark text-white">
            {!isLoading ? (
                <div>
                    <h1>{movieDetails.title}</h1>
                </div>
                
            ) : (
                <div className="d-flex justify-content-center align-items-center p-5">
                    <div className="d-flex justify-content-middle align-middle h-100">
                        <div className="loader"/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieView;
