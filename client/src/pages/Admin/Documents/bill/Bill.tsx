import {  useOutletContext } from "react-router-dom";
import { BillList, SkeletalLoading } from "../../../../components";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { retrieveService } from "../../../../hook/adminHook";
import empty from '../../../../assets/empty.svg';
import add from '../../../../assets/add.svg';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OutletContextType = [any, any, string, string];

function Bill() {
  const [setIsOpen, isOpen, filterBool, id] = useOutletContext() as OutletContextType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const token = useSelector((state: any) => state.auth.token);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const array = Array.from({ length: 9 });

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["bill", search],
    queryFn: () => retrieveService({page:"bill" ,filter: filterBool, search, token, id}),
  });

  useEffect(() => {
    queryClient.removeQueries();
    refetch();
  }, [filterBool, isOpen]);


  console.log("data", data);

  return (
    <>
      <div className="w-[95%] h-[15%] md:h-[10%]  flex justify-between items-center flex-row">
          <p className="font-roboto font-extrabold text-xl md:text-3xl">Facturas</p>
          <div className="flex ml-16 md:ml-0">
          <form className="w-[70%] m-0 md:w-[60%] md:mx-auto flex items-center justify-center" >   
              <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
              <input value={search} onChange={(e)=> setSearch(e.target.value)} type="search" id="default-search" className="block outline-none w-full px-5 md:px-10 py-3.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Buscar..." required />
              </div>
            </form>
            <button className="flex bg-primary-color font-roboto text-white justify-center items-center ml-2 md:ml-5 px-3 md:px-5 py-2 md:py-3 text-xs md:text-lg m-2 rounded-xl" onClick={()=> setIsOpen(true)}>
              <p className="hidden md:flex">Agregar factura</p>
              <img src={add} alt="add" className="flex md:hidden"/>
            </button>
            </div>
          </div>
          <div className="mb-2 w-[95%] h-[5%] md:h-[7%] rounded-xl  flex justify-start items-center bg-gray-100">
            <div className="ml-2 md:ml-6 w-[25%] h-[90%] flex justify-start items-center font-roboto font-medium">
              <p className="text-xs md:text-xl">Factura</p>
            </div>
            <div className="w-[50%] md:w-[30%] h-[90%] flex justify-start items-center font-roboto font-medium">
              <p className="text-xs md:text-xl">Periodo</p>
            </div>
            <div className="w-[50%] h-[90%] hidden md:flex justify-start items-center font-roboto font-medium">
              <p className="text-xs md:text-xl">Comentario</p>
            </div>
            <div className="w-[15%] h-[90%] flex justify-start items-center font-roboto font-medium">
              <p className="text-xs md:text-xl">Acción</p>
            </div>
          </div>
          <div className="w-[95%] h-[80%] rounded-xl overflow-y-auto scrollbar scrollbar-track-white scrollbar-thin scrollbar-thumb-primary-color flex justify-start items-center flex-col">
          {data?.data.length === 0 && <div className="w-full h-full flex items-center justify-center flex-col">
            <div className="w-80 h-80 bg-gray-200 bg-opacity-40 rounded-full flex items-center justify-center">
              <img src={empty} alt="empty" className="w-60 "/>
            </div>
            <p className="mt-10 font-thin text-3xl">No Result Found</p>
          </div>}
          {isLoading && array.map((_item, index)=>(
            <SkeletalLoading key={index}/>
           ))
          }
          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
            data?.data.map((bill: any, index: Number)=>(
              <BillList index={Number(index) + 1} period={bill?.period} comment={bill?.comment} id={bill._id}/>
            ))
          }
          </div>
        
    </>
  )
}

export default Bill
