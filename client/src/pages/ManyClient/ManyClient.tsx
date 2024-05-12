/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import { ClientServiceList, Logout, NotificationData, SkeletalLoading } from "../../components";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "react-query";
import { useEffect, useState } from "react";
import { retrieveClientNotification, retrieveClientServices } from "../../hook/clientHook";
import empty from "../../assets/empty.svg";
import notify from '../../assets/notify.png';
import closeflat from '../../assets/closeflat.png';

function ManyClient() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useSelector((state: any) => state.auth.user);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const token = useSelector((state: any) => state.auth.token);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const array = Array.from({ length: 9 });
  const queryClient = useQueryClient();

  const { data, isPreviousData, refetch, isLoading } = useQuery({
    queryKey: ["service", page],
    queryFn: () => retrieveClientServices({page, clientId: user._id, search, token}),
    keepPreviousData: true,
  });
  const notification = useQuery({
    queryKey: ["client", user._id],
    queryFn: () => retrieveClientNotification({clientId: user._id, token}),
    staleTime: 20000 ,
  });

  useEffect(() => {
    queryClient.removeQueries();
    refetch();
  }, [search]);

  useEffect(()=>{
    notification.refetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[isNotificationOpen]);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("search",search);
    const searchQuery = urlParams.toString();
    navigate(`/Many/Client/?${searchQuery}`);
    refetch();
  }

  return (
    <div className="w-dvw h-dvh bg-banner-color flex justify-start items-center flex-col ">
        {isNotificationOpen&& <div className="w-dvw h-dvh flex justify-end items-center  absolute z-40" >
          <div className="h-dvh w-1/4 md:w-3/4 bg-primary-color bg-opacity-20 " onClick={()=>setIsNotificationOpen(false)}></div>
          <div className="h-dvh w-3/4 md:w-1/4 bg-white flex items-center flex-col">
            <div className="flex items-center justify-between w-[80%] mt-5 mb-10">
              <p className="text-2xl font-bold font-roboto">Notification</p>
              <img src={closeflat} alt="close" className="w-4 cursor-pointer" onClick={()=>setIsNotificationOpen(false)}/>
            </div>
            <div className="h-[90%] w-full flex justify-start flex-col items-center scrollbar scrollbar-track-white scrollbar-thin scrollbar-thumb-primary-color">
            {notification?.data?.data?.map((notify: any)=>(
              <NotificationData type={notify.type} link={notify.link} id={notify._id}/>
            ))}
            </div>
          </div>
        </div>}
        <div className="w-[95%] md:w-10/12 h-[10%] flex justify-between items-center">
            <p className="font-roboto font-extrabold text-2xl md:text-3xl">Dashboard</p>
            <div className="flex">
                <div className="mr-5 flex justify-center items-center">
                  {notification?.data?.data.length == 0? 
                  <div className="w-6 h-full flex justify-center items-start">
                    <p className="w-6 rounded-full flex justify-center items-center text-white bg-white"></p>
                  </div>
                  :  <div className="w-6 h-full flex justify-center items-start">
                      <p className="w-5 h-5 text-xs rounded-full flex justify-center items-center text-white bg-primary-color">{notification?.data?.data.length}</p>
                </div>
                  }
                  <img src={notify} alt="notification" className="h-8 cursor-pointer" onClick={()=>setIsNotificationOpen(true)}/>
                </div>
                <p className="mr-4 text-sm md:text-base bg-white rounded-xl shadow-md p-3 font-roboto">{user.Name}</p>
                <Logout/>
            </div>
        </div>
      <div className="w-full md:w-10/12 bg-white h-[90%] md:h-[87%] rounded-xl flex justify-start items-center flex-col shadow-md">
        <div className="w-[95%] h-[15%] md:h-[10%]  flex justify-between items-center flex-row">
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
          <div className="ml-2 md:ml-6 w-[30%] md:w-[20%] h-[90%] flex justify-start items-center font-roboto font-semibold">
            <p className="text-xs md:text-xl">Cliente</p>
          </div>
          <div className="w-[30%] md:w-[20%] h-[90%] flex justify-start items-center font-roboto font-semibold">
            <p className="text-xs md:text-xl">Servicio</p>
          </div>
          <div className="w-[30%] h-[90%] hidden md:flex justify-start items-center font-roboto font-semibold">
            <p className="text-xs md:text-xl">Email</p>
          </div>
          <div className="w-[20%] md:w-[15%] h-[90%] flex justify-start items-center font-roboto font-semibold">
            <p className="text-xs md:text-xl">Estatus</p>
          </div>
          <div className="w-[20%] md:w-[15%] h-[90%] flex justify-start items-center font-roboto font-semibold">
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
          {isLoading && array.map((_item, index)=>(
            <SkeletalLoading key={index}/>
           ))
          }
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
