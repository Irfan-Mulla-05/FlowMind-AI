import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const { register: formRegister, handleSubmit } = useForm({
    defaultValues: {
      role: "Developer",
      preferredTheme: "dark",
      preferredProductivityPeriod: "morning"
    }
  });
  const { register } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="glass-panel w-full max-w-2xl rounded-[32px] p-6">
        <h1 className="font-display text-3xl text-white">Create your FlowPilot workspace</h1>
        <p className="mt-2 text-sm text-slate-400">Pick your role now. It will shape templates, AI planning, and dashboard insights.</p>
        <form
          className="mt-6 grid gap-4 md:grid-cols-2"
          onSubmit={handleSubmit(async (values) => {
            try {
              setError("");
              await register(values);
              navigate("/app");
            } catch (requestError) {
              setError(requestError.response?.data?.message || "Registration failed");
            }
          })}
        >
          <Input label="Full name" {...formRegister("name")} />
          <Input label="Email" {...formRegister("email")} />
          <Input label="Password" type="password" {...formRegister("password")} />
          <label className="space-y-2">
            <span className="text-sm text-slate-300">Role</span>
            <select {...formRegister("role")} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
              <option value="Student">Student</option>
              <option value="Developer">Developer</option>
              <option value="Professional">Professional</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm text-slate-300">Theme</span>
            <select {...formRegister("preferredTheme")} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm text-slate-300">Best productivity period</span>
            <select
              {...formRegister("preferredProductivityPeriod")}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
            >
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
          </label>
          {error && <p className="text-sm text-rose-300 md:col-span-2">{error}</p>}
          <Button type="submit" className="md:col-span-2">
            Create account
          </Button>
        </form>
        <p className="mt-4 text-sm text-slate-400">
          Already have an account?{" "}
          <Link className="text-brand-300" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
