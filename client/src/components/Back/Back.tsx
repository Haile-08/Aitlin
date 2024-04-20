import { useNavigate } from 'react-router-dom';
import back from '../../assets/back.svg';

function Back({nav}: {nav: string}) {
  const navigate = useNavigate();

  const handleNav = () => {
    navigate(nav);
  }
  return (
    <div onClick={handleNav} className='flex justify-center items-center mr-2 md:mr-5 py-3 px-4 shadow-sm rounded-xl cursor-pointer bg-primary-color'>
      <img src={back} alt="back" className='w-2.5' />
    </div>
  )
}

export default Back
