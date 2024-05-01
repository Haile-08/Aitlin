/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import upload from '../../../../assets/upload.png';
import xmlIcon from '../../../../assets/xml.png';
import { useNavigate, useOutletContext } from 'react-router-dom';
import * as XLSX from 'xlsx';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OutletContextType = [any, any, any, any];

function ServiceData() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [uploadedFiles, setUploadedFiles, documentsInfoList, setDocumentsInfoList] = useOutletContext() as OutletContextType;
  const [doc, setDoc] = useState([]);
  const navigate = useNavigate();
  const { getRootProps, getInputProps } = useDropzone({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onDrop: (acceptedFiles: any) => {
      setDoc(acceptedFiles);
      // Call your backend API endpoint to upload files
    },
    accept: {
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
        "application/vnd.ms-excel" : [".xlsx"],
      },
  });

  const handleNavNext = (e: any) => {
    e.preventDefault();
    navigate('/Admin/Dashboard/Mass/loading');
  }

  const handleNavBack = (e: any) => {
    e.preventDefault();
    navigate('/Admin/Dashboard/Mass/upload');
  }

  useEffect(() => {
    const handleFile = () => {
      const file = doc[0];
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const data = new Uint8Array(event?.target.result);
  
        // Check if the file is empty or null
        if (data.length === 0 || !data) {
          console.error("File is empty or null");
          return;
        }
  
        try {
          const workbook = XLSX.read(data, { type: 'array' });
  
          // Check if workbook is empty
          if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
            console.error("Workbook is empty");
            return;
          }
  
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
          const newDocumentsInfoList = rows.reduce((acc: any, row: any, rowIndex: any) => {
            if (rowIndex !== 0) {
              const obj: any = {};
              row.forEach((cell: any, cellIndex: any) => {
                if (cellIndex === 0) {
                  obj["ClientId"] = cell;
                } else if (cellIndex === 1) {
                  obj["Type"] = cell;
                } else if (cellIndex === 2) {
                  const fileIndex = uploadedFiles.findIndex((fileObject: any) => fileObject.name === cell);
                  obj["file"] = uploadedFiles[fileIndex];
                } else if (cellIndex === 3) {
                  obj["Comment"] = cell;
                }
              });
              acc.push(obj);
            }
            return acc;
          }, []);
  
          setDocumentsInfoList(newDocumentsInfoList);
        } catch (error) {
          console.error("Error parsing Excel file:", error);
        }
      };
  
      if (file) {
        reader.readAsArrayBuffer(file);
      } else {
        console.error("No file selected");
      }
    };
  
    if (doc.length !== 0) {
      handleFile();
    }
  }, [doc]);
  

  console.log(documentsInfoList);

  return (
    <div className="w-full h-full flex justify-center items-center flex-col">
      <p className='text-2xl font-roboto font-light mb-10'>Service info List Document</p>
      <div {...getRootProps()} className='w-[55%] h-3/4 outline-dashed flex justify-center items-center flex-col cursor-pointer outline-primary-color rounded-md outline-3'>
        <input {...getInputProps()} id="fileInput" accept='.xlsx, .xls, .pdf, .doc, .docx, .ppt, .pptx, .xml' />
        <img src={upload} alt="upload" />
        <p className='font-roboto font-light mt-5 opacity-35'>Drag and drop files here or click to browse.</p>
        <p className='font-roboto font-light mt-5'>*File supported .msexcel </p>
      </div>
      <div className='w-[40%] h-10 flex justify-center items-center my-5'>
        {doc.length !== 0 && <img src={xmlIcon} alt="xml" className='h-10'/>}
        <p className='text-2xl font-roboto font-light h-10 ml-5 flex justify-center items-center'>{doc[0]?.name}</p>
      </div>
      <div className="w-[90%] h-[20%] flex justify-end items-center">
        <button onClick={handleNavBack} className="flex bg-primary-color font-roboto text-white justify-center items-center px-8 py-3 md:px-8 md:py-3 text-xs md:text-lg m-2 rounded-2xl">
            <p className="hidden md:flex">Back</p>
        </button>
        <button onClick={handleNavNext} className="flex bg-primary-color font-roboto text-white justify-center items-center px-8 py-3 md:px-8 md:py-3 text-xs md:text-lg m-2 rounded-2xl">
            <p className="hidden md:flex">Next</p>
        </button>
      </div>
    </div>
  )
}

export default ServiceData
