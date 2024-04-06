import { Logout } from '../../../components'

function AddService() {
  return (
    <div className="w-dvw h-dvh bg-banner-color flex justify-start items-center flex-col ">
        <div className="w-10/12 h-[10%] flex justify-between items-center">
            <p className="font-roboto font-extrabold text-2xl md:text-3xl">Nuevo servicio</p>
            <div className="flex">
                <p className="mr-4 text-sm md:text-base bg-white rounded-xl shadow-md p-3 font-roboto">Haile Melaku</p>
                <Logout/>
            </div>
        </div>
        <div className="w-10/12 bg-white h-[50%] rounded-xl flex justify-start items-center flex-col shadow-md">
            .
        </div>
    </div>
  )
}

export default AddService
