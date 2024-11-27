import downloadIcon from '../../assets/download.svg';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ClientBillList({Name, period, comment, link1, link2}: any) {
 
    const handleDownload = async () => {
      try {
          const response1 = await fetch(`https://clientes.atend.mx/${link1}`);
          const response2 = await fetch(`https://clientes.atend.mx/${link2}`);
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

    return (
    <div className="w-[100%] h-[5%] md:h-[7%] mt-3 py-6 border-b-[1.5px] border-black border-opacity-40 flex justify-start items-center">
        <div className="ml-2 md:ml-6 w-[25%] h-[90%] flex justify-start items-center font-roboto font-light">
          <p className="opacity-50 font-roboto font-light ">{Name.length <= 35 ? Name: Name.slice(0, 35) + '...'}</p>
        </div>
        <div className="w-[50%] md:w-[30%] h-[90%] flex justify-start items-center font-roboto font-light">
          <p className="opacity-50 font-roboto font-light ">{period.length <= 75 ? period: period.slice(0, 75) + '...'}</p>
        </div>
        <div className="w-[50%] h-[90%] hidden md:flex justify-start items-center font-roboto font-light">
          <p className="opacity-50 font-roboto font-light ">{comment.length <= 115? comment: comment.slice(0, 115) + '...'}</p>
        </div>
        <div className="w-[15%] h-[90%] flex justify-start items-center font-roboto font-light">
          <button onClick={handleDownload} className='bg-primary-color px-4 py-3 rounded-xl'>
              <img src={downloadIcon} alt="download" />
          </button>
        </div>
      </div>
    );
}

export default ClientBillList
