import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const faqs = [
  {
    question: "How do I register as a voter?",
    answer:
      "You will receive an invitation email from your election admin. Follow the link in the email to register and participate in the election.",
  },
  {
    question: "Is my vote anonymous?",
    answer:
      "Yes, all votes are strictly anonymous. The system does not track who voted for whom.",
  },
  {
    question: "How do I create a new election?",
    answer:
      "Admins can create a new election from the Admin Dashboard by clicking the '+ New Election' button and filling out the required details.",
  },
  {
    question: "Can I vote from my phone?",
    answer:
      "Absolutely! The platform is fully responsive and works on any device.",
  },
  {
    question: "What if I forget my password?",
    answer:
      "Use the 'Forgot password?' link on the login page to reset your password via email.",
  },
  {
    question: "Who can see the results?",
    answer:
      "Only authorized users (usually admins) can see detailed results until the election is completed and results are published.",
  },
];

const Help = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 min-h-screen pt-[2rem]">
      <Navbar />
      <main className="max-w-3xl mx-auto py-16 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-10">
          Help & Frequently Asked Questions
        </h1>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white/10 rounded-xl p-6 shadow border border-blue-900"
            >
              <h2 className="text-lg font-semibold text-blue-300 mb-2">
                {faq.question}
              </h2>
              <p className="text-gray-200">{faq.answer}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center text-gray-300">
          Still need help? Contact us at{" "}
          <a
            href="mailto:support@evote.com"
            className="text-blue-400 underline"
          >
            support@evote.com
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Help;