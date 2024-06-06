import { z } from 'zod';
import { SubmitHandler, useForm } from "react-hook-form";
import { SigninBanner } from "../../components"
import { zodResolver } from "@hookform/resolvers/zod";
import logo from '../../assets/logo.svg';
import emailLogo from '../../assets/email_logo.svg';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { requestPasswordReset } from '../../hook';
import { useState } from 'react';

const SignUpSchema = z.object({
  email: z.string().email(),
});
type SignUpSchemaType = z.infer<typeof SignUpSchema>;

function PasswordRequest() {
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation(requestPasswordReset, {
    onSuccess: (data) => {
    
      if (!data.success){
        setIsError(true);
        setErrorMessage(data.message);
      }else {
        navigate('/password/request/success')
      }
    },
    onError: () => {
      setIsError(true);
      setErrorMessage('SYSTEM ERROR');
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignUpSchemaType>({ resolver: zodResolver(SignUpSchema) });

  const onSubmit: SubmitHandler<SignUpSchemaType> = (data) => {
    
    mutate(data.email);
    setErrorMessage('');
    setIsError(false);
  }

  const handleHomeNav = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    navigate('/');
  }

  return (
    <div className="w-dvw h-dvh flex justify-center items-center flex-row">
      <SigninBanner />
      <div className="w-5/6 md:w-2/5 h-dvh flex justify-center items-center flex-col">
      {isLoading && <div className="w-dvw h-dvh bg-primary-color flex items-center justify-center absolute top-0 left-0 bg-opacity-20">
        <svg aria-hidden="true" className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-primary-on-hover" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span className="sr-only">Loading...</span>
      </div>}
        <img src={logo} alt="logo" className='mb-20 cursor-pointer' onClick={handleHomeNav}/>
        <div className="w-10/12 flex flex-col">
          <p className='text-3xl font-roboto md:font-semibold mb-10'>Restablecer correo electrónico</p>
          <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="email" className="block font-roboto md:font-light mb-2 dark:text-white">Email</label>
            <div className={`relative h-14 rounded-lg border-2 ${errors.email? 'border-error' : 'border-primary-color'} flex flex-row justify-start items-center`}>
              <i className='absolute ml-6 mr-6 '><img src={emailLogo} alt="email logo" /></i>
              <div className="absolute left-16 h-2/3 w-0.5 bg-black opacity-25"></div>
              <input id="inputField" className="pl-20 h-10 w-full ml-6 outline-none appearance-none bg-transparent focus:bg-transparen"  placeholder="Email" {...register("email")} />
            </div>
            {errors.email && <span className='text-error'>{errors.email.message}</span>}
            {isError && <span className='text-error'>{errorMessage}</span>}
            <button type="submit" className="h-16 mt-10 flex justify-center items-center font-semibold rounded-lg border border-transparent bg-primary-color hover:bg-primary-on-hover text-white  disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
              Reiniciar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PasswordRequest
