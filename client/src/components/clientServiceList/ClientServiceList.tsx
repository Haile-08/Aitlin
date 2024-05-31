import { useNavigate } from "react-router-dom";
import eye from '../../assets/show.png'


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ClientServiceList({Name, Service, Email, status, id}:any) {
  const navigate = useNavigate();

  const handleDocumentNav = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("id", id);
    urlParams.set("service", Service);
    urlParams.set("name", Name);
    const searchQuery = urlParams.toString();
    navigate(`/Client/Documents/bill/?${searchQuery}`);
  };

    return (
        <div className="w-[100%] h-[5%] md:h-[7%] mt-3 py-6 border-b-[1.5px] border-black border-opacity-50 flex justify-start items-center">
              <div className="ml-2 md:ml-6 w-[30%] md:w-[20%] h-[90%] flex justify-start items-center font-roboto font-light">
                <p className="opacity-50 font-roboto font-light">{Name}</p>
              </div>
              <div className="w-[30%] md:w-[20%] h-[90%] flex justify-start items-center font-roboto font-light">
                <p className="opacity-50 font-roboto font-light">{Service}</p>
              </div>
              <div className="w-[30%] h-[90%] hidden md:flex justify-start items-center font-roboto font-light">
                <p className="opacity-50 font-roboto font-light">{Email}</p>
              </div>
              <div className="w-[20%] md:w-[10%] h-[90%] flex justify-start items-center opacity-50 font-roboto font-light">
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
