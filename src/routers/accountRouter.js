import express from "express";

import {
  createAccount,
  getAccounts,
  updateAccount,
  deleteAccount,
  getGlobalBalance,
} from "../controllers/accountController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { checkAccountOwnership } from "../middlewares/ownershipMiddleware.js";
import { injectAccountHateoas } from "../middlewares/hateoasMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.use(injectAccountHateoas);

router.post("/", createAccount);
router.get("/", getAccounts);
router.get("/global-balance", getGlobalBalance);
router.put("/:accountId", checkAccountOwnership, updateAccount);
router.delete("/:accountId", checkAccountOwnership, deleteAccount);

export default router;