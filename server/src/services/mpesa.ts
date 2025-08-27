export const mpesa = {
  async collectKES(msisdn: string, amountKES: number) {
    // TODO: Integrate Safaricom M-Pesa Daraja API (STK Push)
    return { checkoutRequestID: 'mock-stk', msisdn, amountKES, status: 'Requested' };
  },
  async disburseKES(msisdn: string, amountKES: number) {
    // TODO: Integrate B2C payout via Daraja
    return { transactionId: 'mock-b2c', msisdn, amountKES, status: 'Queued' };
  }
};
