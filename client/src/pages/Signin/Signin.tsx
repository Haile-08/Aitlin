import { z } from 'zod';
import { SubmitHandler, useForm } from "react-hook-form";
import { SigninBanner } from "../../components"
import { zodResolver } from "@hookform/resolvers/zod";
import logo from '../../assets/logo.svg';
import emailLogo from '../../assets/email_logo.svg';
import passwordLogo from '../../assets/password_logo.svg';
import show from '../../assets/show.png';
import hide from '../../assets/hide.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(3)
    .max(10)
});
type SignUpSchemaType = z.infer<typeof SignUpSchema>;


function Signin() {
  const [isVisible, setVisible] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignUpSchemaType>({ resolver: zodResolver(SignUpSchema) });

  const onSubmit: SubmitHandler<SignUpSchemaType> = (data) => console.log(data);

  const handleResetNav = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    navigate('/password/request');
  }

  const handleHomeNav = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    navigate('/');
  }

  return (
    <div className="w-dvw h-dvh flex justify-center items-center flex-row">
      <SigninBanner />
      <div className="w-5/6 md:w-2/5 h-dvh flex justify-center items-center flex-col">
      <img src={logo} alt="logo" className='mb-20 cursor-pointer' onClick={handleHomeNav}/>
        <div className="w-10/12 flex flex-col">
          <p className='text-3xl font-roboto md:font-semibold mb-10'>Bienvenido a Atend</p>
          <form className='flex flex-col' onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="email" className="block font-roboto md:font-light mb-2 dark:text-white">Email</label>
            <div className={`relative h-14 rounded-lg border-2 ${errors.email? 'border-error' : 'border-primary-color'} flex flex-row justify-start items-center`}>
              <i className='absolute ml-6 mr-6 '><img src={emailLogo} alt="email logo" /></i>
              <div className="absolute left-16 h-2/3 w-0.5 bg-black opacity-25"></div>
              <input id="inputField" className="pl-20 h-10 w-full ml-6 outline-none appearance-none bg-transparent focus:bg-transparen"  placeholder="Email" {...register("email")} />
            </div>
            {errors.email && <span className='text-error'>{errors.email.message}</span>}

            <label htmlFor="password" className="mt-6 block font-roboto md:font-light mb-2 dark:text-white">Contraseña</label>
            <div className={`relative h-14 rounded-lg border-2 ${errors.password? 'border-error' : 'border-primary-color'} flex flex-row justify-start items-center`}>
              <i className='absolute ml-6 mr-6 '><img src={passwordLogo} alt="password logo" /></i>
              <div className="absolute left-16 h-2/3 w-0.5 bg-black opacity-25"></div>
              <input  id="inputField" className="pl-20 h-10 w-full ml-6 outline-none appearance-none bg-transparent focus:bg-transparen"  placeholder="Password"
              {...register("password")}
              type={!isVisible ? "password" : "text"} />
              <i onClick={()=> setVisible(!isVisible)} className='mr-6'> 
                 {isVisible ? <img src={show} alt="show password" className='w-8' />: <img src={hide} alt="show password" className='w-8'/>}
              </i>
            </div>
            {errors.password && <span className='text-error'>{errors.password.message}</span>}

            <div className="w-full flex justify-end mt-5 font-roboto font-semibold">
              <p className='cursor-pointer' onClick={handleResetNav}>¿Olvidaste tu contraseña?</p>
            </div>
            <button type="submit" className="h-16 mt-10 flex justify-center items-center font-semibold rounded-lg border border-transparent bg-primary-color hover:bg-primary-on-hover text-white  disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
              Ingresar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signin;
