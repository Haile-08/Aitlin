function ClientList() {
  return (
    <div className="w-[100%] h-[5%] md:h-[7%] mt-3 py-6 border-b-[1.5px] border-black flex justify-start items-center">
          <div className="ml-2 md:ml-6 w-[20%] h-[90%] flex justify-start items-center font-roboto font-light">
            <p className="text-xl">Lakshya Calhoun</p>
          </div>
          <div className="w-[20%] h-[90%] flex justify-start items-center font-roboto font-light">
            <p className="text-xs md:text-xl">Aaren Booth</p>
          </div>
          <div className="w-[30%] h-[90%] flex justify-start items-center font-roboto font-light">
            <p className="text-xs md:text-xl">lakshyacalhoun@gmail.com</p>
          </div>
          <div className="w-[15%] h-[90%] flex justify-start items-center font-roboto font-light">
            <div className="relative inline-block">
                <input type="checkbox" id="hs-large-solid-switch-with-icons" className="peer appearance-none relative w-[4.25rem] h-9 p-px bg-gray-100 border-transparent text-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:ring-blue-600 disabled:opacity-50 disabled:pointer-events-none checked:bg-primary-color checked:text-blue-600 checked:border-blue-600 focus:checked:border-blue-600 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-600 before:inline-block before:w-8 before:h-8 before:bg-white checked:before:bg-switch-btn before:translate-x-0 checked:before:translate-x-full before:rounded-full before:shadow before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 dark:before:bg-gray-400 dark:checked:before:bg-blue-200" />
                <label htmlFor="hs-large-solid-switch-with-icons" className="sr-only">switch</label>
                <span className="peer-checked:text-white text-gray-500 size-8 absolute top-0.5 start-0.5 flex justify-center items-center pointer-events-none transition-colors ease-in-out duration-200 font-roboto">
                    off
                </span>
                <span className="peer-checked:text-white text-gray-500 size-8 absolute top-0.5 end-0.5 flex justify-center items-center pointer-events-none transition-colors ease-in-out duration-200 font-roboto">
                    on
                </span>
            </div>
          </div>
          <div className="w-[15%] h-[90%] flex justify-start items-center font-roboto font-light">
            <button className="text-white bg-primary-color px-3 py-1 rounded-xl">Ver documentos</button>   
          </div>
        </div>
  )
}

export default ClientList
