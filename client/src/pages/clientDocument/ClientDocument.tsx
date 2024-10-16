import { Back, Logout } from "../../components"
import arrowDown from '../../assets/arrowDown.svg';
import arrowUp from '../../assets/arrowUp.svg';
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useMutation, useQuery } from "react-query";
import { retrieveASingleService } from "../../hook/adminHook";
import { updateNotificationStatus } from "../../hook/clientHook";

function ClientDocument() {
    const [documents, setDocuments] = useState("bill");
    const [filterBool, setFilterBool] = useState(true);
    const [check, setCheck] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = useSelector((state: any) => state.auth.user);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const token = useSelector((state: any) => state.auth.token);
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const id: any = searchParams.get("id");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Service: any = searchParams.get("service");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Name: any = searchParams.get("name");

    const { data } = useQuery({
      queryKey: ["service", id],
      queryFn: () => retrieveASingleService({serviceId: id, token}),
      keepPreviousData: true,
    });

    const { mutate } = useMutation(updateNotificationStatus, {
      onSuccess: (data) => {
        console.log(data);
        setCheck(data?.data?.Notification);
      },
      onError: () => {
        console.log("error")
      },
    });

    const billArchive = data?.data[0].billArchive;
    const blogArchive = data?.data[0].blogArchive;
    const nurseArchive = data?.data[0].nurseArchive;

    useEffect(()=>{
      setCheck(data?.data[0].Notification);
    },[data]);
  
    const handleBillNav = (e: { preventDefault: () => void; })=>{
      e.preventDefault();
      setDocuments("bill");
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("id", id);
      urlParams.set("service", Service);
      urlParams.set("name", Name);
      const searchQuery = urlParams.toString();
      navigate(`/Client/Documents/bill/?${searchQuery}`);
    }
  
    // const handleBinnacleNav = (e: { preventDefault: () => void; }) =>{
    //   e.preventDefault();
    //   setDocuments("binnacle");
    //   const urlParams = new URLSearchParams(window.location.search);
    //   urlParams.set("id", id);
    //   urlParams.set("service", Service);
    //   urlParams.set("name", Name);
    //   const searchQuery = urlParams.toString();
    //   navigate(`/Client/Documents/Binnacle/?${searchQuery}`);
    // }
  
    // const handleNursesNav = (e: { preventDefault: () => void; }) => {
    //   e.preventDefault();
    //   setDocuments('Nurses');
    //   const urlParams = new URLSearchParams(window.location.search);
    //   urlParams.set("id", id);
    //   urlParams.set("service", Service);
    //   urlParams.set("name", Name);
    //   const searchQuery = urlParams.toString();
    //   navigate(`/Client/Documents/Nurses/?${searchQuery}`);
    // }

    const handleChange = () => {
      const info = {
        id: data.data[0]._id,
        status: !check,
      }
      mutate({data: info, token})
    }
  
    return (
      <div className="w-dvw h-dvh bg-banner-color flex justify-start items-center flex-col">
          <div className="mb-10 mt-2 w-[95%] md:w-10/12 h-[7%] flex justify-between items-center">
             {user.ServiceNumber == 1? 
              <div className="my-5 w-10/12 h-[7%] flex justify-between items-center">
                <p className="font-roboto font-extrabold text-xl md:text-2xl">Dashboard</p>
              </div> :
              <div className="flex justify-center items-center">
                <Back nav={'/Client'}/>
                <p className="font-roboto font-extrabold text-xl md:text-2xl">Ver documentos</p>
              </div>
              }
              <div className="flex justify-start items-center bg-white rounded-xl shadow-md px-5 py-1">
                <div className="flex items ">
                  <p className="px-2 md:flex items-center justify-center  hidden">Notifications</p>
                  <div className="relative inline-block ">
                    <input  checked={check} onChange={handleChange}  type="checkbox" id="hs-large-solid-switch-with-icons" className="peer appearance-none relative w-[4.25rem] h-9 p-px bg-gray-300 border-transparent text-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:ring-blue-600 disabled:opacity-50 disabled:pointer-events-none checked:bg-primary-color checked:text-blue-600 checked:border-blue-600 focus:checked:border-blue-600 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-600 before:inline-block before:w-8 before:h-8 before:bg-white checked:before:bg-switch-btn before:translate-x-0 checked:before:translate-x-full before:rounded-full before:shadow before:transform before:ring-0 before:transition before:ease-in-out before:duration-200 dark:before:bg-gray-400 dark:checked:before:bg-blue-200" />
                    <label htmlFor="hs-large-solid-switch-with-icons" className="sr-only">switch</label>
                    <span className="peer-checked:font-thin peer-checked:text-white text-gray-600 size-8 absolute top-0.5 start-0.5 flex justify-center items-center pointer-events-none transition-colors ease-in-out duration-200 font-roboto">
                      off
                    </span>
                    <span className="peer-checked:font-thin peer-checked:text-white text-gray-600 size-8 absolute top-0.5 end-0.5 flex justify-center items-center pointer-events-none transition-colors ease-in-out duration-200 font-roboto ">
                      on
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center bg-white rounded-xl w-auto">
                <p className="mr-2 break-keep text-nowrap text-sm md:text-base shadow-md px-2 py-3 font-light font-roboto">{user.Name}</p>
              </div>
              <Logout/>
            </div>
          <div className="w-[95%] md:w-11/12 ml-0 md:ml-32 h-[3%] flex justify-start md:justify-between items-center">
            <div className="flex justify-center items-start flex-col ml-2 md:ml-5">
              <h3 className="font-extrabold font-roboto text-base md:text-xl">{Name}</h3>
              <p className="text-sm md:text-base mt-1 font-normal">{Service}</p>
            </div>
          </div>
          <div className="my-3 w-[100%] md:w-10/12 mt-8 md:mt-4 h-[5%] flex justify-center items-center">
            <div className="mt-3 w-[70%] flex items-center justify-start">
              <button className={`mx-0 flex items-center justify-center px-2 md:px-10 py-2 ${documents == 'bill'? 'bg-primary-color' : 'bg-banner-color'} ${documents == 'bill'? 'text-white' : 'text-primary-color'} font-roboto rounded-2xl border-2 border-primary-color shadow-sm`} onClick={handleBillNav}>Factura</button>
              {/* <button className={`mx-1 md:mx-5 flex items-center justify-center px-2 md:px-10 py-2 ${documents == 'binnacle'? 'bg-primary-color' : 'bg-banner-color'} ${documents == 'binnacle'? 'text-white' : 'text-primary-color'} font-roboto rounded-2xl border-2 border-primary-color shadow-sm`} onClick={handleBinnacleNav}>Bitácora</button>
              <button className={`mx-1 md:mx-5 flex items-center justify-center px-2 md:px-10 py-2 ${documents == 'Nurses'? 'bg-primary-color' : 'bg-banner-color'} ${documents == 'Nurses'? 'text-white' : 'text-primary-color'} font-roboto rounded-2xl border-2 border-primary-color shadow-sm`} onClick={handleNursesNav}>Enfermeras</button> */}
              </div>
            <div className="flex justify-end items-center ml-2 md:ml-0 w-[20%] md:w-[30%] cursor-pointer" onClick={()=> setFilterBool(!filterBool)}>
              <p className="mx-3 font-semibold text-primary-color ">{filterBool? "Más reciente" : "Menos reciente"}</p>
              <img src={arrowUp} alt="filter" className="hidden md:flex" />
              <img src={arrowDown} alt="filter" className="hidden md:flex"/>
            </div>
          </div>
          <div className="w-[95%] md:w-10/12 bg-white h-[73%] md:h-[75%] rounded-xl flex justify-start items-center flex-col shadow-md">
            <Outlet context={[filterBool, id, billArchive, blogArchive, nurseArchive]}/>
          </div>
      </div>
    )
}

export default ClientDocument
