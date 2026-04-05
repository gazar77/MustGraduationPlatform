
export default function HowToApply() {
  const steps = [
    {
      num: '1',
      title: 'Choose Program',
      desc: 'Review our faculties and select the academic program that aligns with your career goals.',
    },
    {
      num: '2',
      title: 'Prepare Documents',
      desc: 'Gather your high school certificate, passport copy, and required medical documents.',
    },
    {
      num: '3',
      title: 'Submit Application',
      desc: 'Fill out the online application form for international students and upload your documents.',
      highlight: true
    },
    {
      num: '4',
      title: 'Pay Fees',
      desc: 'Pay the non-refundable application fee through our secure online payment portal.',
    },
    {
      num: '5',
      title: 'Wait for Approval',
      desc: 'Our admissions team will review your application and send an official acceptance letter.',
    }
  ];

  return (
    <section className="w-full bg-slate-800 py-20 px-6 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <div className="text-center mb-20 max-w-3xl">
          <h2 className="text-white text-4xl lg:text-5xl font-bold mb-6">
            How to Apply
          </h2>
          <p className="text-gray-400 text-lg lg:text-xl">
            A streamlined, five-step process designed specifically for international applicants to ensure a smooth transition to MUST.
          </p>
        </div>

        {/* Stepper container */}
        <div className="relative w-full mb-20">
          {/* Connecting line (hidden on mobile) */}
          <div className="hidden lg:block absolute top-[48px] left-[10%] right-[10%] h-1.5 bg-gray-700 z-0">
            <div className="h-full bg-gradient-to-r from-blue-900 to-emerald-600 rounded-full" style={{width: '60%'}}></div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between relative z-10 gap-10 lg:gap-4">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col flex-1 items-center text-center group">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl border-[6px] transition-all
                  ${step.highlight ? 'bg-emerald-600 border-emerald-900/30' : 'bg-slate-800 border-gray-700'}`}>
                  <span className={`text-2xl font-bold ${step.highlight ? 'text-white' : 'text-gray-300'}`}>
                    {step.num}
                  </span>
                </div>
                <h3 className="text-white text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed px-2">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button className="px-10 py-5 bg-emerald-600 text-white font-bold rounded-xl text-xl hover:bg-emerald-700 shadow-xl transition shadow-emerald-600/20">
          Start Application
        </button>
      </div>
    </section>
  );
}
