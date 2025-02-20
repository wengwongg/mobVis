import LoginForm from "@/components/page-specific/login/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-components/card";
import HyperLink from "@/components/custom/hyperlink";

export default function Login() {
  return (
    <div>
      <div className="flex justify-center">
        <Card className="w-[500px] mt-20">
          <CardHeader>
            <CardTitle className="text-lg">Login</CardTitle>
            <CardDescription>
              Need an account?{" "}
              <HyperLink url="/register">Create an account.</HyperLink>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
