/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDropzone } from 'react-dropzone';
import upload from '../../../../assets/upload.png';
import { DocumentsList } from '../../../../components';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useMemo } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OutletContextType = [any, any];

function UploadDocument() {
  const MAX_FILES = 200; // Set a limit to prevent memory overload
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [uploadedFiles, setUploadedFiles] = useOutletContext() as OutletContextType;
  const navigate = useNavigate();
  const { getRootProps, getInputProps } = useDropzone({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

onDrop: (acceptedFiles: any) => {
  setUploadedFiles((prevFiles: any) => {
    if (prevFiles.length + acceptedFiles.length > MAX_FILES) {
      alert(`You can upload a maximum of ${MAX_FILES} files.`);
      return prevFiles;
    }
    return [...prevFiles, ...acceptedFiles];
  });
},
    accept: {
        "text/xml": [".xml"],
        "application/xml": [".xml"],
        "application/pdf": [".pdf"],
        "application/msword": [".docx"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
        "application/vnd.ms-excel" : [".xlsx"],
        "application/vnd.ms-powerpoint": [".pptx"],
      },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNav = (e: any) => {
    e.preventDefault();
    navigate('/Admin/Dashboard/Mass/document');
  }

  const fileList = useMemo(() => (
    uploadedFiles.map((file: any) => (
      <DocumentsList key={file.name} format={file?.type} name={file?.name} setUploadedFiles={setUploadedFiles} />
    ))
  ), [uploadedFiles]);
  


  return (
    <div className="w-full h-full flex justify-center items-center flex-col">
    <div className='w-full h-[80%] flex flex-col justify-center items-center md:flex-row '>
      <div {...getRootProps()} className='w-full md:w-[55%] h-3/4 outline-dashed flex justify-center items-center flex-col cursor-pointer outline-primary-color rounded-md outline-3'>
        <input {...getInputProps()} id="fileInput" accept='.xlsx, .xls, .pdf, .doc, .docx, .ppt, .pptx, .xml' />
        <img src={upload} alt="upload" />
        <p className='font-roboto font-light mt-5 opacity-35'>Drag and drop files here or click to browse.</p>
        <p className='font-roboto font-light mt-5 text-sm md:text-xl'>*File supported .pdf .msword .msexcel .mspowerpoint & .xml </p>
      </div>
      <div className='w-full md:w-[40%] h-3/4 ml-5 flex justify-start items-start flex-col'>
        <p className='text-2xl font-roboto font-light mb-10'>Uploaded Files</p>
        <div className="w-full h-[85%] overflow-y-auto scrollbar-track-white scrollbar-thin scrollbar-thumb-primary-color">
            {fileList}
        </div>
      </div>
    </div>
    <div className="w-[90%] h-[20%] flex justify-end items-center">
        <button onClick={handleNav} className="flex bg-primary-color font-roboto text-white justify-center items-center px-8 py-5 md:px-8 md:py-3 text-xs md:text-lg m-2 rounded-2xl">
            <p className="md:flex">Next</p>
        </button>
    </div>
    </div>
  )
}

export default UploadDocument
