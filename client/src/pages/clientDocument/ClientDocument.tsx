import { Back, DocumentModal, Logout } from "../../components"
import arrowDown from '../../assets/arrowDown.svg';
import arrowUp from '../../assets/arrowUp.svg';
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@reduxjs/toolkit/query";

function ClientDocument() {
    const [documents, setDocuments] = useState("bill");
    const [filterBool, setFilterBool] = useState(true);
    const user = useSelector((state: RootState) => state.auth.user);
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const id: string | null = searchParams.get("id");
    const Service: string | null = searchParams.get("service");
    const Name: string | null = searchParams.get("name");
  
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
  
    const handleBinnacleNav = (e: { preventDefault: () => void; }) =>{
      e.preventDefault();
      setDocuments("binnacle");
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("id", id);
      urlParams.set("service", Service);
      urlParams.set("name", Name);
      const searchQuery = urlParams.toString();
      navigate(`/Client/Documents/Binnacle/?${searchQuery}`);
    }
  
    const handleNursesNav = (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      setDocuments('Nurses');
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("id", id);
      urlParams.set("service", Service);
      urlParams.set("name", Name);
      const searchQuery = urlParams.toString();
      navigate(`/Client/Documents/Nurses/?${searchQuery}`);
    }
  
    return (
      <div className="w-dvw h-dvh bg-banner-color flex justify-start items-center flex-col">
          <div className="mb-5 mt-2 w-10/12 h-[7%] flex justify-between items-center">
             {user.ServiceNumber == 1? 
              <div className="my-5 w-10/12 h-[7%] flex justify-between items-center">
                <p className="font-roboto font-extrabold text-xl md:text-2xl">Dashboard</p>
              </div> :
              <div className="my-5 flex justify-center items-center">
                  <Back nav={'/Client'}/>
                  <p className="font-roboto font-extrabold text-xl md:text-2xl">Ver documentos</p>
              </div>  }
              <div className="flex">
                  <p className="mr-4 text-sm md:text-base bg-white rounded-xl shadow-md px-2  py-0 flex justify-center items-center font-light font-roboto">{user.Name}</p>
                  <Logout/>
              </div>
          </div>
          <div className="w-11/12 ml-32 h-[3%] flex justify-between items-center">
            <div className="flex justify-center items-start flex-col ml-5">
              <h3 className="font-extrabold font-roboto text-xl">{Name}</h3>
              <p className="text-base mt-1 font-normal">{Service}</p>
            </div>
          </div>
          <div className="my-3 w-10/12 h-[5%] flex justify-center items-center">
            <div className=" w-[70%] flex items-center justify-end">
              <button className={`mx-5 flex items-center justify-center px-10 py-2 ${documents == 'bill'? 'bg-primary-color' : 'bg-banner-color'} ${documents == 'bill'? 'text-white' : 'text-primary-color'} font-roboto rounded-2xl border-2 border-primary-color shadow-sm`} onClick={handleBillNav}>Factura</button>
              <button className={`mx-5 flex items-center justify-center px-10 py-2 ${documents == 'binnacle'? 'bg-primary-color' : 'bg-banner-color'} ${documents == 'binnacle'? 'text-white' : 'text-primary-color'} font-roboto rounded-2xl border-2 border-primary-color shadow-sm`} onClick={handleBinnacleNav}>Bitácora</button>
              <button className={`mx-5 flex items-center justify-center px-10 py-2 ${documents == 'Nurses'? 'bg-primary-color' : 'bg-banner-color'} ${documents == 'Nurses'? 'text-white' : 'text-primary-color'} font-roboto rounded-2xl border-2 border-primary-color shadow-sm`} onClick={handleNursesNav}>Enfermeras</button>
              </div>
            <div className="flex justify-end items-center w-[30%] cursor-pointer" onClick={()=> setFilterBool(!filterBool)}>
              <p className="mx-3 font-semibold text-primary-color ">{filterBool? "Más reciente" : "Menos reciente"}</p>
              <img src={arrowUp} alt="filter" />
              <img src={arrowDown} alt="filter" />
            </div>
          </div>
          <div className="w-10/12 bg-white h-[78%] rounded-xl flex justify-start items-center flex-col shadow-md">
            <Outlet context={[filterBool, id]}/>
          </div>
      </div>
    )
}

export default ClientDocument
