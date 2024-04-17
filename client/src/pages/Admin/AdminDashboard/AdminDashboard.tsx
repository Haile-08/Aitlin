import { ServiceList, Logout, SkeletalLoading } from "../../../components"
import add from '../../../assets/add.svg';
import empty from "../../../assets/empty.svg";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {  useEffect, useState } from "react";
import { useQuery } from "react-query";
import { retrieveClients } from "../../../hook/adminHook";
import { RootState } from "../../../stores/store";

function AdminDashboard() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const [page, setPage] = useState(0);
  const array = Array.from({ length: 9 });

  const { data, isPreviousData, refetch, isLoading } = useQuery({
    queryKey: ["client", page],
    queryFn: () => retrieveClients({page, search, token}),
    keepPreviousData: false,
  });

  useEffect(() => {
    refetch();
  }, []);

  const handleAddServiceNav = (e: { preventDefault: () => void; }) =>{
    e.preventDefault();
    navigate('/Admin/Dashboard/Add/Service');
  }

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("search",search);
    const searchQuery = urlParams.toString();
    navigate(`/Admin/Dashboard/?${searchQuery}`);
    refetch();
  }

  console.log(data);

  return (
    <div className="w-dvw h-dvh bg-banner-color flex justify-start items-center flex-col ">
        <div className="w-10/12 h-[10%] flex justify-between items-center">
            <p className="font-roboto font-extrabold text-2xl md:text-3xl">Dashboard</p>
            <div className="flex">
                <p className="mr-4 text-sm md:text-base bg-white rounded-xl shadow-md p-3 font-roboto">{user?.Name}</p>
                <Logout/>
            </div>
        </div>
      <div className="w-10/12 bg-white h-[87%] rounded-xl flex justify-start items-center flex-col shadow-md">
        <div className="w-[95%] h-[15%] md:h-[10%]  flex justify-between items-center flex-col md:flex-row">
            <p className="font-roboto font-extrabold text-2xl md:text-3xl">Servicio</p>
            <div className="flex">
            <form  className="max-w-md mx-auto flex items-center justify-center" onSubmit={handleSubmit}>   
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
            <button className="flex bg-primary-color font-roboto text-white justify-center items-center px-4 py-3 text-xs md:text-lg m-2 rounded-2xl" onClick={handleAddServiceNav}>
              <img src={add} alt="add" className="mr-3" />
              <p>Agregar nuevo</p>
            </button>
            </div>
        </div>
        <div className="w-[95%] h-[5%] md:h-[7%] rounded-xl  flex justify-start items-center bg-gray-100">
          <div className="ml-2 md:ml-6 w-[20%] h-[90%] flex justify-start items-center font-roboto font-semibold">
            <p className="text-xs font-light md:text-xl">Cliente</p>
          </div>
          <div className="w-[20%] h-[90%] flex justify-start items-center font-roboto font-semibold">
            <p className="text-xs font-light md:text-xl">Servicio</p>
          </div>
          <div className="w-[30%] h-[90%] flex justify-start items-center font-roboto font-semibold">
            <p className="text-xs font-light md:text-xl">Email</p>
          </div>
          <div className="w-[15%] h-[90%] flex justify-start items-center font-roboto font-semibold">
            <p className="text-xs font-light md:text-xl">Estatus</p>
          </div>
          <div className="w-[15%] h-[90%] flex justify-start items-center font-roboto font-semibold">
            <p className="text-xs font-light md:text-xl">Action</p>
          </div>
        </div>
        <div className="w-[95%] h-[70%] flex items-center justify-start flex-col">
          {data?.services.length === 0 && <div className="w-full h-full flex items-center justify-center flex-col">
            <div className="w-80 h-80 bg-gray-200 bg-opacity-40 rounded-full flex items-center justify-center">
              <img src={empty} alt="empty" className="w-60 z-50"/>
            </div>
            <p className="mt-10 font-thin text-3xl">No Result Found</p>
          </div>}
          {isLoading && array.map((_item, index)=>(
            <SkeletalLoading key={index}/>
           ))
          }
          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data?.services.map((service: any)=>(
              <ServiceList Name={service?.clientName} Service={service?.serviceName} Email={service?.email} status={service?.status} id={service?._id} page={page}/>
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

export default AdminDashboard
