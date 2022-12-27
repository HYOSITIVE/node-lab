import { FileResponseDto } from "../interfaces/file/FileResponseDto";
import File from "../models/File";
import fs from "fs";

const createFile = async (
  link: string,
  fileName: string
): Promise<FileResponseDto> => {
  try {
    const file = new File({
      link,
      fileName,
    });

    await file.save();

    const data = {
      _id: file._id,
      link,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const createFiles = async (
  imageList: { location: string; originalname: string }[]
): Promise<FileResponseDto[]> => {
  try {
    const data = await Promise.all(
      imageList.map(async (image) => {
        const file = new File({
          link: image.location,
          fileName: image.originalname,
        });

        await file.save();

        return {
          _id: file._id,
          link: file.link,
        };
      })
    );

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getReadStream = async (): Promise<any> => {
  try {
    let stream = fs.createReadStream("./src/sample/sample_mp4.mp4");
    var count = 0;
    stream.on("data", function (data) {
      count = count + 1;
      console.log(`data count=` + count);

      //   console.log(`data: ${data}\ndata type: ${typeof data}\n`);
      return data;
    });
    stream.on("end", function () {
      console.log("end streaming\n");
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  createFile,
  createFiles,
  getReadStream,
};
