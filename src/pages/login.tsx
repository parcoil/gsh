import GoogleLogin from "../components/signin";

function Login() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4">Login</h1>
        <GoogleLogin />
        <p className="text-gray-400 mt-2">you must login to submit a site</p>
      </div>
    </div>
  );
}

export default Login;
