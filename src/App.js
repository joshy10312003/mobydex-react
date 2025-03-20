import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './views/Home';
import MovieView from './views/main/MovieView';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/movies/:id" Component={MovieView}/>
        </Routes>
      </div>
    </div>
    
  );
}

export default App;
