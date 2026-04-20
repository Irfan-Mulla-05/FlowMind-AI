import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-panel w-full max-w-md rounded-[32px] p-6">
        <h1 className="font-display text-3xl text-white">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-400">Sign in to continue planning and shipping with clarity.</p>
        <form
          className="mt-6 space-y-4"
          onSubmit={handleSubmit(async (values) => {
            try {
              setError("");
              await login(values);
              navigate("/app");
            } catch (requestError) {
              setError(requestError.response?.data?.message || "Login failed");
            }
          })}
        >
          <Input label="Email" {...register("email")} />
          <Input label="Password" type="password" {...register("password")} />
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
        <p className="mt-4 text-sm text-slate-400">
          New here?{" "}
          <Link className="text-brand-300" to="/register">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
