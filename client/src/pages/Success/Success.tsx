import { useNavigate } from 'react-router-dom';
import check from '../../assets/check.png';
import { successPropsType } from '../../@types';

function Success({ link, info }: successPropsType) {
  const navigate = useNavigate();

  const handleResetNav = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    navigate(link);
  }

  return (
    <div className='w-dvw h-dvh flex justify-center items-center flex-col'>
      <div className="md:w-96 w-72 md:h-96 h-72 rounded-full bg-primary-color bg-opacity-30 flex justify-center items-center">
        <div className="md:w-52 w-40 md:h-52 h-40 rounded-full bg-primary-color bg-opacity-100 flex justify-center items-center">
          <img src={check} alt="check" />
        </div>
      </div>
      <p className='md:w-2/5 w-4/5 flex justify-center items-center font-roboto mt-12 font-medium'>{info}</p>
      <button type="button" onClick={handleResetNav} className="h-16 md:w-1/5 w-4/5  mt-16 flex justify-center items-center font-semibold rounded-lg border border-transparent bg-primary-color hover:bg-primary-on-hover text-white  disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
        Back
      </button>
    </div>
  )
}

export default Success;
