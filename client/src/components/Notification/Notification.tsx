import { useMutation } from 'react-query';
import download from '../../assets/download.svg';
import { updateNotificationData } from '../../hook/clientHook';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const handleDownload = async (link1: string, link2: string) => {
    try {
        const response1 = await fetch(`https://aitlin.onrender.com/${link1}`);
        const response2 = await fetch(`https://aitlin.onrender.com/${link2}`);
        const blob1 = await response1.blob();
        const blob2 = await response2.blob();

        // Create a URL for the blob
        const blobUrl1 = window.URL.createObjectURL(blob1);
        const blobUrl2 = window.URL.createObjectURL(blob2);

        // download 1

        // Create a temporary link element
        const tempLink1 = document.createElement('a');
        tempLink1.href = blobUrl1;
        tempLink1.setAttribute('download', link1); // Set the filename for download
        tempLink1.click();

        // Clean up by revoking the blob URL after the download is complete
        window.URL.revokeObjectURL(blobUrl1);

        // download 2
        
        // Create a temporary link element
        const tempLink2 = document.createElement('a');
        tempLink2.href = blobUrl2;
        tempLink2.setAttribute('download', link2); // Set the filename for download
        tempLink2.click();

        // Clean up by revoking the blob URL after the download is complete
        window.URL.revokeObjectURL(blobUrl2);
    } catch (error) {
        console.error('Error downloading file:', error);
    }
};

function NotificationData({type ,link1, link2, id} : {type: string, link1: string,link2: string, id:string}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const token = useSelector((state: any) => state.auth.token);

  const { mutate} = useMutation(updateNotificationData, {
    onSuccess: () => {
    },
    onError: () => {
        console.log("error")
    },
  });

  useEffect(()=>{
    const data = {id};
    mutate({data, token});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return (
    <div id="toast-success" className="flex items-center w-[90%] p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
        <div className="inline-flex items-center justify-center flex-shrink-0 w-[10%] h-8 text-primary-color bg-banner-color rounded-lg dark:primary-color dark:text-banner-color">
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
            </svg>
            <span className="sr-only">Check icon</span>
        </div>
        <div className="ms-3 text-xs md:text-sm font-normal w-[76%]">
            A new {type} document has been added
        </div>
        <button className="bg-primary-color p-2 rounded-md mr-2" onClick={()=>handleDownload(link1, link2)}>
            <img src={download} alt="download" />
        </button>
    </div>
  )
}

export default NotificationData
