import InterFace from './Pages/InterFace';
import './App.css';
import { Routes, Route } from "react-router-dom";
import GoToTesting from './components/GoToTesting';

function App() {

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 via-white to-orange-50 text-slate-800">
      <main className="max-w-6xl mx-auto px-6 py-12">
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <Routes>
            <Route path="/" element={<InterFace />} />
          </Routes>
        </section>
      </main>

    </div>
  );
}

export default App;
