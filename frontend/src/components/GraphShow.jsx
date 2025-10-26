import { useEffect, useState } from "react";

const GraphShow = () => {
  const [graphs, setGraphs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGraphs = async () => {
      try {
        const res = await fetch("http://localhost:5000/graph");
        const data = await res.json();
        setGraphs(data.images || []); // assuming Flask returns { images: [...] }
      } catch (err) {
        console.error("Error fetching graphs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGraphs();
  }, []);

  return (
    <section className="p-6">
      <h1 className="text-2xl font-semibold text-center text-orange-500 mb-4">
        Generated Graphs
      </h1>

      {loading ? (
        <p className="text-center text-gray-400">Loading graphs...</p>
      ) : graphs.length === 0 ? (
        <p className="text-center text-red-400">No graphs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {graphs.map((img, i) => (
            <div
              key={i}
              className="rounded-lg overflow-hidden shadow-md hover:scale-105 transition"
            >
              <img
                src={`http://localhost:5000/graph/${img}`}
                alt={`Graph ${i + 1}`}
                className="w-full h-64 object-contain bg-gray-900"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default GraphShow;
