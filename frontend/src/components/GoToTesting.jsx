import { useState, useEffect } from "react";
import GraphShow from "./GraphShow";
import DownloadModel from "./DownloadModel";

const GoToTesting = () => {
  const [trainResult, setTrainResult] = useState("");
  const [testResult, setTestResult] = useState("");
  const [loadingTrain, setLoadingTrain] = useState(false);
  const [loadingTest, setLoadingTest] = useState(false);
  const [trainDots, setTrainDots] = useState(0);
  const [testDots, setTestDots] = useState(0);
  const [graphButtonClicked, setGraphButtonClicked] = useState(false);
  const [showGraphs, setShowGraphs] = useState(false);
  const [disapper, setDisapper] = useState(true);
  const [train, setTrain] = useState(false);


  const handleGraph = () => {
    if (train) {
      setShowGraphs(false);
      setDisapper(true);
      setTrain(false);
    } else {
      setShowGraphs(true);
      setDisapper(false);
      setTrain(true);
    }
  }

  // train animation
  useEffect(() => {
    let interval;
    if (loadingTrain) {
      interval = setInterval(() => {
        setTrainDots((prev) => (prev + 1) % 4);
      }, 100);
    } else {
      clearInterval(interval);
      setTrainDots(0);
    }
    return () => clearInterval(interval);
  }, [loadingTrain]);

  // test animation
  useEffect(() => {
    let interval;
    if (loadingTest) {
      interval = setInterval(() => {
        setTestDots((prev) => (prev + 1) % 4);
      }, 500);
    } else {
      clearInterval(interval);
      setTestDots(0);
    }
    return () => clearInterval(interval);
  }, [loadingTest]);

  const handleTrain = async () => {
    setLoadingTrain(true);
    setTrainResult("Training in progress");
    try {
      const res = await fetch("http://localhost:5000/train_ml");
      const data = await res.json();
      setTrainResult(data.message + " and the model name " + data.model || "✅ Training completed!");
    } catch (err) {
      setTrainResult("❌ Error: " + err.message);
    } finally {
      setGraphButtonClicked(true);
    }
    setLoadingTrain(false);
  }

  // const handleTest = async () => {
  //   setLoadingTest(true);
  //   setTestResult("Testing in progress");
  //   try {
  //     const res = await fetch("http://localhost:5000/test");
  //     const data = await res.json();
  //     setTestResult(data.message || "✅ Testing completed!");
  //   } catch (err) {
  //     setTestResult("❌ Error: " + err.message);
  //   }
  //   setLoadingTest(false);
  // };

  const animatedDots = (count) => ".".repeat(count)

  return (
    <section className="py-5 flex flex-col items-center justify-center gap-4">
      {disapper && (
      <div>
        <h1 className="text-2xl flex justify-center font-semibold text-orange-500">
          AI/ML Model Trainer
        </h1>

        <div className="flex justify-center my-5 gap-3">
          <button
            onClick={handleTrain}
            disabled={loadingTrain}
            className={`px-4 py-2 rounded-lg shadow text-white transition ${
              loadingTrain
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {loadingTrain ? "Training..." : "Train Model"}
          </button>
          {graphButtonClicked && (<button
            onClick={handleGraph}
            className="px-4 py-2 rounded-lg shadow text-white bg-blue-500 hover:bg-blue-600 transition"
          >
            View Graphs
          </button>)}
        </div>

        {trainResult && (
          <p
            className={`mt-3 text-lg font-medium ${
              trainResult.includes("progress")
                ? "text-yellow-400"
                : trainResult.includes("Error")
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {trainResult.includes("progress")
              ? `Training in progress${animatedDots(trainDots)}`
              : trainResult}
          </p>
        )}

        {testResult && (
          <p
            className={`mt-2 text-lg font-medium ${
              testResult.includes("progress")
                ? "text-yellow-400"
                : testResult.includes("Error")
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {testResult.includes("progress")
              ? `Testing in progress${animatedDots(testDots)}`
              : testResult}
          </p>
        )}
      </div>
    )}
    {train && (<div className="flex justify-center mt-6">
        <button
            onClick={handleGraph}
            className="px-4 py-2 rounded-lg shadow text-white bg-blue-500 hover:bg-blue-600 transition"
          >
            back to Training
          </button>
      </div>)}
      {showGraphs && <GraphShow />}
      {graphButtonClicked && <DownloadModel />}
    </section>
  )
}

export default GoToTesting;
