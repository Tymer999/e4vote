import Albert from "../assets/teams/Albert.webp";
import Hamza from "../assets/teams/Hamza.webp";
import Kakmel from "../assets/teams/Kakmel.webp";
import TymerDev from "../assets/teams/TymerDev.webp";


const teamMembers = [
	{
		name: 'Donyina Gabriel',
		role: 'Frontend Developer',
		img: TymerDev,
		bio: 'Passionate about building beautiful and functional user interfaces.',
	},
	{
		name: 'Amuah Asare Albert',
		role: 'Backend Developer',
		img: Albert,
		bio: 'Loves designing scalable backend systems and APIs.',
	},
	{
		name: 'Afari Kakmel',
		role: 'Project Manager',
		img: Kakmel,
		bio: 'Focused on creating intuitive and delightful user experiences.',
	},
	{
		name: 'Akurugu Hamzah',
		role: 'UI/UX Designer',
		img: Hamza,
		bio: 'Ensures the team stays on track and delivers quality work.',
	},
]

const OurTeam = () => {
	return (
		<div className="w-full bg-[#182439] py-[4rem] px-4">
			<h2 className="text-3xl font-bold text-center text-white mb-8 max-w-[270px] md:max-w-[370px] mx-auto">
				Meet Our Team
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1140px] mx-auto">
				{teamMembers.map((member, idx) => (
					<div
						key={idx}
						className="bg-[#111827] rounded-xl shadow flex flex-col items-center p-6 hover:scale-105 transition-transform duration-300 cursor-pointer"
					>
						<img
							src={member.img}
							alt={member.name}
							className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-blue-600"
						/>
						<h3 className="text-xl font-semibold text-white">
							{member.name}
						</h3>
						<p className="text-blue-300 font-medium mt-1">{member.role}</p>
						<p className="text-gray-300 mt-3 text-center text-sm">
							{member.bio}
						</p>
					</div>
				))}
			</div>
		</div>
	)
}

export default OurTeam
