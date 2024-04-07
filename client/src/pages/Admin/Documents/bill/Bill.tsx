import { useOutletContext } from "react-router-dom";
import { InvoiceList } from "../../../../components";

function Bill() {
  const myArray = ["", "", "", "", "", "", "", "", "","", ""];
  const [setIsOpen] = useOutletContext();

  return (
    <>
          <div className="w-[95%] h-[15%] md:h-[10%]  flex justify-between items-center flex-col md:flex-row">
            <p className="font-roboto font-extrabold text-2xl md:text-3xl">Facturas</p>
            <div className="flex">
            <form className="max-w-md mx-auto flex items-center justify-center">   
              <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
              <input type="search" id="default-search" className="block outline-none w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Buscar..." required />
              </div>
            </form>
            <button className="flex bg-primary-color font-roboto text-white justify-center items-center px-5 py-2 text-xs md:text-lg m-2 rounded-xl" onClick={()=> setIsOpen(true)}>
              <p>Agregar factura</p>
            </button>
            </div>
          </div>
          <div className="mb-2 w-[95%] h-[5%] md:h-[7%] rounded-xl  flex justify-start items-center bg-gray-100">
            <div className="ml-2 md:ml-6 w-[25%] h-[90%] flex justify-start items-center font-roboto font-medium">
              <p className="text-xs md:text-xl">Factura</p>
            </div>
            <div className="w-[30%] h-[90%] flex justify-start items-center font-roboto font-medium">
              <p className="text-xs md:text-xl">Periodo</p>
            </div>
            <div className="w-[50%] h-[90%] flex justify-start items-center font-roboto font-medium">
              <p className="text-xs md:text-xl">Comentario</p>
            </div>
            <div className="w-[15%] h-[90%] flex justify-start items-center font-roboto font-medium">
              <p className="text-xs md:text-xl">Acción</p>
            </div>
          </div>
          <div className="w-[95%] h-[80%] rounded-xl overflow-y-auto scrollbar scrollbar-track-white scrollbar-thin scrollbar-thumb-primary-color flex justify-start items-center flex-col">
          {
            myArray.map(()=>(
              <InvoiceList/>
            ))
          }
          </div>
        
    </>
  )
}

export default Bill
