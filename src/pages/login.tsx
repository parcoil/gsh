import GoogleLogin from "../components/signin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Login() {
  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-center text-4xl">Login</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <GoogleLogin />
          <p className="text-sm text-muted-foreground text-center">
            You must login to submit a site.

   
          </p>
          <p className="text-sm text-muted-foreground text-center">
            If you already submitted a site, you can login to edit it.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
