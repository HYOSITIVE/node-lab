import mongoose from "mongoose";

export interface ScheduleInfo {
    title: string,
    subSchedules: mongoose.Types.ObjectId[],
}