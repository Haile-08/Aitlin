import { useState } from 'react';
import edit from '../../assets/edit.svg'
import EditDocumentModal from '../editDocumentModal/editDocumentModal';

function BinnacleList({index, period, comment, id}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-[100%] h-[5%] md:h-[7%] mt-3 py-6 border-b-[1.5px] border-black border-opacity-40 flex justify-start items-center">
      {isOpen && <EditDocumentModal setIsOpen={setIsOpen}  documents={"binnacle"} serviceId={id}/>}
    <div className="ml-2 md:ml-6 w-[25%] h-[90%] flex justify-start items-center font-roboto font-light">
      <p className="opacity-50 font-roboto font-light">Log {index}</p>
    </div>
    <div className="w-[30%] h-[90%] flex justify-start items-center font-roboto font-light">
      <p className="opacity-50 font-roboto font-light">{period}</p>
    </div>
    <div className="w-[50%] h-[90%] flex justify-start items-center font-roboto font-light">
      <p className="opacity-50 font-roboto font-light">{comment}</p>
    </div>
    <div className="w-[15%] h-[90%] flex justify-start items-center font-roboto font-light">
      <button className="text-white bg-primary-color px-3 py-3 rounded-xl" onClick={()=> setIsOpen(!isOpen)}>
        <img src={edit} alt="edit" />
      </button>   
    </div>
  </div>
  )
}

export default BinnacleList
