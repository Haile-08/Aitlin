import pdfIcon from '../../assets/pdf.png';
import excelIcon from '../../assets/excel.png';
import powerpointIcon from '../../assets/powerpoint.png';
import wordIcon from '../../assets/word.png';
import xmlIcon from '../../assets/xml.png';
import deleteIcon from '../../assets/delete.png';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DocumentsList({format, name,  setUploadedFiles}:{format: string, name: string, setUploadedFiles: any}) {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDelete = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setUploadedFiles((item: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return item.filter((doc: any)=> doc.name !== name)
        });
    }

    return (
    <div className='w-full h-7 flex justify-start items-center my-5'>
      {format == "application/xml" || format == "text/xml" &&  <img src={xmlIcon} alt="xml" className='h-7'/>}
      {format == "application/pdf" &&  <img src={pdfIcon} alt="pdf" className='h-7'/>}
      {format == "application/msword" || format == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&  <img src={wordIcon} alt="word" className='h-7'/>}
      {format == "application/vnd.ms-excel" || format == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&  <img src={excelIcon} alt="excel" className='h-7'/>}
      {format == "application/vnd.ms-powerpoint" &&  <img src={powerpointIcon} alt="powerpoint" className='h-7'/>}
      <p className='w-[80%] ml-5'>{name.length > 62? name.substring(0, 62) + '...': name}</p>
      <button onClick={handleDelete}>
        <img src={deleteIcon} alt="delete" className='h-7 ml'/>
      </button>
    </div>
  )
}

export default DocumentsList
