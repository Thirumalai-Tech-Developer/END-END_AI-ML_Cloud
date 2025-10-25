import InterFace from './Pages/InterFace';
import UploadFiles from './components/UploadFiles';
import ShowCase from './Pages/ShowCase';
import './App.css';

function App() {


  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 via-white to-orange-50 text-slate-800">
      <main className="max-w-6xl mx-auto px-6 py-12">
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <InterFace />
          <UploadFiles />
          <ShowCase />
        </section>
      </main>

    </div>
  );
}

export default App;
