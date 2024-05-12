import { useState } from 'react'
import edit from '../../assets/edit.svg'
import EditDocumentModal from '../editDocumentModal/editDocumentModal';
import trash from '../../assets/trash.png';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function NurseList({ Name, refetch, deleteItem, Archive, comment, id}: any) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    deleteItem(id);
   }

    return (
    <div className="w-[100%] h-[5%] md:h-[7%] mt-3 py-6 border-b-[1.5px] border-black border-opacity-40 flex justify-start items-center">
        {isOpen && <EditDocumentModal setIsOpen={setIsOpen}  refetch={refetch} documents={"Nurses"} serviceId={id}/>}
        <div className="ml-2 md:ml-6 w-[35%] md:w-[25%] h-[90%] flex justify-start items-center font-roboto font-light">
          <p className="opacity-50 font-roboto font-light">{Name}</p>
        </div>
        <div className="w-[40%] md:w-[30%] h-[90%] flex justify-start items-center font-roboto font-light">
          <p className="opacity-50 font-roboto font-light">{Archive}</p>
        </div>
        <div className="w-[50%] h-[90%] hidden md:flex justify-start items-center font-roboto font-light">
          <p className="opacity-50 font-roboto font-light">{comment}</p>
        </div>
        <div className="w-[15%] h-[90%] flex justify-start items-center font-roboto font-light">
          <button className="text-white bg-primary-color px-3 py-3 rounded-xl mr-3"  onClick={handleDelete}>
            <img src={trash} alt="delete" className='h-5'/>
          </button>
          <button className="text-white bg-primary-color px-3 py-3 rounded-xl"  onClick={()=> setIsOpen(!isOpen)}>
            <img src={edit} alt="edit" />
          </button>   
        </div>
      </div>
    );
}

export default NurseList
