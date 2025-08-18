import { FaLock, FaVoteYea, FaUserSecret } from "react-icons/fa";

const Services = () => {

  const services = [
    {
      title: "Online Elections",
      description:
        "Send your voters an email with secure, single-use voting links that ensure only authorized voters can vote, once.",
      icon: <FaVoteYea className="text-4xl text-[#111827]" />,
    },
    {
      title: "Secure Voting",
      description:
        "Our platform ensures that each vote is securely cast and counted, maintaining the integrity of the election process.",
      icon: <FaLock className="text-4xl text-[#111827]" />,
    },
    {
      title: "Voter Privacy",
      description:
        "We prioritize voter privacy, ensuring that all votes are anonymous and confidential.",
      icon: <FaUserSecret className="text-4xl text-[#111827]" />,
    },
  ]
  return (
    <div className="w-full items-center justify-center bg-[#111827] text-white text-center py-[4rem] px-4">
      <h2 className="text-3xl font-bold max-w-[270px] md:max-w-[370px] mx-auto">Our Voting Services</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-[1147px] mx-auto items-stretch mt-[3rem]">
        {services.map((item) => (
          <article
            className="flex flex-col hover:scale-105 transition-transform duration-300 items-center justify-center w-full bg-white/5 cursor-pointer rounded-xl p-6"
            key={item.title}
          >
            <div className="flex items-center justify-center bg-white w-[4.55rem] md:w-[5rem] aspect-square rounded-full mx-auto shadow">
              {item.icon}
            </div>
            <h3 className="text-xl font-semibold mt-4">{item.title}</h3>
            <p className="text-gray-400 mt-2">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Services;
