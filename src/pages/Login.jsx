import LoginForm from "../features/auth/LoginForm";

function Login() {
  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="space-y-12 w-md">
        <h1 className="text-3xl font-bold text-center">Admin Login</h1>

        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
