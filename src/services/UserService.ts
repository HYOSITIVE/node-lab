import { PostBaseResponseDto } from "../interfaces/common/PostBaseResponseDto";
import { UserCreateDto } from "../interfaces/user/UserCreateDto";
import { UserResponseDto } from "../interfaces/user/UserResponseDto";
import { UserUpdateDto } from "../interfaces/user/UserUpdateDto";
import mongoUser from "../models/user";
import bcrypt from "bcryptjs";
import { UserSignInDto } from "../interfaces/user/UserSignInDto";
import { User } from "../entity/User";
import { myDataSource } from "../config/dbConfig";

const UserRepository = myDataSource.getRepository(User);

const createUser = async (
  userCreateDto: UserCreateDto
): Promise<PostBaseResponseDto | null> => {
  try {
    const existUser = await mongoUser.findOne({
      email: userCreateDto.email,
    });
    if (existUser) return null;

    const user = new mongoUser({
      name: userCreateDto.name,
      phone: userCreateDto.phone,
      email: userCreateDto.email,
      age: userCreateDto.age,
      password: userCreateDto.password,
      school: userCreateDto.school,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(userCreateDto.password!, salt);

    await user.save();

    const data = {
      _id: user.id,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const createPgUser = async (userCreateDto: UserCreateDto): Promise<number> => {
  try {
    const user = new User();
    user.name = userCreateDto.name;
    const savedUser = await UserRepository.save(user);

    return savedUser.id;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateUser = async (userId: string, userUpdateDto: UserUpdateDto) => {
  try {
    const updatedUser = {
      name: userUpdateDto.name,
      phone: userUpdateDto.phone,
      email: userUpdateDto.email,
      age: userUpdateDto.age,
      school: userUpdateDto.school,
    };
    await mongoUser.findByIdAndUpdate(userId, updatedUser);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findUserById = async (userId: string) => {
  try {
    const user: UserResponseDto | null = await mongoUser.findById(userId);
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteUser = async (userId: string) => {
  try {
    await mongoUser.findByIdAndDelete(userId);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const signInUser = async (
  userSignInDto: UserSignInDto
): Promise<PostBaseResponseDto | null | number> => {
  try {
    const user = await mongoUser.findOne({
      email: userSignInDto.email,
    });
    if (!user) return null;

    const isMatch = await bcrypt.compare(userSignInDto.password, user.password);
    if (!isMatch) return 401;

    const data = {
      _id: user._id,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  createUser,
  createPgUser,
  updateUser,
  findUserById,
  deleteUser,
  signInUser,
};
