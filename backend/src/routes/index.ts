import { Router } from "express";
import auth from "./Auth/index";
const router = Router();

router.use("/", auth);