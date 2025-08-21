import Navbar from "./Navbar";
import heroBg from "../assets/bg.webp";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <header
      className="w-full h-[60vh] md:h-[55vh] pt-[2rem] relative"
      style={{
        backgroundImage: `
          linear-gradient(rgba(17, 24, 39, 0.85), rgba(17, 24, 39, 0.85)),
          url('${heroBg}')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "darken",
      }}
    >
      <Navbar />

      <div className="w-full flex flex-col items-center justify-center h-full px-4 pb-[5rem]">
        <div className="max-w-[50rem] w-full text-center text-white">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            E4Vote: Effortless, Secure, and Affordable Online Elections
          </h2>

          <div className="w-[80%] mx-auto h-[1px] bg-gray-500 my-4" />

          <p className="max-w-xl mx-auto text-xs md:text-sm lg:text-base text-gray-400">
            EVoting empowers organizations of all sizes to run secure, transparent,
            and cost-effective elections online. Our platform is designed for
            simplicity and trust, making it easy to manage voters, cast ballots,
            and view results—anytime, anywhere.
          </p>
          <div className="mt-8 flex sm:flex-row items-center gap-4 justify-center">
            <Link to={"/vote"}>
              <button className="bg-transparent border border-white text-white py-3 px-8 rounded-full sm:w-auto transition hover:bg-white hover:text-[#111827] hover:border-white">
                Cast a Vote
              </button>
            </Link>
            <Link
              to={"/admin"}
              className="bg-[#000] border border-white text-white py-3 px-8 rounded-full sm:w-auto transition hover:bg-white hover:text-[#111827] hover:border-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
