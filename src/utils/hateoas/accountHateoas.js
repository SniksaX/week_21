export const generateAccountLinks = (accountId, req) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  
  return {
    self: { href: `${baseUrl}/api/accounts/${accountId}`, method: "GET" },
    update: { href: `${baseUrl}/api/accounts/${accountId}`, method: "PUT" },
    delete: { href: `${baseUrl}/api/accounts/${accountId}`, method: "DELETE" },
    create_transaction: { href: `${baseUrl}/api/accounts/${accountId}/transactions`, method: "POST" },
    transactions: { href: `${baseUrl}/api/accounts/${accountId}/transactions`, method: "GET" },
    pending_transactions: { href: `${baseUrl}/api/accounts/${accountId}/transactions/pending`, method: "GET" }
  };
};

export const generateAccountCollectionLinks = (req) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  
  return {
    mine: { href: `${baseUrl}/api/accounts`, method: "GET" },
    create: { href: `${baseUrl}/api/accounts`, method: "POST" },
    global_balance: { href: `${baseUrl}/api/accounts/global-balance`, method: "GET" }
  };
};