import edit from '../../assets/edit.svg'

function InvoiceList() {
  return (
    <div className="w-[100%] h-[5%] md:h-[7%] mt-3 py-6 border-b-[1.5px] border-black flex justify-start items-center">
          <div className="ml-2 md:ml-6 w-[25%] h-[90%] flex justify-start items-center font-roboto font-light">
            <p className="text-xl">Invoice 1</p>
          </div>
          <div className="w-[30%] h-[90%] flex justify-start items-center font-roboto font-light">
            <p className="text-xs md:text-xl">16Mar - 24 Mar, 2024</p>
          </div>
          <div className="w-[50%] h-[90%] flex justify-start items-center font-roboto font-light">
            <p className="text-xs md:text-xl">Lorem Ipsum has been the industry's standard dummy...</p>
          </div>
          <div className="w-[15%] h-[90%] flex justify-start items-center font-roboto font-light">
            <button className="text-white bg-primary-color px-3 py-3 rounded-xl" >
              <img src={edit} alt="edit" />
            </button>   
          </div>
        </div>
  )
}

export default InvoiceList
