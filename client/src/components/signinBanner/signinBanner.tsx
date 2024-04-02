import banner from '../../assets/banner.svg';

function SigninBanner() {
  return (
    <div className='hidden md:flex h-dvh w-3/5 flex justify-center bg-banner-color'>
      <img src={banner} alt="banner" className='h-dvh' />
    </div>
  )
}

export default SigninBanner;
