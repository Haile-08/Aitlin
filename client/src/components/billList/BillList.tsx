import { useState } from 'react';
import edit from '../../assets/edit.svg'
import EditDocumentModal from '../editDocumentModal/editDocumentModal';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BillList({index, period, comment, id}: any) {
  const [isOpen, setIsOpen] = useState(false);

    return (
    <div className="w-[100%] h-[5%] md:h-[7%] mt-3 py-6 border-b-[1.5px] border-black border-opacity-40 flex justify-start items-center">
        
        {isOpen && <EditDocumentModal setIsOpen={setIsOpen}  documents={"bill"} serviceId={id}/>}
        <div className="ml-2 md:ml-6 w-[25%] h-[90%] flex justify-start items-center font-roboto font-light">
          <p className="opacity-50 font-roboto font-light text-xs md:text-xl">Invoice {index}</p>
        </div>
        <div className="w-[50%] md:w-[30%] h-[90%] flex justify-start items-center font-roboto font-light">
          <p className="opacity-50 font-roboto font-light text-xs md:text-xl">{period}</p>
        </div>
        <div className="w-[50%] h-[90%] hidden md:flex justify-start items-center font-roboto font-light">
          <p className="opacity-50 font-roboto font-light text-xs md:text-xl">{comment}</p>
        </div>
        <div className="w-[15%] h-[90%] flex justify-start items-center font-roboto font-light">
          <button className="text-white bg-primary-color px-3 py-3 rounded-xl"  onClick={()=> setIsOpen(!isOpen)}>
            <img src={edit} alt="edit" />
          </button>   
        </div>
      </div>
    );
}

export default BillList