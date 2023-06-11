import { socket } from "../socket";

export const handleStartProcess = (id, src) =>
  socket.emit("start_process", { id, src });
export const handleResumeProcess = (id) =>
  socket.emit("resume_process", { id });

export const handleSuspendProcess = (id) =>
  socket.emit("suspend_process", { id });

export const handleKillProcess = (id) => socket.emit("kill_process", { id });

export const handleHealthcheck = (id) => socket.emit("healthcheck", { id });
