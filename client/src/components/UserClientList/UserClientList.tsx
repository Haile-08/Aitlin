import { useNavigate } from "react-router-dom";

function UserClientList() {
    const navigate = useNavigate();

    const handleDocumentNav = (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      navigate('/Admin/Dashboard/Documents/bill');
    };
  
    return (
      <div className="w-[100%] h-[5%] md:h-[7%] mt-3 py-6 border-b-[1.5px] border-black flex justify-start items-center">
            <div className="ml-2 md:ml-6 w-[20%] h-[90%] flex justify-start items-center font-roboto font-light">
              <p className="text-xl">Lakshya Calhoun</p>
            </div>
            <div className="w-[20%] h-[90%] flex justify-start items-center font-roboto font-light">
              <p className="text-xs md:text-xl">Aaren Booth</p>
            </div>
            <div className="w-[30%] h-[90%] flex justify-start items-center font-roboto font-light">
              <p className="text-xs md:text-xl">lakshyacalhoun@gmail.com</p>
            </div>
            <div className="w-[15%] h-[90%] flex justify-start items-center font-roboto font-light">
              <p>Activo</p>
            </div>
            <div className="w-[15%] h-[90%] flex justify-start items-center font-roboto font-light">
              <button className="text-white bg-primary-color px-3 py-1 rounded-xl" onClick={handleDocumentNav}>Ver documentos</button>   
            </div>
          </div>
    )
}

export default UserClientList
