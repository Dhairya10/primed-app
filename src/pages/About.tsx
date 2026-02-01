export function About() {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="pt-32 md:pt-40 lg:pt-48 pb-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 md:mb-12 text-center">
            Why Primed Exists
          </h1>

          <div className="space-y-6 md:space-y-8 text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed">
            <p>
              I transitioned from a <strong className="text-white">Software Developer to a PM role</strong> in early 2025 after 3 months of intense interview preparation. I tried scheduling mock interviews but ran into the same issues everyone faces - last-minute cancellations, generic sugar-coated feedback, and interviewers who weren't really invested.
            </p>

            <p>
              So I started experimenting with different AI tools to help me simulate real interviews. After a lot of trial and error, I found some workflows that actually worked. <strong className="text-white">Primed is basically a collection of these tools that helped me the most.</strong> 
            </p>

            <p>
              You can practice real voice interviews on topics you actually care about and get detailed, honest feedback right after. No scheduling. No flaky interviewers. Just practice.
            </p>

            <p>
              My aim is simple - to <strong className="text-white">improve the odds</strong> for anyone preparing for interviews. I went through this struggle myself, and I know how frustrating it is when you can't get quality practice. That gap between knowing your stuff and articulating it clearly? That's what we are fixing at Primed.
            </p>

            <div className="pt-4 md:pt-6">
              <p className="text-base md:text-lg lg:text-xl font-semibold text-white mb-4">
                - Dhairya
              </p>
              <div className="flex items-center gap-4 md:gap-6">
                <a
                  href="https://www.linkedin.com/in/dhairya-kumar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group touch-manipulation"
                  aria-label="LinkedIn Profile"
                >
                  <img
                    src="/src/assets/company-logos/linkedin.png"
                    alt="LinkedIn"
                    className="w-6 h-6 md:w-7 md:h-7 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                  />
                </a>
                <a
                  href="https://x.com/DhairyaKumar16"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group touch-manipulation"
                  aria-label="X Profile"
                >
                  <img
                    src="/src/assets/company-logos/x.png"
                    alt="X"
                    className="w-6 h-6 md:w-7 md:h-7 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

