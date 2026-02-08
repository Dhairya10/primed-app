import { Dice } from '@/components/ui/Dice';

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center px-4 md:px-6 relative pt-20 md:pt-0">
      <div className="max-w-7xl mx-auto w-full relative z-10 -mt-20 md:mt-0">
        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          {/* Dice appears first on mobile with extra bottom padding to prevent 3D overflow */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end w-full pb-20 sm:pb-24 lg:pb-0 mb-6 sm:mb-8 lg:mb-0">
            <div className="w-[180px] md:w-[250px] lg:w-full flex items-center justify-center lg:justify-end">
              <Dice />
            </div>
          </div>

          {/* Text appears second on mobile - the large padding-bottom on dice prevents overlap */}
          <div className="order-2 lg:order-1 w-full text-center lg:text-left">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-4 md:mb-6 leading-[0.9]">
              <span className="block">Improve</span>
              <span className="block">your odds</span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-400 leading-relaxed">
              {/* <span className="block">Get the unbiased feedback you need to nail your next interview</span> */}
              <span className="block">Primed is an AI interview coach that prepares you for your dream job</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
