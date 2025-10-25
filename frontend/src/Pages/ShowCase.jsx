
const ShowCase = () => {
  return (
    <div>
      <div className="relative">
        <div className="bg-linear-to-tr from-white to-amber-50 rounded-2xl p-1 shadow-lg">
            <div className="bg-white rounded-xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-4">
                <div>
                <h3 className="font-medium text-slate-800">Realtime Inference</h3>
                <p className="text-sm text-slate-500">Low-latency endpoints</p>
                </div>
                <div className="text-amber-600 font-semibold">99.9%</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-amber-50 rounded-lg p-3 text-sm text-slate-700">GPU & CPU autoscale</div>
                <div className="bg-amber-50 rounded-lg p-3 text-sm text-slate-700">Performance Evaluation</div>
                <div className="bg-amber-50 rounded-lg p-3 text-sm text-slate-700">Auto Recommended Model</div>
                <div className="bg-amber-50 rounded-lg p-3 text-sm text-slate-700">Manual or Auto Preprocessing</div>
            </div>
            </div>
        </div>

        <div className="absolute -right-8 -bottom-10 hidden md:block">
            <svg width="180" height="180" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="opacity-20">
            <defs>
                <linearGradient id="g" x1="0" x2="1">
                <stop stopColor="#FDE68A" offset="0" />
                <stop stopColor="#FDBA74" offset="1" />
                </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="90" fill="url(#g)" />
            </svg>
        </div>
        </div>
    </div>
  )
}

export default ShowCase
