const Navbar = () => {
    return (
        <nav className="navbar bg-dark text-white px-5 py-3 d-flex">
            <div className="nav-items d-flex gap-5 w-100 align-items-center px-5">
                <h1>Mobydex</h1>
                <input className="form-control w-25 text-black" type="text" placeholder="Search for movies..." />
                <a className="nav-link" href="/">Home</a>
                <a className="nav-link" href="/popular-movies">Popular</a>
                <a className="nav-link" href="/rated-movies">Top Rated</a>
                <a className="nav-link" href="/upcoming-movies">Upcoming</a>
                <a className="nav-link border-end " href="/discover">Discover</a>
            </div>
        </nav>
    );
}
export default Navbar;