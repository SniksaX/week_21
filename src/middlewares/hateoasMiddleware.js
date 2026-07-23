import { generateAccountLinks, generateAccountCollectionLinks } from "../utils/hateoas/accountHateoas.js";
import { generateTransactionLinks } from "../utils/hateoas/transactionHateoas.js";

export const injectAccountHateoas = (req, res, next) => {
  res.injectAccountLinks = (accountId) => generateAccountLinks(accountId, req);
  res.injectAccountCollectionLinks = () => generateAccountCollectionLinks(req);
  next();
};

export const injectTransactionHateoas = (req, res, next) => {
  res.injectTransactionLinks = (accountId, transactionId) => generateTransactionLinks(accountId, transactionId, req);
  next();
};