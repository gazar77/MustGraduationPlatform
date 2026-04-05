
export default function Advising() {
  return (
    <section className="w-full bg-[#0b132b] py-20 px-6 lg:px-24 border-t border-slate-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
        <div className="text-center mb-16 max-w-3xl flex flex-col items-center">
          <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-emerald-600/20">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-white text-4xl lg:text-5xl font-bold mb-6">
            Academic Advising & Registration
          </h2>
          <p className="text-gray-400 text-lg lg:text-xl">
            Your academic journey is guided every step of the way. Our advising system ensures you make the right choices for your degree, while our digital registration makes enrollment seamless.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 w-full mb-16">
          {/* Advising Card */}
          <div className="flex-1 bg-slate-800 p-8 rounded-3xl border border-emerald-600/20 shadow-xl shadow-slate-900">
            <h3 className="text-white text-3xl font-bold mb-6">What is Academic Advising?</h3>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Every international student is assigned a dedicated Academic Advisor from their faculty. Your advisor is a professor who helps you understand your study plan, monitors your academic progress, and guides your course selection to ensure timely graduation.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start text-gray-400">
                <svg className="w-6 h-6 text-emerald-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                Mandatory meeting before each registration period
              </li>
              <li className="flex items-start text-gray-400">
                <svg className="w-6 h-6 text-emerald-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                Guidance on prerequisite courses
              </li>
              <li className="flex items-start text-gray-400">
                <svg className="w-6 h-6 text-emerald-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                Support for academic challenges
              </li>
            </ul>
          </div>

          {/* Add/Drop System Card */}
          <div className="flex-1 bg-slate-800 p-8 rounded-3xl border border-emerald-600/20 shadow-xl shadow-slate-900">
            <h3 className="text-white text-3xl font-bold mb-6">Add/Drop System</h3>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              MUST offers a flexible Add/Drop period during the first two weeks of the Fall and Spring semesters (one week for Summer). This allows you to adjust your schedule after attending initial lectures without academic penalty.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start text-gray-400">
                <svg className="w-6 h-6 text-emerald-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                Add courses if seats are available
              </li>
              <li className="flex items-start text-gray-400">
                <svg className="w-6 h-6 text-emerald-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                Drop courses to manage workload
              </li>
              <li className="flex items-start text-gray-400">
                <svg className="w-6 h-6 text-emerald-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                Requires advisor approval
              </li>
            </ul>
          </div>
        </div>

        <div className="w-full text-center mb-10">
           <h3 className="text-white text-3xl font-bold">The Registration Process</h3>
        </div>

        <div className="flex flex-col lg:flex-row justify-center gap-6 w-full">
            {/* Step 1 */}
            <div className="flex-1 bg-slate-800 rounded-2xl p-6 border border-slate-700 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-900/30 flex items-center justify-center mb-4">
                    <span className="text-blue-400 font-bold text-xl">1</span>
                </div>
                <h4 className="text-white text-xl font-bold mb-2">Advising</h4>
                <p className="text-gray-400 text-sm">Meet with your advisor to discuss and approve your proposed course list.</p>
            </div>
            
            {/* Arrow */}
            <div className="hidden lg:flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </div>

            {/* Step 2 */}
            <div className="flex-1 bg-slate-800 rounded-2xl p-6 border border-slate-700 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-900/30 flex items-center justify-center mb-4">
                    <span className="text-blue-400 font-bold text-xl">2</span>
                </div>
                <h4 className="text-white text-xl font-bold mb-2">Course Selection</h4>
                <p className="text-gray-400 text-sm">Log into the student portal and select your approved courses and preferred times.</p>
            </div>

            {/* Arrow */}
            <div className="hidden lg:flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </div>

            {/* Step 3 */}
            <div className="flex-1 bg-slate-800 rounded-2xl p-6 border border-slate-700 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-900/30 flex items-center justify-center mb-4">
                    <span className="text-blue-400 font-bold text-xl">3</span>
                </div>
                <h4 className="text-white text-xl font-bold mb-2">Registration</h4>
                <p className="text-gray-400 text-sm">Submit your schedule. The system checks for prerequisites and time conflicts.</p>
            </div>

            {/* Arrow */}
            <div className="hidden lg:flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </div>

            {/* Step 4 */}
            <div className="flex-1 bg-emerald-600 rounded-2xl p-6 border border-emerald-500 shadow-lg shadow-emerald-600/20 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-xl">4</span>
                </div>
                <h4 className="text-white text-xl font-bold mb-2">Confirmation</h4>
                <p className="text-emerald-50 text-sm">Pay tuition fees to officially confirm your enrollment and finalize.</p>
            </div>
        </div>
      </div>
    </section>
  );
}
