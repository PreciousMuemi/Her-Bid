export const fx = {
  async kesToUsdcRate() {
    // TODO: Pull a KES/USDC rate from a trusted oracle or provider
    return 0.0075; // example: 1 KES = 0.0075 USDC
  },
  async usdcToKesRate() {
    return 1 / (await this.kesToUsdcRate());
  }
};
