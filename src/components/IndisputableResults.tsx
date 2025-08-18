import Image1 from "../assets/image1.png";
const IndisputableResults = () => {
  return (
    <div className='py-[4rem] bg-[#182439] text-white px-4'>
      <h2 className="text-3xl font-bold text-center max-w-[270px] md:max-w-[370px] mx-auto">Indisputable Results</h2>
      <div className='flex flex-col lg:flex-row items-center justify-between w-full max-w-[1140px] mx-auto mt-[3rem]'>
        <div className='w-full lg:w-[60%] flex flex-col gap-4'>
            <p className='mb-2 text-gray-400'>
              Our voting system ensures that all results are verifiable and tamper-proof. We use advanced cryptographic techniques to guarantee the integrity of every vote.
            </p>
            <p className='text-gray-400'>
              You and your voters can thus rest assured that no one in your election - not even yourself - can tamper with or improperly influence your election's results.
            </p>
        </div>

        <div className='w-full lg:w-[90%] flex justify-center mt-[2rem] md:mt-0'>
            <img
              src={Image1}
              alt="Indisputable Results"
              className='w-full lg:max-w-[1000px] rounded-xl'
            />
        </div>
      </div>
    </div>
  )
}

export default IndisputableResults
