

function NotFound() {
  return (
    <div className=" flex items-center justify-center ">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200">404</h1>
        <div className="mt-4 flex items-center justify-center">
          <div className="h-1 w-16 bg-gray-200 mx-2"></div>
          <h2 className="text-2xl font-semibold text-gray-200">Page Not Found</h2>
          <div className="h-1 w-16 bg-gray-200 mx-2"></div>
        </div>
        <p className="mt-6 text-gray-500">The page you're looking for doesn't exist or has been moved.</p>
        <a 
          href="/"
          className="mt-8 inline-block px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
        >
          Go Back Home
        </a>
      </div>
    </div>
  )
}

export default NotFound
