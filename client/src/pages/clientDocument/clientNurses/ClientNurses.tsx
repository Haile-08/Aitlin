import { useOutletContext } from "react-router-dom";
import { ClientNurseList } from "../../../components";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { retrieveService } from "../../../hook/adminHook";
import { useSelector } from "react-redux";
import empty from '../../../assets/empty.svg';
import downloadIcon from '../../../assets/download.svg';

type OutletContextType = [boolean, string, string, string, string, string];

function ClientNurses() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [filterBool, id, _billArchive, _blogArchive, nurseArchive] = useOutletContext() as OutletContextType;  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const token = useSelector((state: any) => state.auth.token);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const handleDownload = async () => {
    try {
        const response = await fetch(`https://clientes.atend.mx/api/Archive/${nurseArchive}`);
        const blob = await response.blob();

        // Create a URL for the blob
        const blobUrl = window.URL.createObjectURL(blob);

        // Create a temporary link element
        const tempLink = document.createElement('a');
        tempLink.href = blobUrl;
        tempLink.setAttribute('download', nurseArchive); // Set the filename for download
        tempLink.click();

        // Clean up by revoking the blob URL after the download is complete
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('Error downloading file:', error);
    }
  };

  const { data, refetch } = useQuery({
    queryKey: ["nurse", search],
    queryFn: () => retrieveService({page:"nurses" ,filter: filterBool, search, token, id}),
  });

  useEffect(() => {
    queryClient.removeQueries();
    refetch();
  }, [filterBool]);


  return (
    <>
      <div className="w-[95%] h-[15%] md:h-[10%]  flex justify-between items-center flex-row">
            <p className="font-roboto font-extrabold text-xl md:text-3xl">Nurse</p>
            <div className="flex ml-16 md:ml-0">
            <form className="w-[70%] m-0 md:w-[60%] md:mx-auto flex items-center justify-center" >   
              <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
              <input value={search} onChange={(e)=> setSearch(e.target.value)} type="search" id="default-search" className="block outline-none w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Buscar..." required />
              </div>
            </form>
            <button onClick={handleDownload} className="flex bg-primary-color font-roboto text-white justify-center items-center px-5 py-2 text-xs md:text-lg m-2 rounded-xl">
              <p className="hidden md:flex">Descargar</p>
              <img src={downloadIcon} alt="add" className="flex md:hidden py-2"/>
            </button>
            </div>
          </div>
          <div className="mb-2 w-[95%] h-[5%] md:h-[7%] rounded-xl  flex justify-start items-center bg-gray-100">
            <div className="ml-2 md:ml-6 w-[35%] md:w-[25%] h-[90%] flex justify-start items-center font-roboto font-medium">
              <p className="text-xs md:text-xl">Nombre enfermera</p>
            </div>
            <div className="w-[40%] md:w-[30%] h-[90%] flex justify-start items-center font-roboto font-medium">
              <p className="text-xs md:text-xl">Archivo</p>
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
              <img src={empty} alt="empty" className="w-60"/>
            </div>
            <p className="mt-10 font-thin text-3xl">No Result Found</p>
          </div>}
          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data?.data.map((nurse: any)=>(
              <ClientNurseList Name={nurse?.Name} Archive={nurse?.Archive} comment={nurse?.comment} id={nurse._id} link={nurse?.files}/>
            ))
          }
          </div>
    </>
  )
}

export default ClientNurses
