import { useState } from 'react';
import edit from '../../assets/edit.svg'
import EditDocumentModal from '../editDocumentModal/editDocumentModal';
import trash from '../../assets/trash.png';
import downloadIcon from '../../assets/download.svg';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BinnacleList({Name, refetch, deleteItem, period, comment, id, link}: any) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    deleteItem(id);
  }

  const handleDownload = async () => {
    try {
        const response = await fetch(`https://clientes.atend.mx/${link}`);
        const blob = await response.blob();

        // Create a URL for the blob
        const blobUrl = window.URL.createObjectURL(blob);

        // Create a temporary link element
        const tempLink = document.createElement('a');
        tempLink.href = blobUrl;
        tempLink.setAttribute('download', link); // Set the filename for download
        tempLink.click();

        // Clean up by revoking the blob URL after the download is complete
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('Error downloading file:', error);
    }
  };

  return (
    <div className="w-[100%] h-[5%] md:h-[7%] mt-3 py-6 border-b-[1.5px] border-black border-opacity-40 flex justify-start items-center">
        
        {isOpen && <EditDocumentModal setIsOpen={setIsOpen} refetch={refetch} documents={"binnacle"} serviceId={id}/>}
        <div className="ml-2 md:ml-6 w-[25%] h-[90%] flex justify-start items-center font-roboto font-light">
          <p className="opacity-50 font-roboto font-light">{Name.length <= 35 ? Name: Name.slice(0, 35) + '...'}</p>
        </div>
        <div className="w-[50%] md:w-[30%] h-[90%] flex justify-start items-center font-roboto font-light">
          <p className="opacity-50 font-roboto font-light ">{period.length <= 75 ? period: period.slice(0, 75) + '...'}</p>
        </div>
        <div className="w-[50%] h-[90%] hidden md:flex justify-start items-center font-roboto font-light">
          <p className="opacity-50 font-roboto font-light ">{comment.length <= 115? comment: comment.slice(0, 115) + '...'}</p>
        </div>
        <div className="w-[15%] h-[90%] flex justify-start items-center font-roboto font-light">
          <button onClick={handleDownload} className="text-white bg-primary-color px-3 py-3 rounded-xl mr-3">
            <img src={downloadIcon} alt="download" />
          </button>
          <button className="text-white bg-primary-color px-3 py-3 rounded-xl mr-3"  onClick={handleDelete}>
            <img src={trash} alt="delete" className='h-5'/>
          </button>
          <button className="text-white bg-primary-color px-3 py-3 rounded-xl"  onClick={()=> setIsOpen(!isOpen)}>
            <img src={edit} alt="edit" />
          </button>   
        </div>
      </div>
  )
}

export default BinnacleList
