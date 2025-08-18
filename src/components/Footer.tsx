import { Link } from "react-router-dom";
import heroBg from "../assets/bg.webp";

const Footer = () => {
  return (
    <footer className="w-full">
      <div
        className="w-full flex items-center justify-center py-[3rem]"
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
        <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl items-center mx-auto justify-center text-center text-white px-4">
          <h2 className="text-xl md:text-xl lg:text-2xl">Start Making All Votes Matter</h2>
          <div className="mt-2 flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Link to={"/admin"} className="bg-blue-600 text-lg md:text-xl text-white py-2 px-8 rounded-full sm:w-auto">
              Become an Admin
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full bg-gray-700 flex items-center justify-center">
        <div className="flex sm:flex-row gap-4 sm:gap-8 py-4 px-4 w-full max-w-xl mx-auto justify-center items-center">
          <span className="text-white">Term</span>
          <span className="text-white">Privacy</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
