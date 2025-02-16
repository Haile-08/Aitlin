/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import upload from '../../../../assets/upload.png';
import xmlIcon from '../../../../assets/xml.png';
import { useNavigate, useOutletContext } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { useSelector } from 'react-redux';
import { useMutation } from 'react-query';
import { addServiceData } from '../../../../hook/adminHook';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OutletContextType = [any, any, any, any];

function ServiceData() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [uploadedFiles, _setUploadedFiles] = useOutletContext() as OutletContextType;
  const [doc, setDoc] : any = useState([]);
  const [documentsInfoList, setDocumentsInfoList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [readerError, setReaderError] = useState("");

  const navigate = useNavigate();
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const token = useSelector((state: any) => state.auth.token);

   const { mutateAsync } = useMutation(addServiceData, {
    onError: (error: any) => {
      console.error("Upload error:", error);
      setReaderError("Failed to upload data. Please try again.");
    },
    retry: 3,
  });

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

  const handleNavBack = (e: any) => {
    e.preventDefault();
    navigate('/Admin/Dashboard/Mass/upload');
  }

  useEffect(() => {
    const handleFile = () => {
      const file = doc[0];
      const reader = new FileReader();
      console.log('Service data started analyzing');
      
      reader.onload = (event: any) => {
        const data = new Uint8Array(event?.target.result);

        if (data.length === 0 || !data) {
          console.log("File is empty or null")
          setReaderError("File is empty or null")
          return;
        }
  
        try {
          const workbook = XLSX.read(data, { type: 'array' });
  
          // Check if workbook is empty
          if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
            console.error("Workbook is empty");
            throw new Error("Workbook is empty");
          }
  
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
          const newDocumentsInfoList: any = rows.reduce((acc: any, row: any, rowIndex: any) => {
            if (rowIndex !== 0) {
              const obj: any = {};
              row.forEach((cell: any, cellIndex: any) => {
                if(cellIndex === 0){
                  obj["serviceId"] = cell;
                }else if (cellIndex === 1) {
                  obj["type"] = cell;
                } else if (cellIndex === 2) {
                  const fileIndex = uploadedFiles.findIndex((fileObject: any) => fileObject.name == cell);
                  
                  if (fileIndex !== -1) {
                    obj["file1"] = uploadedFiles[fileIndex];
                  } else {
                    console.error(`File not found: ${cell}`);
                    throw new Error(`File not found: ${cell}`);
                  }
                } else if (cellIndex === 3) {
                  const fileIndex = uploadedFiles.findIndex((fileObject: any) => fileObject.name == cell);

                  if (fileIndex !== -1) {
                    obj["file2"] = uploadedFiles[fileIndex];
                  } else {
                    console.error(`File not found: ${cell}`);
                    throw new Error(`File not found: ${cell}`);
                  }
                }else if (cellIndex === 4) {
                  obj["comment"] = cell;
                } else if (cellIndex === 5) {
                  obj["period"] = cell;
                }
              });
              acc.push(obj);
            }
            return acc;
          }, []);
  
          setDocumentsInfoList(newDocumentsInfoList);
        } catch (error: any) {
          console.error("Error parsing Excel file:", error.message);
          setReaderError(error.message);
        }
      };
  
      if (file) {
        reader.readAsArrayBuffer(file);
      } else {
        console.error("No file selected");
        setReaderError("No file selected")
      }
    };
  
    if (doc.length !== 0) {
      handleFile();
    }
  }, [doc]);

  useEffect(()=>{
    setLoading(false);
  },[])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = async () => {
    try {
      setLoading(true)
      const promises = documentsInfoList.map(async (res: any) => {
        const data = new FormData();

        if (res.type === "Nurse Document") {
          data.append("Name", res?.period);
          data.append("format", res.file1?.type);
        } else {
          if(res.type === "Invoice") {
            if (res?.file1.type === "application/pdf") {
              data.append("Name", res?.file1.name.split(".")[0]);
            } else {
              data.append("Name", res?.file2.name.split(".")[0]);
            }
          } else {
            data.append("Name", res?.file1?.name?.split(".")[0]);
          }
          data.append("period", res?.period);
        }
        if (res?.comment !== "" && res?.comment) {
          data.append("comment", res?.comment);
        } else {
          data.append("comment", " ");
        }

        if(res?.type === "Invoice"){
          data.append("file", res?.file1);
          data.append("file", res?.file2);
        }else {
          data.append("file", res?.file1);
        }

        data.append("serviceId", res?.serviceId);
    
        let pageMap: any = {
          "invoice": "bill",
          "binnacle": "binnacle",
          "nurse document": "Nurses",
        };
        
        let page = pageMap[res?.type?.toString().trim().toLowerCase()] || "";
    
        if(page !== ""){
          // Await the mutate() call
          return await mutateAsync({ data, token, page });
        }
      });
    
      // Wait for all promises to resolve
      await Promise.all(promises).then(()=>{
        // Once all mutations are done, navigate to the desired location
        navigate('/Admin/Dashboard');
      });
    } catch (error: any) {
      if (!(error instanceof Error)) {
        error = new Error(error);
      }
      console.error("Error during handleSubmit:", error);
      setLoading(false);
      setReaderError(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full h-full flex justify-center items-center flex-col">
      {loading && <div className="w-full h-full bg-primary-color flex items-center justify-center absolute top-0 left-0  bg-opacity-20">
            <svg aria-hidden="true" className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-primary-on-hover" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span className="sr-only">Loading...</span>
        </div>}
      <p className='text-2xl font-roboto font-light mb-10'>Service info List Document</p>
      <div {...getRootProps()} className='w-full md:w-[55%] h-3/4 outline-dashed flex justify-center items-center flex-col cursor-pointer outline-primary-color rounded-md outline-3'>
        <input {...getInputProps()} id="fileInput" accept='.xlsx, .xls, .pdf, .doc, .docx, .ppt, .pptx, .xml' />
        <img src={upload} alt="upload" />
        <p className='font-roboto font-light mt-5 opacity-35'>Drag and drop files here or click to browse.</p>
        <p className='font-roboto font-light mt-5'>*File supported .msexcel </p>
      </div>
      <div className='w-[40%] h-10 flex justify-center items-center my-5'>
        {doc.length !== 0 && <img src={xmlIcon} alt="xml" className='h-10'/>}
        <p className='text-2xl font-roboto font-light h-10 ml-5 flex justify-center items-center'>{doc[0]?.name}</p>
      </div>
      <div className='w-[40%] h-10 flex justify-center items-center my-5'>
        {readerError && <p className="text-red-500 text-sm mt-2">{readerError}</p>}
      </div>
      <div className="w-[90%] h-[20%] flex justify-end items-center">
        <button onClick={handleNavBack} className="flex bg-primary-color font-roboto text-white justify-center items-center px-8 py-3 md:px-8 md:py-3 text-xs md:text-lg m-2 rounded-2xl">
            <p className="flex">Back</p>
        </button>
        <button onClick={()=>{
          handleSubmit();
          }} className="flex bg-primary-color disabled:bg-slate-600 font-roboto text-white justify-center items-center px-8 py-3 md:px-8 md:py-3 text-xs md:text-lg m-2 rounded-2xl">
            <p className="flex">upload</p>
        </button>
      </div>
    </div>
  )
}

export default ServiceData
