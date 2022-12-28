import express, { Request, Response } from "express";
import { UserCreateDto } from "../interfaces/user/UserCreateDto";
import statusCode from "../modules/statusCode";
import message from "../modules/responseMessage";
import util from "../modules/util";
import { FileService } from "../services";
import fs from "fs";

/**
 * @route POST /file/upload
 * @desc Upload File
 * @access Public
 */
const uploadFileToS3 = async (req: Request, res: Response) => {
  if (!req.file)
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));

  const image: Express.MulterS3.File = req.file as Express.MulterS3.File;
  const { originalname, location } = image;

  try {
    const data = await FileService.createFile(location, originalname);

    res
      .status(statusCode.CREATED)
      .send(
        util.success(statusCode.CREATED, message.CREATE_FILE_SUCCESS, data)
      );
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  }
};

/**
 * @route POST /file/uploadMultiple
 * @desc Upload Files
 * @access Public
 */
const uploadFilesToS3 = async (req: Request, res: Response) => {
  if (!req.files)
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));

  const images: Express.MulterS3.File[] = req.files as Express.MulterS3.File[];

  try {
    const imageList: {
      location: string;
      originalname: string;
    }[] = await Promise.all(
      images.map((image: Express.MulterS3.File) => {
        return {
          location: image.location,
          originalname: image.originalname,
        };
      })
    );

    const data = await FileService.createFiles(imageList);

    res
      .status(statusCode.CREATED)
      .send(
        util.success(statusCode.CREATED, message.CREATE_FILE_SUCCESS, data)
      );
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  }
};

/**
 * @route GET /file/video
 * @desc Get Video by Read Stream
 * @access Public
 */
const getVideoByStream = async (req: Request, res: Response) => {
  //   try {
  //     const streamData = await FileService.getVideoByStream();
  //     res.write(streamData);
  //   } catch (error) {
  //     console.log(error);
  //     res
  //       .status(statusCode.INTERNAL_SERVER_ERROR)
  //       .send(
  //         util.fail(
  //           statusCode.INTERNAL_SERVER_ERROR,
  //           message.INTERNAL_SERVER_ERROR
  //         )
  //       );
  //   }
  let stream = fs.createReadStream("./src/sample/sample_video.mp4");

  // 큰 데이터를 stream으로 쪼개 data라는 이름의 변수로 전송
  stream.on("data", (data) => {
    res.write(data);
  });

  // 데이터 전송이 완료되면 end 이벤트 발생
  stream.on("end", () => {
    console.log("end streaming");
    res.end();
  });

  // 스트림도중 에러 발생시 error 이벤트 발생
  stream.on("error", (err) => {
    console.log(err);
    res.end("500 Internal Server " + err);
  });
};

export default {
  uploadFileToS3,
  uploadFilesToS3,
  getVideoByStream,
};
