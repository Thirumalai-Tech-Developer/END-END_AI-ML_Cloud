import { useState } from 'react'
import GoToTesting from './GoToTesting'

const PreProcess = () => {
  const [options, setOptions] = useState({
    cleanData: false,
    skewnessHandled: false,
    scalingDone: false,
    classification: false,
  })
  
  const [columns, setColumns] = useState([])
  const [targetColumn, setTargetColumn] = useState('')
  const [loadingCols, setLoadingCols] = useState(false)
  const [uploaded, setUploaded] = useState(false)

  const handleChange = (e) => {
    const { name, checked } = e.target
    setOptions((prev) => ({ ...prev, [name]: checked }))
  }

  const getTargetColumn = async () => {
    setLoadingCols(true)
    try {
      const res = await fetch('http://localhost:5000/columns')
      const data = await res.json()
      setColumns(data.columns || [])
    } catch (err) {
      console.error('Error fetching columns:', err)
      alert('❌ Failed to fetch dataset columns')
    }
    setLoadingCols(false)
  }

  const handleSubmit = async () => {
    if (!targetColumn) {
      alert('⚠️ Please select a target column!')
      return
    }

    const payload = { ...options, target: targetColumn }

    try {
      const res = await fetch('http://localhost:5000/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      alert(data.message || '✅ Data sent successfully')
      setUploaded(true)
    } catch (err) {
      console.error('Error:', err)
      alert('❌ Failed to send data')
    }
  }

  return (
    <div>
      {!uploaded && (
      <div className="flex flex-col gap-4 p-5 text-white bg-gray-900 rounded-xl">
        <h2 className="text-xl font-semibold mb-2">⚙️ Preprocessing Options</h2>
        {[
          { label: 'Clean Data', name: 'cleanData' },
          { label: 'Handle Skewness', name: 'skewnessHandled' },
          { label: 'Apply Scaling', name: 'scalingDone' },
          { label: 'Classification Mode(Otherwise Regression)', name: 'classification' },
        ].map((opt) => (
          <label key={opt.name} className="flex items-center gap-2">
            <input
              type="checkbox"
              name={opt.name}
              checked={options[opt.name]}
              onChange={handleChange}
              className="w-4 h-4"
            />
            {opt.label}
          </label>
        ))}

        <button
          onClick={getTargetColumn}
          disabled={loadingCols}
          className={`mt-3 py-2 px-4 rounded-lg font-medium transition ${
            loadingCols
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loadingCols ? 'Fetching Columns...' : '🔍 Show Dataset Columns'}
        </button>

        {columns.length > 0 && (
          <div className="mt-3">
            <h3 className="font-medium mb-1 text-orange-400">
              Select Target Column:
            </h3>
            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto border border-gray-700 p-2 rounded">
              {columns.map((col) => (
                <label key={col} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="targetColumn"
                    value={col}
                    checked={targetColumn === col}
                    onChange={(e) => setTargetColumn(e.target.value)}
                    className="w-4 h-4"
                  />
                  {col}
                </label>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="mt-4 bg-orange-500 hover:bg-orange-600 transition-all py-2 px-4 rounded-lg font-medium"
        >
          🚀 Send to Server
        </button>

        <pre className="text-sm mt-4 bg-gray-800 p-3 rounded-lg">
          {JSON.stringify({ ...options, targetColumn }, null, 2)}
        </pre>
      </div> )};
      {uploaded && <GoToTesting />}
    </div>
  )
}

export default PreProcess
