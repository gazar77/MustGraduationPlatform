
export default function Postgraduate() {
  return (
    <section className="w-full bg-slate-800 py-20 px-6 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
        <div className="flex-1 space-y-8">
          <div className="inline-block px-4 py-1.5 bg-blue-900/50 border border-blue-800 rounded-full">
            <span className="text-blue-400 font-semibold text-sm">Advance Your Career</span>
          </div>
          
          <h2 className="text-white text-4xl lg:text-5xl font-bold leading-tight">
            Postgraduate Degrees
          </h2>
          
          <p className="text-gray-300 text-lg lg:text-xl leading-relaxed">
            Take your expertise to the next level. MUST offers specialized Master's and PhD programs designed to foster advanced research and professional leadership.
          </p>
          
          <ul className="space-y-4 pt-4">
            <li className="flex items-center text-gray-300 text-lg">
              <svg className="w-6 h-6 text-emerald-500 mr-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Advanced Research Facilities
            </li>
            <li className="flex items-center text-gray-300 text-lg">
              <svg className="w-6 h-6 text-emerald-500 mr-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              International Partnerships
            </li>
            <li className="flex items-center text-gray-300 text-lg">
              <svg className="w-6 h-6 text-emerald-500 mr-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Flexible Schedules for Professionals
            </li>
          </ul>

          <div className="pt-6">
            <button className="px-8 py-4 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20">
              Explore Programs
            </button>
          </div>
        </div>
        
        <div className="flex-1 relative w-full h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src="https://placehold.co/800x600?text=Postgraduate+Students" 
            alt="Postgraduate" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
          
          {/* Degree badges */}
          <div className="absolute bottom-8 left-8 right-8 flex flex-wrap gap-4">
            <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <span className="text-white font-bold text-lg">Master's (MSc/MA)</span>
            </div>
            <div className="px-6 py-3 bg-emerald-600/80 backdrop-blur-md rounded-xl border border-emerald-500/50">
              <span className="text-white font-bold text-lg">Doctorate (PhD)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
