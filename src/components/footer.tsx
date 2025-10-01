import { version } from "../../package.json";

function Footer() {
  return (
    <footer className="bg-card text-card-foreground py-4 bottom-0 w-full border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="text-center md:text-left">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Parcoil. All rights reserved.
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm">v{version}</p>
          </div>
          <div className="flex justify-center md:justify-end space-x-4">
            <a href="https://dsc.gg/parcoil" className="text-sm hover:underline">
              Discord
            </a>
            <a href="https://github.com/parcoil" className="text-sm hover:underline">
              Github
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
