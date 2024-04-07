import { useNavigate } from 'react-router-dom';
import logout from '../../assets/logout.svg';
import { useDispatch } from 'react-redux';
import { setLogout } from '../../slice/authSlice';

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handelLogout = (e: { preventDefault: () => void; }) =>{
    e.preventDefault();
    dispatch(setLogout());
    navigate('/');
  }

  return (
    <div className='p-1 md:p-1 rounded-xl pl-3 md:pl-4 pr-2 md:p-3 shadow-md cursor-pointer bg-primary-color flex justify-center items-center' onClick={handelLogout}>
      <img src={logout} alt="logout" />
    </div>
  )
}

export default Logout
