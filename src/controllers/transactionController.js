import mongoose from "mongoose";

import { Transaction } from "../models/Transaction.js";

export const createTransaction = async (req, res) => {
  try {
    const account = res.locals.account;
    const transactionData = {
      ...req.body,
      account_id: account._id
    };

    const transaction = new Transaction(transactionData);
    await transaction.save();

    const transactionObj = transaction.toJSON();
    transactionObj.links = res.injectTransactionLinks(account._id, transaction._id);

    res.status(201).json(transactionObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const account = res.locals.account;
    const accountId = new mongoose.Types.ObjectId(account._id);

    const transactions = await Transaction.find({ account_id: accountId });

    const result = await Transaction.aggregate([
      { $match: { account_id: accountId } },
      { $group: {
        _id: null,
        balance: {
          $sum: {
            $cond: [
              { $eq: ["$type", "credit"] },
              "$amount",
              { $multiply: ["$amount", -1] }
            ]
          }
        }
      }}
    ]);

    const balance = result.length > 0 ? result[0].balance : 0;

    const transactionsWithLinks = transactions.map(t => {
      const hydrated = Transaction.hydrate(t.toJSON());
      const transactionObj = hydrated.toJSON();
      transactionObj.links = res.injectTransactionLinks(account._id, t._id);
      return transactionObj;
    });

    res.json({ transactions: transactionsWithLinks, balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const transaction = res.locals.transaction;
    const updates = req.body;

    const forbidden = ["account_id", "_id", "createdAt", "updatedAt"];
    Object.keys(updates).forEach(key => {
      if (!forbidden.includes(key)) {
        transaction[key] = updates[key];
      }
    });

    await transaction.save();

    const transactionObj = transaction.toJSON();
    transactionObj.links = res.injectTransactionLinks(transaction.account_id, transaction._id);

    res.json(transactionObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const transaction = res.locals.transaction;

    await Transaction.deleteOne({ _id: transaction._id });

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingTransactions = async (req, res) => {
  try {
    const account = res.locals.account;
    const transactions = await Transaction.find({ 
      account_id: account._id,
      is_pending: true
    });

    const transactionsWithLinks = transactions.map(t => {
      const hydrated = Transaction.hydrate(t.toJSON());
      const transactionObj = hydrated.toJSON();
      transactionObj.links = res.injectTransactionLinks(account._id, t._id);
      return transactionObj;
    });

    res.json({ transactions: transactionsWithLinks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPopulatedTransactions = async (req, res) => {
  try {
    const account = res.locals.account;
    const transactions = await Transaction.find({ account_id: account._id }).populate("account_id");

    const transactionsWithLinks = transactions.map(t => {
      const hydrated = Transaction.hydrate(t.toJSON());
      const transactionObj = hydrated.toJSON();
      transactionObj.links = res.injectTransactionLinks(account._id, t._id);
      return transactionObj;
    });

    res.json({ transactions: transactionsWithLinks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};