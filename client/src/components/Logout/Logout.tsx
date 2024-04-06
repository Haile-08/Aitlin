import logout from '../../assets/logout.svg';

function Logout() {
  return (
    <div className='p-1 md:p-1 rounded-xl pl-3 md:pl-4 pr-2 md:p-3 shadow-md cursor-pointer bg-primary-color flex justify-center items-center'>
      <img src={logout} alt="logout" />
    </div>
  )
}

export default Logout
