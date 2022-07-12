import express, { Request, Response } from "express";
import util from "../modules/util";
import message from "../modules/responseMessage";
import statusCode from "../modules/statusCode";
import Schedule from "../models/Schedule";

/**
 * @route GET /date
 * @desc Day Test
 * @access Public
 */
const testDate = async (req: Request, res: Response) => {
    const { date, time } = req.query;
    console.log(`date: ${date}, time: ${time}`);
    const stringDate = `${date} ${time}`;
    const dateDate = new Date(stringDate);
    console.log(`stringDate: ${typeof(stringDate)} ${stringDate}`);
    console.log(`dateDate: ${typeof(dateDate)} ${dateDate}`);

    // createMovie 호출해서 stringDate 들어가는지 확인
    
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SEARCH_MOVIE_SUCCESS));
}

/**
 * @route GET /self-reference
 * @desc Self Reference Test
 * @access Public
 */
const testSelfReference = async (req: Request, res: Response) => {
    const { title } = req.body;
    try {
        const schedule = new Schedule({
            title: title,
        });

        await schedule.save();

        const data = {
            _id: schedule._id
        };
        res.status(statusCode.OK).send(util.success(statusCode.OK, message.SEARCH_MOVIE_SUCCESS, data));
    } catch (error) {
        console.log(error);
        res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
    }
}

/**
 * @route GET /subschedule
 * @desc Create Subschedule
 * @access Public
 */
const createSubSchedule = async (req: Request, res: Response) => {
    const { scheduleId, title } = req.body;
    // console.log(scheduleId, subScheduleId);

    try {
        // schedule find해서 얘의 category, user 다 받아와야 됨
        const subSchedule = new Schedule({
            title: title
        });

        await subSchedule.save();

        await Schedule.updateOne({ _id: scheduleId }, { $push: { subSchedules: subSchedule } });
        const parent = await Schedule.findById("62cbf458512b6a53d927b1d7");

        console.log(parent);

        res.status(statusCode.OK).send(util.success(statusCode.OK, message.SEARCH_MOVIE_SUCCESS, parent));
    } catch (error) {
        console.log(error);
        res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
    }
}

export default {
    testDate,
    testSelfReference,
    createSubSchedule
}