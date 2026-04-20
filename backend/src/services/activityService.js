import { ActivityLog } from "../models/ActivityLog.js";

export const logActivity = async (userId, type, message, metadata = {}) => {
  await ActivityLog.create({
    user: userId,
    type,
    message,
    metadata
  });
};
