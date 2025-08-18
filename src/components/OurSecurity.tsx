import { FaUserSecret, FaLock, FaShieldAlt } from "react-icons/fa";

const OurSecurity = () => {
  const securityFeatures = [
    {
      title: "Anonymous",
      description:
        "We offer the strongest possible guarantee of voter anonymity: we simply do not track who votes for what; only who votes, and what the vote is.",
      icon: <FaUserSecret className="text-4xl text-[#111827]" />,
    },
    {
      title: "End-to-End Encryption",
      description:
        "All data is encrypted in transit and at rest, ensuring that your votes and personal information are secure.",
      icon: <FaLock className="text-4xl text-[#111827]" />,
    },
    {
      title: "Tamper-Proof",
      description:
        "Our platform uses blockchain technology to ensure that once a vote is cast, it cannot be altered or deleted.",
      icon: <FaShieldAlt className="text-4xl text-[#111827]" />,
    },
    // Add more security features as needed
  ];
  return (
    <div className="w-full items-center justify-center bg-[#111827] text-white text-center py-[4rem] px-4">
      <h2 className="text-3xl font-bold max-w-[270px] md:max-w-[370px] mx-auto">Secure and Trustworthy</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-[1147px] mx-auto items-stretch mt-[3rem]">
        {securityFeatures.map((item) => (
          <article
            className="flex flex-col items-center justify-center w-full bg-white/5 rounded-xl p-6"
            key={item.title}
          >
            <div className="flex items-center justify-center bg-white w-[4.55rem] md:w-[5rem] aspect-square rounded-full mx-auto shadow">
              {item.icon}
            </div>
            <h3 className="text-xl font-semibold mt-4">{item.title}</h3>
            <p className="text-gray-300 mt-2">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default OurSecurity;
