import { useNavigate } from "react-router-dom";


function ClientServiceList({Name, Service, Email, status, id}) {
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
              <div className="ml-2 md:ml-6 w-[20%] h-[90%] flex justify-start items-center font-roboto font-light">
                <p className="opacity-50 font-roboto font-light">{Name}</p>
              </div>
              <div className="w-[20%] h-[90%] flex justify-start items-center font-roboto font-light">
                <p className="opacity-50 font-roboto font-light">{Service}</p>
              </div>
              <div className="w-[30%] h-[90%] flex justify-start items-center font-roboto font-light">
                <p className="opacity-50 font-roboto font-light">{Email}</p>
              </div>
              <div className="w-[15%] h-[90%] flex justify-start items-center opacity-50 font-roboto font-light">
                {status? <p>Activo</p>: <p>Inactivo</p>}
              </div>
              <div className="w-[15%] h-[90%] flex justify-start items-center font-roboto font-light">
                <button className="text-white bg-primary-color px-3 py-1 rounded-xl" onClick={handleDocumentNav}>Ver documentos</button>   
              </div>
            </div>
      )
}

export default ClientServiceList
