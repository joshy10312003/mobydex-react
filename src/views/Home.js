import FeaturedView from "./home/FeaturedView";
import PopularMovieView from "./home/PopularMovieView";
import RatedView from "./home/RatedView";
import Test from "./home/test";
import NewlyReleasedView from "./home/NewlyReleasedView";

const Home = () => {
    return (
        <div className="bg-dark text-white m-0 w-100">
            <FeaturedView />
            <RatedView />
            <PopularMovieView />
            <NewlyReleasedView />
            <Test/>
        </div>
    );
}
export default Home;