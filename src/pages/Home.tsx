
import Hero from "../components/Hero";
import Services from "../components/Services";
import Testimonies from "../components/Testimonies";
import WhyUs from "../components/WhyUs";
import OurSecurity from "../components/OurSecurity";
import IndisputableResults from "../components/IndisputableResults";
import Footer from "../components/Footer";
import OurTeam from "../components/OurTeam";

const Home = () => {
  return (
    <>
      <Hero />
      <Services />
      <Testimonies />
      <WhyUs />
      <OurTeam />
      {/* <IndisputableResults /> */}
      <OurSecurity />
      <IndisputableResults />
      <Footer />
    </>
  );
};

export default Home;
