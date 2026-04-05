
export default function AcademicStaff() {
    const list = ["gazar.jpg", "yahya.jpg", "teto.jpeg"];
  return (
    <section className="w-full bg-slate-800 py-20 px-6 lg:px-24 flex flex-col xl:flex-row items-center justify-between gap-16 relative">
      <div className="flex-1 max-w-2xl text-left space-y-8 z-10">
        <div className="flex items-center space-x-3 text-emerald-500 font-semibold mb-2">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-lg">Academic Faculty</span>
        </div>
        
        <h2 className="text-white text-4xl lg:text-5xl font-bold leading-tight">
          World-Class Academic Staff
        </h2>
        
        <p className="text-gray-300 text-lg lg:text-xl leading-relaxed">
          Our academic structure is designed to provide comprehensive support to international students. From distinguished professors leading cutting-edge research to dedicated teaching assistants guiding practical sessions, our faculty is committed to your success.
        </p>
        
        <div className="flex flex-col space-y-6 pt-4">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-900/30 rounded-full border border-blue-400/20 shrink-0">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white text-xl font-semibold mb-1">Professors & Departments</h3>
              <p className="text-gray-400 md:leading-relaxed">
                Each faculty is divided into specialized departments led by experienced professors who define the curriculum and deliver core lectures.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-emerald-600/10 rounded-full border border-emerald-600/20 shrink-0">
              <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white text-xl font-semibold mb-1">Office Hours</h3>
              <p className="text-gray-400 md:leading-relaxed">
                Faculty members maintain regular weekly office hours specifically dedicated to answering student questions and providing academic guidance.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-900/30 rounded-full border border-blue-400/20 shrink-0">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white text-xl font-semibold mb-1">Direct Communication</h3>
              <p className="text-gray-400 md:leading-relaxed">
                Students can easily reach their professors and teaching assistants via the university's official email system and e-learning portal.
              </p>
            </div>
          </div>
        </div>

        <button className="px-8 py-4 bg-transparent border-2 border-emerald-600 text-emerald-500 font-medium rounded-xl hover:bg-emerald-600 hover:text-white transition-all flex items-center mt-6">
          View Staff Directory
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>

      <div className="flex-1 relative w-full h-[400px] md:h-[500px] xl:h-[600px] rounded-3xl overflow-hidden shadow-2xl z-10">
        <img 
          src="accademics/image-not-hero.png"
          alt="Staff" 
          className="w-full h-full object-cover"
        />
        <div className="absolute left-6 bottom-6 right-6 md:right-auto md:w-[350px] bg-blue-900/90 backdrop-blur-sm shadow-xl p-5 rounded-2xl border border-blue-500/30">
          <div className="flex items-center space-x-3 mb-3">
              <div className="flex -space-x-3">
                  {list.map((img, index) => (
                      <img
                          key={index}
                          src={`/accademics/${img}`}
                          alt="Faculty"
                          className="w-10 h-10 rounded-full border-2 border-blue-900 object-cover"
                      />
                  ))}
              </div>
            <div className="text-white font-bold">500+ Faculty</div>
          </div>
          <p className="text-blue-100 text-sm">
            Dedicated to international student excellence.
          </p>
        </div>
      </div>
    </section>
  );
}
