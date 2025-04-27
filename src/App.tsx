import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import VerseCard from "./VerseCard";
import TestVanta from './TestVanta';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VerseCard />} />
        <Route path="/test" element={<TestVanta />} />
      </Routes>
    </Router>
  );
};

export default App;
