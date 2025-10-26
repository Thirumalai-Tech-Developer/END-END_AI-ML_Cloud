import InterFace from './Pages/InterFace';
import './App.css';
import { Routes, Route } from "react-router-dom";
import GoToTesting from './components/GoToTesting';

function App() {
  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 via-white to-orange-50 text-slate-800 flex flex-col">
      <main className="flex-1 px-4 sm:px-6 lg:px-12 py-10">
        <section className="w-full">
          <Routes>
            <Route path="/" element={<InterFace />} />
            <Route path="/testing" element={<GoToTesting />} />
          </Routes>
        </section>
      </main>
    </div>
  );
}

export default App;
