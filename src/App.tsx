import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import VerseCard from "./VerseCard";
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VerseCard />} />
      </Routes>
    </Router>
  );
};

export default App;
