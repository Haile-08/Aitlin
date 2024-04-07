import { Back, DocumentModal, Logout } from "../../../components"
import arrowDown from '../../../assets/arrowDown.svg';
import arrowUp from '../../../assets/arrowUp.svg';
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

function Documents() {
  const [documents, setDocuments] = useState("bill");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleBillNav = (e: { preventDefault: () => void; })=>{
    e.preventDefault();
    setDocuments("bill");
    navigate('/Admin/Dashboard/Documents/bill');
    setIsOpen(false);
  }

  const handleBinnacleNav = (e: { preventDefault: () => void; }) =>{
    e.preventDefault();
    setDocuments("binnacle");
    navigate('/Admin/Dashboard/Documents/Binnacle');
    setIsOpen(false);
  }

  const handleNursesNav = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setDocuments('Nurses');
    navigate('/Admin/Dashboard/Documents/Nurses');
    setIsOpen(false)
  }

  return (
    <div className="w-dvw h-dvh bg-banner-color flex justify-start items-center flex-col">
        {isOpen && <DocumentModal setIsOpen={setIsOpen}/>}
        <div className="my-5 w-10/12 h-[7%] flex justify-between items-center">
            <div className="flex justify-center items-center">
                <Back />
                <p className="font-roboto font-extrabold text-2xl md:text-3xl">Ver documentos</p>
            </div>
            <div className="flex">
                <p className="mr-4 text-sm md:text-base bg-white rounded-xl shadow-md p-3 font-roboto">Haile Melaku</p>
                <Logout/>
            </div>
        </div>
        <div className="w-10/12 h-[3%] flex justify-between items-center">
          <div className="flex justify-center items-start flex-col ml-5">
            <h3 className="font-extrabold font-roboto text-2xl">Haile Melaku</h3>
            <p className="text-lg mt-1 font-light">Aaren Booth</p>
          </div>
        </div>
        <div className="my-3 w-10/12 h-[5%] flex justify-center items-center">
          <div className=" w-[70%] flex items-center justify-end">
            <button className={`mx-5 flex items-center justify-center px-10 py-2 ${documents == 'bill'? 'bg-primary-color' : 'bg-banner-color'} ${documents == 'bill'? 'text-white' : 'text-primary-color'} font-roboto rounded-2xl border-2 border-primary-color shadow-sm`} onClick={handleBillNav}>Factura</button>
            <button className={`mx-5 flex items-center justify-center px-10 py-2 ${documents == 'binnacle'? 'bg-primary-color' : 'bg-banner-color'} ${documents == 'binnacle'? 'text-white' : 'text-primary-color'} font-roboto rounded-2xl border-2 border-primary-color shadow-sm`} onClick={handleBinnacleNav}>Bitácora</button>
            <button className={`mx-5 flex items-center justify-center px-10 py-2 ${documents == 'Nurses'? 'bg-primary-color' : 'bg-banner-color'} ${documents == 'Nurses'? 'text-white' : 'text-primary-color'} font-roboto rounded-2xl border-2 border-primary-color shadow-sm`} onClick={handleNursesNav}>Enfermeras</button>
            </div>
          <div className="flex justify-end items-center w-[30%] cursor-pointer">
            <p className="mx-3 font-semibold text-primary-color ">Más reciente</p>
            <img src={arrowUp} alt="filter" />
            <img src={arrowDown} alt="filter" />
          </div>
        </div>
        <div className="w-10/12 bg-white h-[75%] rounded-xl flex justify-start items-center flex-col shadow-md">
          <Outlet context={[setIsOpen]}/>
        </div>
    </div>
  )
}

export default Documents
