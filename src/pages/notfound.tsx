import { Button } from "@/components/ui/button";
import { Link } from "react-router";

function NotFound() {
  return (
    <div className=" flex items-center justify-center ">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary ">404</h1>
        <div className="mt-4 flex items-center justify-center">
          <h2 className="text-2xl font-semibold">
            Page Not Found
          </h2>
        </div>
        <p className="m-6 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link to="/">Go Back Home</Link>
        </Button>
      </div>
    </div>
  );
}

export default NotFound;
