import { useNavigate } from 'react-router-dom';
import back from '../../assets/back.svg';

function Back({nav}: {nav: string}) {
  const navigate = useNavigate();

  const handleNav = () => {
    navigate(nav);
  }
  return (
    <div onClick={handleNav} className='flex justify-center items-center mx-5 py-3.5 px-5 rounded-lg cursor-pointer bg-primary-color'>
      <img src={back} alt="back" />
    </div>
  )
}

export default Back
