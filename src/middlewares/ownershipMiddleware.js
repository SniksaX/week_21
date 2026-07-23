import { Account } from "../models/Account.js";
import { Transaction } from "../models/Transaction.js";

export const checkAccountOwnership = async (req, res, next) => {
  try {
    const accountId = req.params.accountId || req.body.account_id;
    const account = await Account.findById(accountId);

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (account.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.locals.account = account;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const checkTransactionOwnership = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.transactionId).populate("account_id");

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.account_id.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    transaction.account_id = transaction.account_id._id;
    res.locals.transaction = transaction;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};