import { Router } from "express";
import { createUser } from "../controller/users/create-user";

const router = Router();

router.post("/", createUser);

export default router;
