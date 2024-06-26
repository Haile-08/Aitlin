function SkeletalLoading() {
  return (
    <div className="w-[100%] h-[5%] md:h-[7%] mt-3 py-5 md:py-6 border-b-[1.5px] flex justify-start items-center animate-pulse">
        <div className="ml-2 md:ml-6 w-[10%] md:w-[25%] h-[70%] flex justify-start items-center">
            <div className="w-[15%] h-full md:py-3 py-3 md:px-20 px-7 bg-gray-300 dark:bg-gray-600 rounded-full "></div>
        </div>
        <div className="w-[20%] md:w-[30%] hidden md:flex h-[70%] justify-start items-center">
            <div className="w-[20%] h-full py-3 px-20 bg-gray-300 dark:bg-gray-600 rounded-full "></div>
        </div>
        <div className="w-[30%] md:w-[50%] ml-10 md:ml-0 h-[70%] flex justify-start items-center">
            <div className="w-[35%] h-full py-3 px-20 bg-gray-300 dark:bg-gray-600 rounded-full "></div>
        </div>
        <div className="w-[50%] md:w-[15%] h-[80%] md:h-[100%] flex justify-end md:justify-start items-center">
            <div className="w-[7%] h-full py-5 px-10 md:px-20 bg-gray-300 dark:bg-gray-600 rounded-xl "></div>
        </div>
  </div>
  )
}

export default SkeletalLoading;
