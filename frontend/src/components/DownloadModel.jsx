import React, { useState } from "react";

const DownloadModel = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleDownload = async () => {
    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("http://localhost:5000/best_model");
      if (!res.ok) throw new Error("Failed to fetch model");

      // Get the blob (file)
      const blob = await res.blob();

      // Detect filename from backend or set default
      const contentDisposition = res.headers.get("Content-Disposition");
      let filename = "best_model.pkl";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) filename = match[1];
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setStatus("✅ Model downloaded successfully!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Error downloading model");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-6 text-center">
      <h1 className="text-2xl font-semibold text-orange-500 mb-4">
        Download Trained Model
      </h1>

      <button
        onClick={handleDownload}
        disabled={loading}
        className={`px-6 py-3 rounded-lg text-white transition ${
          loading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-orange-500 hover:bg-orange-600"
        }`}
      >
        {loading ? "Downloading..." : "Download Model"}
      </button>

      {status && <p className="mt-4 text-gray-300">{status}</p>}
    </section>
  );
};

export default DownloadModel;
