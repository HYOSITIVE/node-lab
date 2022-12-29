import express, { Request, Response } from "express";
import { UserCreateDto } from "../interfaces/user/UserCreateDto";
import statusCode from "../modules/statusCode";
import message from "../modules/responseMessage";
import util from "../modules/util";
import { FileService } from "../services";
import fs from "fs";
import got from "got";
import https from "https";

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
 * @desc Get Video by Only Read Stream
 * @access Public
 */
const getVideoByOnlyStream = async (req: Request, res: Response) => {
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

/**
 * @route GET /file/video-ejs
 * @desc Get Video by Only Read Stream
 * @access Public
 */
const getVideoByStream = async (req: Request, res: Response) => {
  // ejs에 videoSource 뿌려 줌
  res.render("video", {
    title: "Streaming Test",
    videoSource: `../sample/sample_video`,
  });
  // 파일 크기와 요청으로 부터의 범위 획득
  const fullPath = `src/sample/sample_video.mp4`;
  const fileStat = fs.statSync(fullPath);
  const { size } = fileStat;
  const { range } = req.headers;

  // 범위에 대한 요청이 있을 경우
  if (range) {
    // bytes= 부분을 없애고 - 단위로 문자열을 자름
    const parts = range.replace(/bytes=/, "").split("-");
    // 시작 부분의 문자열을 정수형으로 변환
    const start = parseInt(parts[0]);
    // 끝 부분의 문자열을 정수형으로 변환 (끝 부분이 없으면 총 파일 사이즈에서 - 1)
    const end = parts[1] ? parseInt(parts[1]) : size - 1;
    // 내보낼 부분의 길이
    const chunk = end - start + 1;
    // 시작 부분과 끝 부분의 스트림을 읽음
    const stream = fs.createReadStream(fullPath, { start, end });
    // 응답
    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunk,
      "Content-Type": "video/mp4",
    });
    // 스트림을 내보냄
    stream.pipe(res);
  } else {
    // 범위에 대한 요청이 아님
    res.writeHead(200, {
      "Content-Length": size,
      "Content-Type": "video/mp4",
    });
    // 스트림을 만들고 응답에 실어보냄
    fs.createReadStream(fullPath).pipe(res);
  }
};

/**
 * @route GET /file/video-url
 * @desc Get Video Stream by Url
 * @access Public
 */
const getVideoByUrl = async (req: Request, res: Response) => {
  const mp4Url: string = process.env.SAMPLE_VIDEO_URL!;
  // got.stream(mp4Url).pipe(res);
  https.get(mp4Url, (stream) => {
    stream.pipe(res);
  });
};

export default {
  uploadFileToS3,
  uploadFilesToS3,
  getVideoByOnlyStream,
  getVideoByStream,
  getVideoByUrl,
};
