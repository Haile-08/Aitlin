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
        <div className="w-10/12 bg-white h-[45%] rounded-xl flex justify-start items-center flex-col shadow-md">
            <div className="w-[95%] h-[15%] flex justify-start items-end">
                <p className='text-primary-color text-lg font-semibold mb-5'>Ingresa la información del servicio para continuar</p>
            </div>
            <form className="w-[97%] flex justify-start flex-wrap">
                <div className="m-3">
                    <label htmlFor="countries" className="block mb-2 text-sm font-light text-gray-900 dark:text-white">Tipo de cliente</label>
                    <select id="countries" className="bg-gray-50 border font-light border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 py-2.5 px-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value="new" className='bg-gray-50 border font-light border-gray-300 text-gray-900 text-sm rounded-lg '>Cliente nuevo</option>
                        <option value="old" className='bg-gray-50 border font-light border-gray-300 text-gray-900 text-sm rounded-lg'>Cliente existente</option>
                    </select>
                </div>
                <div className='m-3'>
                    <label htmlFor="first_name" className="block mb-2 text-sm font-light text-gray-900 dark:text-white">Nombre del cliente</label>
                    <input type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Nombre" required />
                </div>
                <div className='m-3'>
                    <label htmlFor="last_name" className="block mb-2 text-sm font-light text-gray-900 dark:text-white">Nombre del servicio</label>
                    <input type="text" id="last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Servicio" required />
                </div>
                <div className='m-3'>
                    <label htmlFor="last_name" className="block mb-2 text-sm font-light text-gray-900 dark:text-white">Email</label>
                    <input type="text" id="last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Email" required />
                </div>
            </form>
            <div className="w-[95%] mt-10 flex justify-start items-center">
                <input id="bordered-checkbox-1" type="checkbox" value="" name="bordered-checkbox" className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                <label htmlFor="bordered-checkbox-1" className="w-full py-4 ms-2 text-sm font-semibold font-roboto text-gray-900 dark:text-gray-300">Recibir notificación por correo</label>
            </div>
        </div>
        <div className="w-10/12 h-[10%] flex justify-end items-center ">
            <button className='w-28 bg-primary-color text-white px-28 py-3 rounded-lg flex justify-center items-center'>Agregar</button>
        </div>
    </div>
  )
}

export default AddService
