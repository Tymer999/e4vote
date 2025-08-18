import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const plans = [
	{
		name: "Starter",
		price: "Free",
		features: [
			"Up to 50 voters",
			"1 active election",
			"Basic support",
			"Standard security",
		],
		highlight: false,
	},
	{
		name: "Pro",
		price: "$29",
		features: [
			"Up to 1,000 voters",
			"Unlimited elections",
			"Priority support",
			"Advanced security",
			"Custom branding",
		],
		highlight: true,
	},
	{
		name: "Enterprise",
		price: "Contact Us",
		features: [
			"Unlimited voters",
			"Unlimited elections",
			"Dedicated support",
			"Custom integrations",
			"White-label solution",
		],
		highlight: false,
	},
];

const Pricing = () => {
	return (
		<div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 pt-[2rem]">
			<Navbar />
			<main className="max-w-5xl mx-auto py-20 px-4 lg:h-[80vh]">
				<h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-10">
					Pricing Plans
				</h1>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{plans.map((plan, idx) => (
						<div
							key={idx}
							className={`rounded-xl shadow-lg p-8 flex flex-col items-center text-center bg-white/10 border ${
								plan.highlight
									? "border-blue-500 scale-105"
									: "border-gray-700"
							} transition`}
						>
							<h2 className="text-2xl font-bold text-white mb-2">
								{plan.name}
							</h2>
							<div className="text-3xl font-extrabold text-blue-400 mb-4">
								{plan.price}
								{plan.price !== "Free" &&
									plan.price !== "Contact Us" && (
										<span className="text-base text-gray-300 font-normal">
											/election
										</span>
									)}
							</div>
							<ul className="text-gray-200 text-left mb-6 space-y-2">
								{plan.features.map((feature, i) => (
									<li
										key={i}
										className="flex items-center gap-3 justify-center"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-6 w-6 text-blue-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
										<span className="text-sm md:text-base">
											{feature}
										</span>
									</li>
								))}
							</ul>
							{plan.price === "Free" ? (
								<Link
									to="/admin"
									className="mt-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all"
								>
									Get Started
								</Link>
							) : plan.price === "Contact Us" ? (
								<a
									href="#"
									className="mt-auto bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all"
								>
									Contact Us
								</a>
							) : (
								<a
									href="#"
									className="mt-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all"
								>
									Choose Plan
								</a>
							)}
						</div>
					))}
				</div>
			</main>
			<Footer />
		</div>
	);
};

export default Pricing;
