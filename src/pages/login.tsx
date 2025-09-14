import GoogleLogin from '../components/signin'

function login() {
  return (
    <div className=' flex items-center justify-center mt-5 flex flex-col'>
        <h1 className='text-3xl font-bold mb-4'>Login</h1>
        <GoogleLogin/>
        <p className='text-gray-400 mt-2'>you must login to submit a site</p>
    </div>
  )
}

export default login