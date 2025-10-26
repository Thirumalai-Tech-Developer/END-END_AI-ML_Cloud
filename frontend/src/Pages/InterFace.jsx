import UploadFiles from "../components/UploadFiles";
import ShowCase from "./ShowCase";

const InterFace = () => {
  return (
    <section className="py-10 px-4 sm:px-6 lg:px-16 bg-white rounded-2xl shadow-lg">
      <div className="max-w-6xl mx-auto text-center lg:text-left">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
          New — Alpha release
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-slate-900">
          Upload, Find, Deploy, and Manage AI Workflows — Faster
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0">
          An end-to-end cloud platform for experimentation, deployment, and
          monitoring of AI/ML models.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
          <a
            href="#"
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md shadow w-full sm:w-auto text-center"
          >
            Give a Try
          </a>
        </div>

        <ul className="mt-10 flex flex-col sm:flex-row sm:flex-wrap justify-center lg:justify-start gap-4 text-sm sm:text-base text-slate-600">
          <li className="flex items-center gap-2">
            <span className="text-amber-500">●</span> Auto Preprocessing
          </li>
          <li className="flex items-center gap-2">
            <span className="text-amber-500">●</span> Model performance
          </li>
          <li className="flex items-center gap-2">
            <span className="text-amber-500">●</span> Graph visualization
          </li>
        </ul>
      </div>

      <div className="mt-12">
        <UploadFiles />
      </div>

      <div className="mt-12">
        <ShowCase />
      </div>
    </section>
  );
};

export default InterFace;
