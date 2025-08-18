import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaLock, FaUsers, FaChartBar, FaMobileAlt, FaCogs, FaEnvelopeOpenText } from "react-icons/fa";

const services = [
	{
		icon: <FaLock className="text-4xl text-blue-600" />,
		title: "Secure Online Elections",
		desc: "Run elections with end-to-end encryption and voter anonymity. Only authorized voters can participate, and results are tamper-proof.",
		details: [
			"Advanced cryptographic security",
			"Tamper-proof ballot storage",
			"Audit trails for every election",
		],
	},
	{
		icon: <FaUsers className="text-4xl text-green-500" />,
		title: "Voter Management",
		desc: "Easily register, verify, and manage voters. Send secure voting links and track participation in real time.",
		details: [
			"Bulk voter import and export",
			"Voter verification and authentication",
			"Real-time participation tracking",
		],
	},
	{
		icon: <FaChartBar className="text-4xl text-yellow-500" />,
		title: "Transparent Results",
		desc: "View and share election results instantly. All votes are counted accurately and can be audited for transparency.",
		details: [
			"Live result dashboards",
			"Downloadable reports",
			"Public or private result sharing",
		],
	},
	{
		icon: <FaMobileAlt className="text-4xl text-purple-500" />,
		title: "Mobile Friendly",
		desc: "Vote and manage elections from any device. Our platform is fully responsive and easy to use on mobile, tablet, or desktop.",
		details: [
			"Responsive design for all screens",
			"No app download required",
			"Accessible voting experience",
		],
	},
	{
		icon: <FaCogs className="text-4xl text-pink-500" />,
		title: "Customizable Ballots",
		desc: "Create ballots for any type of election, from single-choice to ranked-choice and more.",
		details: [
			"Support for multiple voting methods",
			"Custom branding and instructions",
			"Flexible position and candidate setup",
		],
	},
	{
		icon: <FaEnvelopeOpenText className="text-4xl text-orange-500" />,
		title: "Automated Notifications",
		desc: "Keep voters informed with automated email notifications for registration, voting, and results.",
		details: [
			"Automated email reminders",
			"Customizable notification templates",
			"Status updates for admins and voters",
		],
	},
];

const Services = () => {
	return (
		<div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 min-h-screen pt-[2rem]">
			<Navbar />
			<main className="max-w-5xl mx-auto py-16 px-4">
				<h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-10">
					Our Services
				</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{services.map((service, idx) => (
						<div
							key={idx}
							className="bg-white/10 rounded-xl shadow-lg p-8 flex flex-col items-center text-center"
						>
							<div className="mb-4">{service.icon}</div>
							<h2 className="text-xl font-semibold text-white mb-2">
								{service.title}
							</h2>
							<p className="text-gray-300 mb-3">{service.desc}</p>
							<ul className="text-gray-400 text-sm text-left list-disc pl-5 space-y-1">
								{service.details.map((detail, i) => (
									<li key={i}>{detail}</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default Services;
