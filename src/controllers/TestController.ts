import express, { Request, Response } from "express";
import util from "../modules/util";
import message from "../modules/responseMessage";
import statusCode from "../modules/statusCode";
import { MovieService } from "../services";

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


export default {
    testDate
}