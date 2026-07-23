export const generateTransactionLinks = (accountId, transactionId, req) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  
  return {
    self: { href: `${baseUrl}/api/accounts/${accountId}/transactions/${transactionId}`, method: "GET" },
    update: { href: `${baseUrl}/api/accounts/${accountId}/transactions/${transactionId}`, method: "PUT" },
    delete: { href: `${baseUrl}/api/accounts/${accountId}/transactions/${transactionId}`, method: "DELETE" }
  };
};