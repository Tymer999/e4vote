const Testimonies = () => {
  const testimonials = [
    {
      text: "E4Vote's security features made it easy for us to audit our election while maintaining the secrecy of each voter's ballot. We had confidence the results accurately reflected the wishes of our voters.",
      author: "John Doe",
    },
    {
      text: "The user-friendly interface and robust security measures of E4Vote have transformed the way we conduct elections.",
      author: "Jane Smith",
    },
    {
      text: "E4Vote's commitment to voter privacy and election integrity is truly commendable.",
      author: "Alice Johnson",
    },
  ];  
  return (
    <div className="w-full items-center justify-center py-[4rem] bg-[#182439] px-4">
      <h2 className="text-3xl font-bold text-center text-white max-w-[270px] md:max-w-[370px] mx-auto">Our Customers Say it Best</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-[1140px] mx-auto items-stretch mt-[3rem]">
        {testimonials.map((item) => (
          <article
            key={item.author}
            className="flex hover:scale-105 transition-transform duration-300 flex-col justify-between w-full cursor-pointer bg-[#111827] py-8 px-6 rounded-3xl shadow"
          >
            <p className="text-gray-300 mt-2 text-left">
              {item.text}
            </p>
            <h4 className="text-lg font-semibold mt-6 text-right text-white">{item.author}</h4>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Testimonies
