import { Router } from "express";
import { createLead, deleteLead, exportCsv, getAllLeads, getSingleLead, updateLead } from "../controllers/lead.controller";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validateLead } from "../validators/lead.validator";

const router = Router();

router.use(protect);

router.get("/export/csv", exportCsv);
router.route("/").get(getAllLeads).post(validateLead, createLead);
router.route("/:id").get(getSingleLead).put(validateLead, updateLead).delete(authorize("admin"), deleteLead);

export default router;