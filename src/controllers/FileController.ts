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
 * @route GET /file/readStream
 * @desc Get Read Stream
 * @access Public
 */
const getReadStream = async (req: Request, res: Response) => {
  //   try {
  //     const streamData = await FileService.getReadStream();
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
  var stream = fs.createReadStream("./src/sample/sample_mp4.mp4");
  // 2. 잘게 쪼개진 stream 이 몇번 전송되는지 확인하기 위한 count
  var count = 0;
  // 3. 잘게 쪼개진 data를 전송할 수 있으면 data 이벤트 발생
  stream.on("data", function (data) {
    count = count + 1;
    console.log("data count=" + count);
    // 3.1. data 이벤트가 발생되면 해당 data를 클라이언트로 전송
    res.write(data);
  });

  // 4. 데이터 전송이 완료되면 end 이벤트 발생
  stream.on("end", function () {
    console.log("end streaming");
    // 4.1. 클라이언트에 전송완료를 알림
    res.end();
  });

  // 5. 스트림도중 에러 발생시 error 이벤트 발생
  stream.on("error", function (err) {
    console.log(err);
    // 5.2. 클라이언트로 에러메시지를 전달하고 전송완료
    res.end("500 Internal Server " + err);
  });
};

export default {
  uploadFileToS3,
  uploadFilesToS3,
  getReadStream,
};
