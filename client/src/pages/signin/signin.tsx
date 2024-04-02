import google from '../../assets/google.png';

function Signin({setModal}) {

  const handleGoogleRedirect = () => {
    window.open('http://localhost:4000/v1/login/federated/google', '_self');
  };

  return (
    <div className="w-dvw h-dvh flex justify-center items-center absolute bg-zinc-800 opacity-60">
      <div className="w-1/3 h-2/5 opacity-100 bg-black">
        <div className="w-11/12 h-1/6 flex justify-end items-center cursor-pointer" onClick={()=>setModal(false)}>x</div>
        <div className="w-full h-5/6 flex justify-start items-center flex-col">
          <p>Signin</p>
          <button className="w-7/12 h-1/6 bg-gray-100 text-gray-950 mt-14 flex justify-center items-center" onClick={handleGoogleRedirect}><img src={google} alt="google" className='w-4 mr-4'/>Google</button>
        </div>
      </div>
    </div>
  );
}

export default Signin;
