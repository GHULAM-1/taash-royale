import { Request, Response } from "express";
import User from "../../schemas/user-schema"; 
import { UserRequest } from "../../types/user-types"; 

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, firstName, lastName, avatarUrl }: UserRequest = req.body;

    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(200).json({
          message: "User already exists",
          user: existingUser,
          isNewUser: false,
        });
        return;
      }
    } else {
      res.status(400).json({ error: "Required fields are missing" });
      return;
    }
    // Validate required fields

    if (!email || !firstName || !lastName || !avatarUrl) {
      res.status(400).json({ error: "Required fields are missing" });
      return;
    }

    // Check if user already exists

    const newUser = new User({
      email,
      firstName,
      lastName,
      avatarUrl,
    });

    const savedUser = await newUser.save();
    res.status(201).json({
      message: "User created successfully",
      user: savedUser,
      isNewUser: true,
    });
  } catch (error: any) {
    console.log("error: ", error?.response?.data);
    res.status(500).json({ error: "Error creating user" });
  }
};
