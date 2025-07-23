import { Router } from "express";
import { getAllTemplates, registerTemplate } from "../Controller/template.Controller.js";

const router = Router();

router.route("/add-template").post(registerTemplate)
router.route("/get-all-template").get(getAllTemplates)
export default router