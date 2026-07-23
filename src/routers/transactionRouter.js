import express from "express";

import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getPendingTransactions,
  getPopulatedTransactions,
} from "../controllers/transactionController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { checkAccountOwnership, checkTransactionOwnership } from "../middlewares/ownershipMiddleware.js";
import { injectTransactionHateoas } from "../middlewares/hateoasMiddleware.js";

const router = express.Router({ mergeParams: true });

router.use(authMiddleware);
router.use(injectTransactionHateoas);
router.use(checkAccountOwnership);

router.post("/", createTransaction);
router.get("/", getTransactions);
router.get("/pending", getPendingTransactions);
router.get("/populated", getPopulatedTransactions);
router.put("/:transactionId", checkTransactionOwnership, updateTransaction);
router.delete("/:transactionId", checkTransactionOwnership, deleteTransaction);

export default router;