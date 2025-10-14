import React, { useEffect } from "react";

const Banner: React.FC = () => {  
  const backgroundImages = [
    "https://img.pikbest.com/ai/illus_our/20230418/64e0e89c52dec903ce07bb1821b4bcc8.jpg!bw700",
    "https://th.bing.com/th/id/OIP.vzzxjOGyhBbQoaSUlXvIwQHaE8?w=297&h=198&c=7&r=0&o=7&cb=12&pid=1.7&rm=3",
    "https://th.bing.com/th/id/OIP.epQ3-fDwbFjCeT9FJ0zySAHaE4?w=349&h=188&c=7&r=0&o=7&cb=12&pid=1.7&rm=3",
    
]
    const [slide, setSlide] = React.useState(0);
    useEffect(() => {
      const interval = setInterval(() => {
        setSlide(prev => (prev + 1) % backgroundImages.length);
      }, 3000);
      return () => clearInterval(interval);
    }, []);
//  const handlePrevious = () => {
//   setSlide(prev => (prev - 1 + backgroundImages.length) % backgroundImages.length);
//  };
//  const handleNext = () => {
//   setSlide(prev => (prev + 1) % backgroundImages.length);
//  };
 
  return (
    <header className="relative h-[90vh] w-full text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImages[slide]})` }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

      <div className="relative z-10 h-full max-w-6xl mx-auto px-6 flex flex-col justify-center">
        <h2 className="text-4xl md:text-6xl font-extrabold max-w-2xl leading-tight">
          The Wandering Earth
        </h2>
        <p className="mt-4 text-sm md:text-base text-gray-200 max-w-xl">
          When the sun is about to burn out, humans build giant thrusters to
          move Earth to a new star system. A group of young people fight to
          save their planet.
        </p>
        <div className="mt-6 flex gap-3">
          <button className="px-5 py-2 rounded bg-white text-black font-semibold hover:bg-white/90 transition">
            ▶ Play
          </button>
          <button className="px-5 py-2 rounded bg-white/20 text-white font-semibold hover:bg-white/30 transition">
            More Info
          </button>
        </div>
        <div>
          {
            backgroundImages.map((slide, slideindex) => (
              <div
                key={slideindex}
                className="inline-block cursor-pointer flex justify-center items-center "
                onClick={() => setSlide(slideindex)}
              >
                <div
                  className={`w-10 h-6 mx-1 rounded overflow-hidden border-2 ${
                    slideindex === Number(slide) ? 'border-white' : 'border-gray-500 opacity-70'
                  }`}
                  style={{
                    backgroundImage: `url(${backgroundImages[slideindex]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    // opacity: slideindex === slide ? 1 : 0.6,
                  }}
                ></div>
              </div>
          ))
        }
          
        </div>
      </div>
    </header>
  );
};

export default Banner;

 
