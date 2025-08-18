import Footer from "../components/Footer";
import Navbar from "../components/Navbar";


const About = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 pt-[2rem]">
      <Navbar />
      <main className="min-h-[80vh] flex items-center justify-center">
        <div className="rounded-2xl shadow-2xl p-8 sm:p-12 w-full max-w-2xl">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            About EVote
          </h2>
          <p className="text-gray-200 text-lg text-center mb-6">
            EVote is a secure, modern online voting platform designed to make
            elections easy, transparent, and accessible for everyone. Our
            mission is to empower organizations, schools, and communities to run
            fair and efficient elections with confidence.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
            <div className="flex flex-col items-center">
              <span className="text-blue-400 text-4xl mb-2">🔒</span>
              <h3 className="text-xl font-semibold text-white mb-1">
                Secure & Private
              </h3>
              <p className="text-gray-300 text-center text-sm">
                Your votes are encrypted and your privacy is protected at every
                step.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-blue-400 text-4xl mb-2">⚡</span>
              <h3 className="text-xl font-semibold text-white mb-1">
                Fast & Reliable
              </h3>
              <p className="text-gray-300 text-center text-sm">
                Results are calculated instantly and accurately, with zero
                downtime.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-blue-400 text-4xl mb-2">💡</span>
              <h3 className="text-xl font-semibold text-white mb-1">
                Easy to Use
              </h3>
              <p className="text-gray-300 text-center text-sm">
                Intuitive interfaces for both voters and administrators.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-blue-400 text-4xl mb-2">🌍</span>
              <h3 className="text-xl font-semibold text-white mb-1">
                Accessible Anywhere
              </h3>
              <p className="text-gray-300 text-center text-sm">
                Participate in elections from any device, anywhere in the world.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
