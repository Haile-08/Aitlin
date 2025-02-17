import { Back, DocumentModal, Logout } from "../../../components"
import arrowDown from '../../../assets/arrowDown.svg';
import arrowUp from '../../../assets/arrowUp.svg';
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { retrieveASingleService } from "../../../hook/adminHook";
import { useQuery } from "react-query";

function Documents() {
  const [documents, setDocuments] = useState("bill");
  const [filterBool, setFilterBool] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useSelector((state: any) => state.auth.user);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const token = useSelector((state: any) => state.auth.token);
  const [isOpen, setIsOpen] = useState(false);
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

  const billArchive = data?.data[0].billArchive;
  const blogArchive = data?.data[0].blogArchive;
  const nurseArchive = data?.data[0].nurseArchive;

  const handleBillNav = (e: { preventDefault: () => void; })=>{
    e.preventDefault();
    setDocuments("bill");
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("id", id);
    urlParams.set("service", Service);
    urlParams.set("name", Name);
    const searchQuery = urlParams.toString();
    navigate(`/Admin/Dashboard/Documents/bill/?${searchQuery}`);
    setIsOpen(false);
  }

  const handleBinnacleNav = (e: { preventDefault: () => void; }) =>{
    e.preventDefault();
    setDocuments("binnacle");
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("id", id);
    urlParams.set("service", Service);
    urlParams.set("name", Name);
    const searchQuery = urlParams.toString();
    navigate(`/Admin/Dashboard/Documents/Binnacle/?${searchQuery}`);
    setIsOpen(false);
  }

  const handleNursesNav = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setDocuments('Nurses');
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("id", id);
    urlParams.set("service", Service);
    urlParams.set("name", Name);
    const searchQuery = urlParams.toString();
    navigate(`/Admin/Dashboard/Documents/Nurses/?${searchQuery}`);
    setIsOpen(false)
  }

  return (
    <div className="w-dvw h-dvh bg-banner-color flex justify-start items-center flex-col">
        {isOpen && <DocumentModal setIsOpen={setIsOpen} documents={documents} serviceId={id}/>}
        <div className="mb-10 mt-2 w-[90%] md:w-10/12 h-[7%] flex justify-between items-center">
            <div className="flex justify-center items-center">
                <Back nav={'/Admin/Dashboard'}/>
                <p className="font-roboto font-extrabold text-xl md:text-2xl">Ver documentos</p>
            </div>
            <div className="flex ">
                <p className="mr-4 text-sm md:text-base bg-white rounded-xl shadow-md px-2  py-0 flex justify-center items-center font-light font-roboto">{user.Name}</p>
                <Logout/>
            </div>
        </div>
        <div className="w-[95%] md:w-10/12 h-[3%] flex justify-between items-center">
          <div className="flex justify-center items-start flex-col ml-3 md:ml-5">
            <h3 className="font-extrabold font-roboto text-base md:text-xl">{Name}</h3>
            <p className="text-sm md:text-base mt-1 font-normal">{Service}</p>
          </div>
        </div>
        <div className="my-3 w-[100%] md:w-10/12 mt-8 md:mt-0 h-[5%] flex justify-center items-center">
          <div className="w-[70%] flex items-center justify-end">
            <button className={`mx-1 md:mx-5 flex items-center justify-center px-2 md:px-10 py-2 ${documents == 'bill'? 'bg-primary-color' : 'bg-banner-color'} ${documents == 'bill'? 'text-white' : 'text-primary-color'} font-roboto rounded-2xl border-2 border-primary-color shadow-sm`} onClick={handleBillNav}>Factura</button>
            <button className={`mx-1 md:mx-5 flex items-center justify-center px-2 md:px-10 py-2 ${documents == 'binnacle'? 'bg-primary-color' : 'bg-banner-color'} ${documents == 'binnacle'? 'text-white' : 'text-primary-color'} font-roboto rounded-2xl border-2 border-primary-color shadow-sm`} onClick={handleBinnacleNav}>Bitácora</button>
            <button className={`mx-1 md:mx-5 flex items-center justify-center px-2 md:px-10 py-2 ${documents == 'Nurses'? 'bg-primary-color' : 'bg-banner-color'} ${documents == 'Nurses'? 'text-white' : 'text-primary-color'} font-roboto rounded-2xl border-2 border-primary-color shadow-sm`} onClick={handleNursesNav}>Enfermeras</button>
            </div>
          <div className="flex justify-end items-center ml-2 md:ml-0 w-[20%] md:w-[30%] cursor-pointer" onClick={()=> setFilterBool(!filterBool)}>
            <p className="mx-2 md:mx-3 font-semibold text-primary-color ">{filterBool? "Más reciente" : "Menos reciente"}</p>
            <img src={arrowUp} alt="filter" className="hidden md:flex" />
            <img src={arrowDown} alt="filter" className="hidden md:flex"/>
          </div>
        </div>
        <div className="w-[95%] md:w-10/12 bg-white h-[73%] md:h-[75%] rounded-xl flex justify-start items-center flex-col shadow-md">
          <Outlet context={[setIsOpen, isOpen, filterBool, id, billArchive, blogArchive, nurseArchive]}/>
        </div>
    </div>
  )
}

export default Documents
