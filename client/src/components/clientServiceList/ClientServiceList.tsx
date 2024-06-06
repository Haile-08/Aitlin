import { useNavigate } from "react-router-dom";
import eye from '../../assets/show.png'
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useMutation } from "react-query";
import { updateNotificationStatus } from "../../hook/clientHook";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ClientServiceList({Name, Service, Email, status, id, page}:any) {
  const [check, setCheck] = useState(status);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const token = useSelector((state: any) => state.auth.token);
  const navigate = useNavigate();

  const { mutate } = useMutation(updateNotificationStatus, {
    onSuccess: (data) => {
      setCheck(data.data.Notification);
    },
    onError: () => {
      console.log("error")
    },
  });

  useEffect(()=>{
    setCheck(status);
  },[page]);

  const handleDocumentNav = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("id", id);
    urlParams.set("service", Service);
    urlParams.set("name", Name);
    const searchQuery = urlParams.toString();
    navigate(`/Client/Documents/bill/?${searchQuery}`);
  };

  const handleChange = () => {
    const data = {
      id,
      status: !check,
    }
    
    mutate({data, token})
  }

    return (
        <div className="w-[100%] h-[5%] md:h-[7%] mt-3 py-6 border-b-[1.5px] border-black border-opacity-50 flex justify-start items-center">
              <div className="ml-2 md:ml-6 w-[30%] md:w-[20%] h-[90%] flex justify-start items-center font-roboto font-light">
                <p className="opacity-50 font-roboto font-light">{Name}</p>
              </div>
              <div className="w-[30%] md:w-[20%] h-[90%] flex justify-start items-center font-roboto font-light">
                <p className="opacity-50 font-roboto font-light">{Service}</p>
              </div>
              <div className="w-[20%] h-[90%] hidden md:flex justify-start items-center font-roboto font-light">
                <p className="opacity-50 font-roboto font-light">{Email}</p>
              </div>
              <div className="w-[20%] h-[90%] flex justify-start items-center font-roboto font-light">
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
              <div className="w-[10%] md:w-[10%] h-[90%] flex justify-start items-center opacity-50 font-roboto font-light">
                {status? <p>Activo</p>: <p>Inactivo</p>}
              </div>
              <div className="w-[20%] md:w-[20%] h-[90%] flex justify-start items-center font-roboto font-light">
                <button className="w-full h-[50px] text-white bg-primary-color hidden md:flex md:justify-center md:items-center px-1 py-1 rounded-xl text-xs md:text-lg"  onClick={handleDocumentNav}>Ver documentos</button>   
                <button className="w-full h-[50px] text-white bg-white md:bg-primary-color flex md:hidden  rounded-xl text-xs md:text-base" onClick={handleDocumentNav}>
                  <img src={eye} alt="eye" className="w-[64%]" />  
                </button>
              </div>
            </div>
      )
}

export default ClientServiceList
