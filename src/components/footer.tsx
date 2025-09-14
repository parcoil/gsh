
function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 fixed bottom-0 w-full">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">&copy; {new Date().getFullYear()} Parcoil. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <a href="https://dsc.gg/parcoil" className="hover:text-gray-300 transition-colors">
              Discord
            </a>
            <a href="https://github.com/parcoil" className="hover:text-gray-300 transition-colors">
              Github
            </a>

          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer