import { useSelector } from "react-redux";
import { Logout } from "../../../components";
import { Outlet } from "react-router-dom";
import { useState } from "react";

function MassUpload() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useSelector((state: any) => state.auth.user);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [documentsInfoList, setDocumentsInfoList] = useState([]);

  return (
    <div className="w-dvw h-dvh bg-banner-color flex justify-start items-center flex-col">
        <div className="w-10/12 h-[10%] flex justify-between items-center">
            <p className="font-roboto font-extrabold text-xl md:text-3xl">Carga masiva</p>
            <div className="flex">
                <p className="mr-4 text-sm md:text-base bg-white rounded-xl shadow-md p-3 font-roboto">{user?.Name}</p>
                <Logout/>
            </div>
        </div>
        <div className="w-[95%] md:w-[90%] bg-white h-[85%] rounded-xl flex justify-start items-center flex-col shadow-md">
            <Outlet context={[uploadedFiles, setUploadedFiles, documentsInfoList, setDocumentsInfoList]}/>
        </div>
    </div>
  )
}

export default MassUpload
