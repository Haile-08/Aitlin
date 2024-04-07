import back from '../../assets/back.svg';

function Back() {
  return (
    <div className='flex justify-center items-center mx-5 py-3.5 px-5 rounded-lg cursor-pointer bg-primary-color'>
      <img src={back} alt="back" />
    </div>
  )
}

export default Back
