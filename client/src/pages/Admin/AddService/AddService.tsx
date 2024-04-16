import { z } from 'zod';
import { Logout } from '../../../components'
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { addClient } from '../../../hook/adminHook';
import { useSelector } from 'react-redux';

const SignUpSchema = z.object({
    Name: z.string().min(1),
    Service: z.string().min(1),
    status: z.string(),
    email: z.string().email(),
});
type SignUpSchemaType = z.infer<typeof SignUpSchema>;

function AddService() {
  const [notification, setNotification] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const token = useSelector((state: any) => state.auth.token);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignUpSchemaType>({ resolver: zodResolver(SignUpSchema) });
   
  const { mutate, isLoading } = useMutation(addClient, {
    onSuccess: (data) => {
        if (!data.success){
          setIsError(true);
          setErrorMessage(data.message);
        }
    },
    onError: () => {
      console.log('error');
    },
  });

  const onSubmit: SubmitHandler<SignUpSchemaType> = (data) => {
    const result = {
        Name: data.Name,
        status: data.status,
        ServiceData: data.Service,
        email: data.email,
        Notification: notification || false
    };
    
    setErrorMessage('');
    setIsError(false);
    mutate({data: result, token });
  }

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
            {isLoading && <div className="w-10/12 h-[45%] bg-primary-color flex items-center justify-center absolute rounded-xl top-[10%] left-[8.35%] bg-opacity-20">
                <svg aria-hidden="true" className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-primary-on-hover" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
            </div>}
            <div className="w-[95%] h-[15%] flex justify-start items-end">
                <p className='text-primary-color text-lg font-semibold mb-5'>Ingresa la información del servicio para continuar</p>
            </div>
            <form className="w-[97%] flex justify-start flex-wrap">
                <div className="m-3">
                    <label htmlFor="countries" className="block mb-2 text-sm font-light text-gray-900 dark:text-white">Tipo de cliente</label>
                    <select id="countries"  {...register("status")} className="bg-gray-50 border font-light border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 py-2.5 px-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        <option value="new" className='bg-gray-50 border font-light border-gray-300 text-gray-900 text-sm rounded-lg '>Cliente nuevo</option>
                        <option value="old"  className='bg-gray-50 border font-light border-gray-300 text-gray-900 text-sm rounded-lg'>Cliente existente</option>
                    </select>
                    {errors.status && <span className='text-error'>{errors.status?.message}</span>}
                </div>
                <div className='m-3'>
                    <label htmlFor="first_name" className="block mb-2 text-sm font-light text-gray-900 dark:text-white">Nombre del cliente</label>
                    <input type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Nombre" required {...register("Name")}/>
                    {errors.Name && <span className='text-error'>{errors.Name?.message}</span>}
                </div>
                <div className='m-3'>
                    <label htmlFor="last_name" className="block mb-2 text-sm font-light text-gray-900 dark:text-white">Nombre del servicio</label>
                    <input type="text" id="last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Servicio" required {...register("Service")}/>
                    {errors.Service && <span className='text-error'>{errors.Service?.message}</span>}
                </div>
                <div className='m-3'>
                    <label htmlFor="last_name" className="block mb-2 text-sm font-light text-gray-900 dark:text-white">Email</label>
                    <input type="text" id="last_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-96 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Email" required {...register("email")}/>
                    {errors.email && <span className='text-error'>{errors.email?.message}</span>}
                </div>
            </form>
            <div className="w-[95%] mt-10 flex justify-start items-center">
                <input id="bordered-checkbox-1" onChange={(e) => setNotification(e.target.checked)} type="checkbox" value="" name="bordered-checkbox" className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                <label htmlFor="bordered-checkbox-1" className="w-full py-4 ms-2 text-sm font-semibold font-roboto text-gray-900 dark:text-gray-300">Recibir notificación por correo</label>
            </div>
            <div className="w-[95%] mt-10 flex justify-start items-center">
                {isError && <span className='text-error'>{errorMessage}</span>}
            </div>
        </div>
        <div className="w-10/12 h-[10%] flex justify-end items-center ">
            <button className='w-28 bg-primary-color text-white px-28 py-3 rounded-lg flex justify-center items-center' onClick={handleSubmit(onSubmit)}>Agregar</button>
        </div>
    </div>
  )
}

export default AddService
