import { useEffect } from "react";
import { useForm } from "react-hook-form";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import { useAuth } from "../context/AuthContext";

const SettingsPage = () => {
  const { user, updateProfile } = useAuth();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      avatar: "",
      role: "Developer",
      lifeMode: "Developer Mode",
      preferredTheme: "dark",
      preferredProductivityPeriod: "morning"
    }
  });

  useEffect(() => {
    if (!user) return;
    reset({
      name: user.name || "",
      avatar: user.avatar || "",
      role: user.role || "Developer",
      lifeMode: user.lifeMode || "Developer Mode",
      preferredTheme: user.preferredTheme || "dark",
      preferredProductivityPeriod: user.preferredProductivityPeriod || "morning"
    });
  }, [user, reset]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Tune the workspace to how you actually work"
        description="Adjust role, life mode, theme, and preferred focus period so your dashboard and AI recommendations stay relevant."
      />

      <Card className="max-w-3xl">
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={handleSubmit(async (values) => {
            await updateProfile(values);
          })}
        >
          <input {...register("name")} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" placeholder="Name" />
          <input {...register("avatar")} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white" placeholder="Avatar URL" />
          <select {...register("role")} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
            <option value="Student">Student</option>
            <option value="Developer">Developer</option>
            <option value="Professional">Professional</option>
          </select>
          <select {...register("lifeMode")} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
            <option value="Student Mode">Student Mode</option>
            <option value="Developer Mode">Developer Mode</option>
            <option value="Fitness Mode">Fitness Mode</option>
          </select>
          <select {...register("preferredTheme")} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="system">System</option>
          </select>
          <select {...register("preferredProductivityPeriod")} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white">
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
            <option value="night">Night</option>
          </select>
          <Button type="submit" className="md:col-span-2">
            Save settings
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default SettingsPage;
