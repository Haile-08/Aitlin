/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDropzone } from 'react-dropzone';
import upload from '../../../../assets/upload.png';
import { DocumentsList } from '../../../../components';
import { useNavigate, useOutletContext } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OutletContextType = [any, any, any, any];

function UploadDocument() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [uploadedFiles, setUploadedFiles, documentsInfoList, setDocumentsInfoList] = useOutletContext() as OutletContextType;
  const navigate = useNavigate();
  const { getRootProps, getInputProps } = useDropzone({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onDrop: (acceptedFiles: any) => {
      setUploadedFiles(acceptedFiles);
      // Call your backend API endpoint to upload files
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

  console.log(uploadedFiles);

  return (
    <div className="w-full h-full flex justify-center items-center flex-col">
    <div className='w-full h-[80%] flex justify-center items-center'>
      <div {...getRootProps()} className='w-[55%] h-3/4 outline-dashed flex justify-center items-center flex-col cursor-pointer outline-primary-color rounded-md outline-3'>
        <input {...getInputProps()} id="fileInput" accept='.xlsx, .xls, .pdf, .doc, .docx, .ppt, .pptx, .xml' />
        <img src={upload} alt="upload" />
        <p className='font-roboto font-light mt-5 opacity-35'>Drag and drop files here or click to browse.</p>
        <p className='font-roboto font-light mt-5'>*File supported .pdf .msword .msexcel .mspowerpoint & .xml </p>
      </div>
      <div className='w-[40%] h-3/4 ml-5 flex justify-start items-start flex-col'>
        <p className='text-2xl font-roboto font-light mb-10'>Uploaded Files</p>
        <div className="w-full h-[85%] overflow-y-auto scrollbar-track-white scrollbar-thin scrollbar-thumb-primary-color">
            {uploadedFiles.map((file: any) => (
                <DocumentsList format={file?.type} name={file?.name}  setUploadedFiles={setUploadedFiles} />
            ))}
        </div>
      </div>
    </div>
    <div className="w-[90%] h-[20%] flex justify-end items-center">
        <button onClick={handleNav} className="flex bg-primary-color font-roboto text-white justify-center items-center px-8 py-3 md:px-8 md:py-3 text-xs md:text-lg m-2 rounded-2xl">
            <p className="hidden md:flex">Next</p>
        </button>
    </div>
    </div>
  )
}

export default UploadDocument
