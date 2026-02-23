// Detect source (loan-sarathi or smartmumbaisolutions)
function detectSource(req) {
  // 1. Check explicit header first (most reliable)
  const appSource = req.headers['x-application-source'];
  if (appSource === 'smartmumbaisolutions' || appSource === 'smartmumbai') {
    return 'smartmumbaisolutions';
  }

  // 2. Check Origin, Referer, Host for smartsolutions keywords
  const origin = req.headers['origin'] || '';
  const referer = req.headers['referer'] || '';
  const host = req.headers['host'] || '';
  const allHeaders = `${origin} ${referer} ${host}`.toLowerCase();

  const smartKeywords = ['smartmumbaisolutions', 'smartmumbai', 'smartsolutionsmumbai', 'smartsolutions'];
  if (smartKeywords.some(keyword => allHeaders.includes(keyword))) {
    return 'smartmumbaisolutions';
  }

  // Default to loan-sarathi
  return 'loan-sarathi';
}

module.exports = {
  detectSource
};
