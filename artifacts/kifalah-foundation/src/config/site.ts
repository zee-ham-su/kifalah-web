// The ONE file the Foundation fills in with its real, official details.
// Anything left empty is hidden or shown as "coming soon": the site never invents contact or
// account details. Only publish numbers/accounts the Foundation has confirmed in writing.
export const siteConfig = {
  contact: {
    address: [] as string[], // e.g. ["Street, Town", "Region, Ghana"]
    phones: [] as string[], // e.g. ["+233 ..."]
    emails: [] as string[], // e.g. ["info@yourdomain.org"]
  },
  giving: {
    bank: {
      accountName: "", // must be the Foundation's registered name
      bankName: "",
      accountNumber: "",
      branch: "",
    },
    mobileMoney: [] as { network: string; number: string; accountName: string }[],
  },
};

export const hasBankDetails = () => {
  const b = siteConfig.giving.bank;
  return Boolean(b.accountName && b.bankName && b.accountNumber);
};

export const hasGivingDetails = () => hasBankDetails() || siteConfig.giving.mobileMoney.length > 0;
