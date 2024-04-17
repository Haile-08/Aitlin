import { useSelector } from "react-redux";
import { ClientServiceList, Logout } from "../../components";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { retrieveClientServices } from "../../hook/clientHook";
import empty from "../../assets/empty.svg";

function ManyClient() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useSelector((state: any) => state.auth.user);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const token = useSelector((state: any) => state.auth.token);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  const { data, isPreviousData, refetch, isLoading } = useQuery({
    queryKey: ["service", page],
    queryFn: () => retrieveClientServices({page, clientId: user._id, search, token}),
    keepPreviousData: true,
  });

  useEffect(() => {
    refetch();
  }, []);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("search",search);
    const searchQuery = urlParams.toString();
    navigate(`/Many/Client/?${searchQuery}`);
    refetch();
  }

  console.log(data);

  return (
    <div className="w-dvw h-dvh bg-banner-color flex justify-start items-center flex-col ">
        <div className="w-10/12 h-[10%] flex justify-between items-center">
            <p className="font-roboto font-extrabold text-2xl md:text-3xl">Dashboard</p>
            <div className="flex">
                <p className="mr-4 text-sm md:text-base bg-white rounded-xl shadow-md p-3 font-roboto">{user.Name}</p>
                <Logout/>
            </div>
        </div>
      <div className="w-10/12 bg-white h-[87%] rounded-xl flex justify-start items-center flex-col shadow-md">
        <div className="w-[95%] h-[15%] md:h-[10%]  flex justify-between items-center flex-col md:flex-row">
            <p className="font-roboto font-extrabold text-2xl md:text-3xl">Servicio</p>
            <div className="flex">
            <form className="max-w-md mx-auto flex items-center justify-center" onSubmit={handleSubmit}>   
              <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
              <input  value={search} onChange={(e)=> setSearch(e.target.value)} type="search" id="default-search" className="block outline-none w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Buscar..." required />
              </div>
            </form>
            </div>
        </div>
        <div className="w-[95%] h-[5%] md:h-[7%] rounded-xl  flex justify-start items-center bg-gray-100">
          <div className="ml-2 md:ml-6 w-[20%] h-[90%] flex justify-start items-center font-roboto font-semibold">
            <p className="text-xs md:text-xl">Cliente</p>
          </div>
          <div className="w-[20%] h-[90%] flex justify-start items-center font-roboto font-semibold">
            <p className="text-xs md:text-xl">Servicio</p>
          </div>
          <div className="w-[30%] h-[90%] flex justify-start items-center font-roboto font-semibold">
            <p className="text-xs md:text-xl">Email</p>
          </div>
          <div className="w-[15%] h-[90%] flex justify-start items-center font-roboto font-semibold">
            <p className="text-xs md:text-xl">Estatus</p>
          </div>
          <div className="w-[15%] h-[90%] flex justify-start items-center font-roboto font-semibold">
            <p className="text-xs md:text-xl">Action</p>
          </div>
        </div>
        <div className="w-[95%] h-[70%] flex items-center justify-start flex-col">
          {data?.data.length === 0 && <div className="w-full h-full flex items-center justify-center flex-col">
            <div className="w-80 h-80 bg-gray-200 bg-opacity-40 rounded-full flex items-center justify-center">
              <img src={empty} alt="empty" className="w-60 z-50"/>
            </div>
            <p className="mt-10 font-thin text-3xl">No Result Found</p>
          </div>}
          {isLoading && <div className="w-[95%] h-[70%] bg-primary-color flex items-center justify-center absolute rounded-xl top-[10%] left-[8.35%] bg-opacity-20">
                <svg aria-hidden="true" className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-primary-on-hover" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
           </div>}
           {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data?.data.map((service: any)=>(
              <ClientServiceList Name={service?.clientName} Service={service?.serviceName} Email={service?.email} status={service?.status} id={service?._id}/>
            ))
          }
        </div>
        <div className="w-[95%] h-[10%] flex items-center justify-end bg-white">
        <nav className="flex items-center cursor-pointer justify-center shadow-sm" aria-label="Pagination">
        <button disabled={page === 0} onClick={()=>{
          if(page > 0){
            setPage(page - 1);
            refetch();
          }
        }} className="relative inline-flex items-center rounded-xl m-1 px-3 py-3 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
          <span className="sr-only">Previous</span>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
          </svg>
        </button>
        <a href="#" aria-current="page" className="relative z-10 inline-flex items-center bg-primary-color px-5 py-3 text-sm font-semibold rounded-xl mx-1 my-1 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">{page + 1}</a>
        <a href="#" className="relative inline-flex items-center px-5 py-3 text-sm font-semibold text-primary-color ring-1 ring-inset ring-gray-300 rounded-xl mx-1 my-1 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">{page + 2}</a>
        <a href="#" className="relative hidden items-center px-5 py-3 text-sm font-semibold text-primary-color ring-1 ring-inset ring-gray-300 rounded-xl mx-1 my-1 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex">{page + 3}</a>
        <button disabled={isPreviousData || !data?.hasMore} onClick={()=>{
          if(page >= 0){
            setPage(page + 1);
            refetch();
          }
        }} className="relative inline-flex cursor-pointer items-center px-3 py-3 text-gray-400 ring-1 ring-inset ring-gray-300 rounded-xl mx-1 my-1 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
          <span className="sr-only">Next</span>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
          </svg>
        </button>
      </nav>
        </div>
      </div>
    </div>
  )
}

export default ManyClient
