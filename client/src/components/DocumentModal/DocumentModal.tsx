import close from '../../assets/close.svg';
import dir from '../../assets/dir.svg';

function DocumentModal({setIsOpen, title}) {
  return (
    <div className="flex justify-center items-center w-dvw h-dvh bg-slate-900 bg-opacity-40 absolute z-40">
        <div className="w-1/3 h-2/3 flex justify-start items-center flex-col bg-white rounded-3xl p-3 z-50">
            <div className="mt-5 w-[95%] h-[5%] flex justify-end items-center">
                <img src={close} alt="close" className='cursor-pointer' onClick={()=>setIsOpen(false)}/>
            </div>
            <div className="mt-2 w-[95%] h-[5%] flex justify-center items-center font-roboto font-semibold text-2xl">
                <p>Agregar factura</p>
            </div>
            <form className='mt-3 w-[95%] h-[70%] flex flex-col justify-center items-start'>
                <div className='w-full mb-5'>
                    <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white font-roboto">Periodo</label>
                    <input type="text" id="first_name" className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Ingresa intervalo de fechas" required />
                </div>
                <div className="w-full mb-6">
                    <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white font-roboto">Comentarios</label>
                    <input type="text" id="large-input" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='Ingresa las observaciones'/>
                </div>
                <button className='p-5 w-20 h-20 bg-primary-color rounded-xl'>
                    <img src={dir} alt="folder" />
                </button>
                <div className="mt-3 w-full flex justify-start items-center">
                    <button className="mr-2 flex items-center justify-center px-10 py-3 bg-primary-color text-white font-roboto rounded-2xl border-2 border-primary-color shadow-sm">Guardar</button>
                    <button className="flex items-center justify-center px-10 py-3 bg-white text-primary-color font-roboto rounded-2xl border-2 border-primary-color shadow-sm">Cancelar</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default DocumentModal
