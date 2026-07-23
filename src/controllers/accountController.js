import mongoose from "mongoose";

import { Account } from "../models/Account.js";
import { Transaction } from "../models/Transaction.js";

export const createAccount = async (req, res) => {
  try {
    const { name } = req.body;
    const account = new Account({ name, user_id: req.user._id });
    await account.save();
    
    const accountData = account.toJSON();
    accountData.links = res.injectAccountLinks(account._id);
    
    res.status(201).json(accountData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ user_id: req.user._id });
    
    const accountsWithBalance = await Promise.all(accounts.map(async (account) => {
      const accountId = new mongoose.Types.ObjectId(account._id);
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
      const hydratedAccount = Account.hydrate(account.toJSON());
      const accountData = hydratedAccount.toJSON();
      
      return { 
        ...accountData, 
        balance,
        links: res.injectAccountLinks(account._id) 
      };
    }));
    
    const links = res.injectAccountCollectionLinks();
    res.json({ accounts: accountsWithBalance, links });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAccount = async (req, res) => {
  try {
    const { name } = req.body;
    const account = res.locals.account;
    
    account.name = name;
    await account.save();
    
    const accountData = account.toJSON();
    accountData.links = res.injectAccountLinks(account._id);
    
    res.json(accountData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const account = res.locals.account;
    
    await Transaction.deleteMany({ account_id: account._id });
    await Account.deleteOne({ _id: account._id });
    
    res.json({ message: "Account and associated transactions deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getGlobalBalance = async (req, res) => {
  try {
    const accounts = await Account.find({ user_id: req.user._id });
    const accountIds = accounts.map(a => new mongoose.Types.ObjectId(a._id));
    
    const result = await Transaction.aggregate([
      { $match: { account_id: { $in: accountIds } } },
      { $group: {
        _id: null,
        totalBalance: {
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
    
    const totalBalance = result.length > 0 ? result[0].totalBalance : 0;
    const links = res.injectAccountCollectionLinks();
    res.json({ totalBalance, links });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};