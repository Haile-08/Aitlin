import { useNavigate } from 'react-router-dom';
import logout from '../../assets/logout.svg';
import { useDispatch } from 'react-redux';
import { setLogout } from '../../slice/authSlice';
import { useQueryClient } from 'react-query';

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const handelLogout = (e: { preventDefault: () => void; }) =>{
    e.preventDefault();
    dispatch(setLogout());
    navigate('/');
    queryClient.removeQueries();
  }

  return (
    <div className='p-3 rounded-xl md:pl-4 pr-3 md:pr-2 shadow-md cursor-pointer bg-primary-color flex justify-center items-center' onClick={handelLogout}>
      <img src={logout} alt="logout" className='w-5' />
    </div>
  )
}

export default Logout
