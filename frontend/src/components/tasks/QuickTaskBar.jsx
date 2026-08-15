import { useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";

const QuickTaskBar = ({ onSubmit, loading }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!title.trim()) return;
    await onSubmit({ title, priority: "medium" });
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-[28px] p-4">
      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <Input
          placeholder="Quick add a task. Keep it simple and frictionless."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Task"}
        </Button>
      </div>
    </form>
  );
};

export default QuickTaskBar;
