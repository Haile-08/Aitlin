import { useEffect, useState } from 'react';
import logo from '../../assets/logo.svg';
import Signin from '../signin/signin';
import { useParams } from 'react-router-dom';
import fetchData from '../../hook/authHook';
import { useDispatch } from 'react-redux';
import { setLogout } from '../../actions/authSlice';

function Home() {
  const [modal, setModal] = useState(false);
  const { id, token } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if(id && token){
      fetchData(id, token).then((data)=>{
        return dispatch(setLogout({
          user: data.user[0],
          token,
        }));
      });
    }
    console.log('token', token);
    console.log('id', id);
  }, []);

  return (
    <div className="w-dvw h-dvh bg-zinc-800 text-white flex justify-center items-center">
      {modal && <Signin setModal={setModal}/>}
      <div className="w-11/12 h-dvh bg-zinc-800">
        <div className="w-full h-1/6 flex justify-between items-center">
          <div className="flex flex-row items-center justify-center">
            <img src={logo} alt="logo" className='w-12' />
            <p className='text-2xl font-LATO'>Skid</p>
          </div>
          <button className='text-2xl font-LATO' onClick={()=> setModal(true)}>Signin</button>
        </div>
        <div className="w-full h-5/6 flex flex-col justify-center items-cente">
          <div className="h-5/6 h-3/6 flex items-center justify-center bg-zinc-700 m-3 cursor-pointer hover:bg-zinc-600">python</div>
          <div className="h-5/6 h-2/6 flex items-center justify-between">
            <div className="w-3/6 h-full flex items-center justify-center bg-zinc-700 m-3 cursor-pointer hover:bg-zinc-600">html</div>
            <div className="w-3/6 h-full flex items-center justify-center bg-zinc-700 m-3 cursor-pointer hover:bg-zinc-600">css</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
