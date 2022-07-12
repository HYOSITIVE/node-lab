import mongoose from "mongoose";
import { ScheduleInfo } from "../interfaces/schedule/ScheduleInfo";

const ScheduleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subSchedules : [{
        subSchedule: {
            type: mongoose.Types.ObjectId,
            required: false,
            ref: "Schedule"
        }
    }]
}, {
    timestamps: true
});

export default mongoose.model<ScheduleInfo & mongoose.Document>("Schedule", ScheduleSchema);