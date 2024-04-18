import { z } from 'zod';
import { useState } from 'react';
import close from '../../assets/close.svg';
import closeModal from '../../assets/closeModal.png';
import dir from '../../assets/dir.svg';
import pdfIcon from '../../assets/pdf.png';
import excelIcon from '../../assets/excel.png';
import powerpointIcon from '../../assets/powerpoint.png';
import wordIcon from '../../assets/word.png';
import xmlIcon from '../../assets/xml.png';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useMutation } from 'react-query';
import { addServiceData } from '../../hook/adminHook';

const addSchema = z.object({
    period: z
      .string()
      .min(3),
    comment: z
      .string()
      .min(3)
});
type SignUpSchemaType = z.infer<typeof addSchema>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DocumentModal({setIsOpen, documents, serviceId}: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [image, setImage] = useState<any>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const token = useSelector((state: any) => state.auth.token);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignUpSchemaType>({ resolver: zodResolver(addSchema) });

  const { mutate, isLoading } = useMutation(addServiceData, {
    onSuccess: (data) => {
      console.log(data);
      setIsOpen(false);
    },
    onError: () => {
      console.log("error")
    },
  });

  const onSubmit: SubmitHandler<SignUpSchemaType> = (res) => {
    const data = new FormData();
    data.append("file", image);
    if(documents === "Nurses"){
        data.append("Name", res.period);
    }else {
        data.append("period", res.period);
    }
    data.append("comment", res.comment);
    data.append("serviceId", serviceId);
    if(documents === "Nurses"){
        data.append("format", image?.type);
    }

    mutate({data, token, page: documents});
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleImage = (e: any) => {
    setImage(e.target.files[0]);
  };

  const handleClose = () =>{
    setImage("");
  }


  return (
    <div className="z-50 flex justify-center items-center w-dvw h-dvh bg-slate-900 bg-opacity-40 absolute z-40">
        <div className=" z-50 w-1/3 h-2/3 flex justify-start items-center flex-col bg-white rounded-3xl p-3 z-50">
            {isLoading &&<div className="w-1/3 h-2/3 bg-primary-color flex items-center justify-center absolute rounded-3xl top-[16.7%] left-[33.3%] bg-opacity-20">
                <svg aria-hidden="true" className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-primary-on-hover" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
            </div>}
            <div className="mt-5 w-[95%] h-[5%] flex justify-end items-center">
                <img src={close} alt="close" className='cursor-pointer' onClick={()=>setIsOpen(false)}/>
            </div>
            <div className="mt-2 w-[95%] h-[5%] flex justify-center items-center font-roboto font-semibold text-2xl">
                <p>Agregar factura</p>
            </div>
            <form className='mt-3 w-[95%] h-[70%] flex flex-col justify-center items-start' onSubmit={handleSubmit(onSubmit)} >
                <div className='w-full mb-5'>
                    <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white font-roboto">{documents == "Nurses"? "Nombre enfermera":"Periodo"}</label>
                    <input {...register("period")} type="text" id="first_name" className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={documents == "Nurses"? "Nombre": "Ingresa intervalo de fechas"} />
                </div>
                {errors.period && <span className='text-error'>{errors.period.message}</span>}
                <div className="w-full mb-6">
                    <label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white font-roboto">Comentarios</label>
                    <textarea {...register("comment")} id="large-input" className="block w-full h-30 p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={documents == "Nurses"? "Ingresa la descripción del documento cargado":'Ingresa las observaciones'}/>
                </div>
                {errors.comment && <span className='text-error'>{errors.comment.message}</span>}
                <div className="w-full flex justify-start items-center">
                    <label className="p-5 w-20 h-20 mt-5 bg-primary-color rounded-xl cursor-pointer" htmlFor="fileInput">
                        <input 
                            id="fileInput"
                            type="file"
                            accept='.xlsx, .xls, .pdf, .doc, .docx, .ppt, .pptx, .xml'
                            onChange={handleImage} 
                            className="hidden"
                        />
                        <img src={dir} alt="folder" />   
                    </label>
                    {image?.type === "application/pdf" && <div className=" w-20 h-20 mt-5 ml-5 bg-[#BFBFC2] bg-opacity-20 border-2 border-zinc-400 rounded-xl">
                        <div className="w-[90%] h-4 mt-1 flex justify-end items-center">
                            <div className="p-1 rounded-full bg-zinc-500 cursor-pointer" onClick={handleClose}>
                                <img src={closeModal} alt="close" className='w-3 '/>
                            </div>
                        </div>
                        <div className="w-full h-[50%] flex justify-center items-center" >
                            <img src={pdfIcon} alt="pdf" className='w-9'/>
                        </div>
                    </div>}
        
                    {image?.type == "application/xml" || image?.type == "text/xml" &&  <div className=" w-20 h-20 mt-5 ml-5 bg-[#BFBFC2] bg-opacity-20 border-2 border-zinc-400 rounded-xl">
                        <div className="w-[90%] h-4 mt-1 flex justify-end items-center">
                            <div className="p-1 rounded-full bg-zinc-500 cursor-pointer" onClick={handleClose}>
                                <img src={closeModal} alt="close" className='w-3 '/>
                            </div>
                        </div>
                        <div className="w-full h-[50%] flex justify-center items-center" >
                            <img src={xmlIcon} alt="pdf" className='w-9'/>
                        </div>
                    </div>}
                    {image?.type == "application/msword" || image?.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && <div className=" w-20 h-20 mt-5 ml-5 bg-[#BFBFC2] bg-opacity-20 border-2 border-zinc-400 rounded-xl">
                        <div className="w-[90%] h-4 mt-1 flex justify-end items-center">
                            <div className="p-1 rounded-full bg-zinc-500 cursor-pointer" onClick={handleClose}>
                                <img src={closeModal} alt="close" className='w-3 '/>
                            </div>
                        </div>
                        <div className="w-full h-[50%] flex justify-center items-center">
                            <img src={wordIcon} alt="pdf" className='w-9'/>
                        </div>
                    </div>}
                    {image?.type == "application/vnd.ms-excel" || image?.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && <div className=" w-20 h-20 mt-5 ml-5 bg-[#BFBFC2] bg-opacity-20 border-2 border-zinc-400 rounded-xl">
                        <div className="w-[90%] h-4 mt-1 flex justify-end items-center">
                            <div className="p-1 rounded-full bg-zinc-500 cursor-pointer" onClick={handleClose}>
                                <img src={closeModal} alt="close" className='w-3 '/>
                            </div>
                        </div>
                        <div className="w-full h-[50%] flex justify-center items-center" >
                            <img src={excelIcon} alt="pdf" className='w-9'/>
                        </div>
                    </div>}
                    {image?.type == "application/vnd.ms-powerpoint" && <div className=" w-20 h-20 mt-5 ml-5 bg-[#BFBFC2] bg-opacity-20 border-2 border-zinc-400 rounded-xl">
                        <div className="w-[90%] h-4 mt-1 flex justify-end items-center">
                            <div className="p-1 rounded-full bg-zinc-500 cursor-pointer" onClick={handleClose}>
                                <img src={closeModal} alt="close" className='w-3 '/>
                            </div>
                        </div>
                        <div className="w-full h-[50%] flex justify-center items-center" >
                            <img src={powerpointIcon} alt="pdf" className='w-9'/>
                        </div>
                    </div>}
                    
                </div>
                <div className="mt-3 w-full flex justify-start items-center">
                    <button type='submit' className="mr-2 flex items-center justify-center px-10 py-3 bg-primary-color text-white font-roboto rounded-2xl border-2 border-primary-color shadow-sm">Guardar</button>
                    <button className="flex items-center justify-center px-10 py-3 bg-white text-primary-color font-roboto rounded-2xl border-2 border-primary-color shadow-sm" onClick={()=>setIsOpen(false)}>Cancelar</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default DocumentModal
