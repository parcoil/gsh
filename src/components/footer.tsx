import { version } from "../../package.json";
import { Link } from "react-router";

function Footer() {
  return (
    <footer className="bg-card text-card-foreground py-4 w-full border-t mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <div className="text-center md:text-left text-sm">
            &copy; {new Date().getFullYear()} Parcoil. All rights reserved.
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-6 text-sm">
            <span>v{version}</span>
            <Link to="/tos" className="hover:underline">
              Terms of Service
            </Link>
            <a href="https://dsc.gg/parcoil" className="hover:underline">
              Discord
            </a>
            <a href="https://github.com/parcoil" className="hover:underline">
              Github
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
