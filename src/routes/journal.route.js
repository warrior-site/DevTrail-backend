import express from "express"
import { createJournal, deleteJournal, getAllJournal,
     getOneJournal, updateJournal,starTheJournal} from "../controllers/journal.controller.js";

const router = express.Router();

router.get("/get-one-journal/:journalId",getOneJournal)
router.get("/all-journal/:userId",getAllJournal)
router.post("/create-journal",createJournal)
router.post("/update-journal",updateJournal)
router.post("/delete-journal",deleteJournal)
router.post("/star-journal",starTheJournal)


export default router;
