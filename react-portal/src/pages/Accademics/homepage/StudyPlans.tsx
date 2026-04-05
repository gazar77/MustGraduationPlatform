
export default function StudyPlans() {
  return (
    <section className="w-full bg-[#0b132b] py-20 px-6 lg:px-24 border-t border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-center mb-16 max-w-3xl">
          <h2 className="text-white text-4xl lg:text-5xl font-bold mb-6">
            Study Plans & Credit Hours
          </h2>
          <p className="text-gray-400 text-lg lg:text-xl">
            MUST operates on a modern Credit Hour System, giving you the flexibility to manage your academic load while ensuring you meet all graduation requirements.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 w-full items-start">
          {/* Left Column */}
          <div className="flex-1 w-full space-y-6">
            {/* Info Card 1 */}
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <h3 className="text-white text-2xl font-bold">The Credit Hour System</h3>
              </div>
              <p className="text-gray-300 text-lg mb-8">
                Instead of fixed yearly curriculums, your degree is measured in credit hours. One credit hour typically represents one hour of lecture or two hours of practical/lab work per week over a semester.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                  <p className="text-gray-300"><strong className="text-white">Standard Load:</strong> 12 to 18 credit hours per semester.</p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                  <p className="text-gray-300"><strong className="text-white">Duration:</strong> Most bachelor's programs require 130-160 total credits (approx. 4-5 years).</p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                  <p className="text-gray-300"><strong className="text-white">Prerequisites:</strong> Advanced courses require successful completion of foundational courses.</p>
                </div>
              </div>
            </div>

            {/* Info Card 2 */}
            <div className="bg-indigo-900 p-8 rounded-2xl border border-indigo-800 shadow-xl">
              <h3 className="text-white text-2xl font-bold mb-4">Need your specific plan?</h3>
              <p className="text-indigo-200 text-lg mb-8">
                Study plans vary significantly between faculties (e.g., Medicine vs. Business). Download the comprehensive guide for your specific faculty.
              </p>
              <button className="px-6 py-3 w-full bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition flex justify-center items-center">
                Download Full Study Plan
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Column (Table) */}
          <div className="flex-1 w-full bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
            <div className="bg-slate-700/50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-700">
              <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <h3 className="text-white text-xl font-bold">Sample Study Plan (First Year)</h3>
              </div>
              <span className="px-4 py-1.5 bg-blue-900/50 text-blue-300 text-sm font-medium rounded-full border border-blue-800/50">
                Example Only
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-300 border-collapse">
                <thead className="bg-slate-800 border-b border-slate-700 text-sm">
                  <tr>
                    <th className="px-6 py-4 font-bold">Year</th>
                    <th className="px-6 py-4 font-bold">Semester</th>
                    <th className="px-6 py-4 font-bold">Course Name</th>
                    <th className="px-6 py-4 font-bold text-center">Credits</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-slate-700/50">
                    <td className="px-6 py-4 text-white font-medium" rowSpan={4}>Year 1</td>
                    <td className="px-6 py-4">Fall</td>
                    <td className="px-6 py-4">English Language I</td>
                    <td className="px-6 py-4 text-center font-semibold">3</td>
                  </tr>
                  <tr className="border-b border-slate-700/50">
                    <td className="px-6 py-4">Fall</td>
                    <td className="px-6 py-4">Introduction to Computer Science</td>
                    <td className="px-6 py-4 text-center font-semibold">3</td>
                  </tr>
                  <tr className="border-b border-slate-700 border-b-2">
                    <td className="px-6 py-4">Fall</td>
                    <td className="px-6 py-4">Mathematics I</td>
                    <td className="px-6 py-4 text-center font-semibold">4</td>
                  </tr>
                  <tr className="border-b border-slate-700/50">
                    <td className="px-6 py-4">Spring</td>
                    <td className="px-6 py-4">English Language II</td>
                    <td className="px-6 py-4 text-center font-semibold">3</td>
                  </tr>
                  <tr className="border-b border-slate-700/50">
                    <td className="px-6 py-4">Year 1</td>
                    <td className="px-6 py-4">Spring</td>
                    <td className="px-6 py-4">Physics I</td>
                    <td className="px-6 py-4 text-center font-semibold">4</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">Year 1</td>
                    <td className="px-6 py-4">Spring</td>
                    <td className="px-6 py-4">Human Rights & Ethics</td>
                    <td className="px-6 py-4 text-center font-semibold">2</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-slate-700/40 p-5 flex justify-end items-center border-t border-slate-700">
              <span className="text-white font-semibold mr-4">Total First Year Credits:</span>
              <span className="text-emerald-500 font-bold text-lg">19</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
