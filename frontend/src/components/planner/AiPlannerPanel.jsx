import { useState } from "react";
import Button from "../common/Button";

const AiPlannerPanel = ({ onPlan, onReschedule, onBreakdown, onVoice }) => {
  const [goal, setGoal] = useState("");
  const [transcript, setTranscript] = useState("");

  return (
    <div className="space-y-4">
      <div className="glass-panel rounded-[28px] p-5">
        <h3 className="text-lg font-semibold text-white">AI Task Breakdown</h3>
        <textarea
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
          rows="3"
          placeholder="Turn a large goal into structured subtasks."
          className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
        />
        <Button className="mt-3" onClick={() => onBreakdown(goal)}>
          Break down goal
        </Button>
      </div>

      <div className="glass-panel rounded-[28px] p-5">
        <h3 className="text-lg font-semibold text-white">Voice to Task</h3>
        <textarea
          value={transcript}
          onChange={(event) => setTranscript(event.target.value)}
          rows="3"
          placeholder='Example: "Finish assignment and revise DBMS tonight."'
          className="mt-3 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
        />
        <Button className="mt-3" onClick={() => onVoice(transcript)}>
          Convert to tasks
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Button variant="secondary" onClick={onPlan}>
          Generate day plan
        </Button>
        <Button variant="secondary" onClick={onReschedule}>
          Auto-reschedule missed work
        </Button>
      </div>
    </div>
  );
};

export default AiPlannerPanel;
