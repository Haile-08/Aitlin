import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { updateStatus } from "../../hook/adminHook";
import { useSelector } from "react-redux";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ServiceList({Name, Service, Email, status, id, page }: any) {
  const [check, setCheck] = useState(status);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const token = useSelector((state: any) => state.auth.token);
  const navigate = useNavigate();

  const { mutate } = useMutation(updateStatus, {
    onSuccess: (data) => {
      setCheck(data.updatedService.status);
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
    navigate(`/Admin/Dashboard/Documents/bill/?${searchQuery}`);
  };

  const handleChange = () => {
    const data = {
      id,
      status: !check,
    }
    mutate({data, token})
  }

  return (
    <div className="w-[100%] h-[5%] md:h-[7%] mt-3 py-6 border-b-[1.5px] border-black border-opacity-40 flex justify-start items-center">
          <div className="ml-2 md:ml-6 w-[20%] h-[90%] flex justify-start items-center font-roboto font-light">
            <p className="opacity-50 font-roboto font-light">{Name}</p>
          </div>
          <div className="w-[20%] h-[90%] flex justify-start items-center font-roboto font-light">
            <p className="opacity-50 font-roboto font-light">{Service}</p>
          </div>
          <div className="w-[30%] h-[90%] flex justify-start items-center font-roboto font-light">
            <p className="opacity-50 font-roboto font-light">{Email}</p>
          </div>
          <div className="w-[15%] h-[90%] flex justify-start items-center font-roboto font-light">
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
          <div className="w-[15%] h-[100%] flex justify-start items-center font-roboto font-light">
            <button className="text-white bg-primary-color px-6 py-2 rounded-xl" onClick={handleDocumentNav}>Ver documentos</button>   
          </div>
        </div>
  )
}

export default ServiceList;
