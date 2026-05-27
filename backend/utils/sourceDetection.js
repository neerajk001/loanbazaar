// Detect source (loanbazaar.com or ssolutions.in)
function detectSource(req) {
  // 1. Check explicit header first (most reliable)
  const appSource = req.headers['x-application-source'];
  if (appSource === 'ssolutions.in' || appSource === 'ssolutions') {
    return 'ssolutions.in';
  }

  // 2. Check Origin, Referer, Host for ssolutions keywords
  const origin = req.headers['origin'] || '';
  const referer = req.headers['referer'] || '';
  const host = req.headers['host'] || '';
  const allHeaders = `${origin} ${referer} ${host}`.toLowerCase();

  const smartKeywords = ['ssolutions.in', 'ssolutions'];
  if (smartKeywords.some(keyword => allHeaders.includes(keyword))) {
    return 'ssolutions.in';
  }

  // Default to loanbazaar.com
  return 'loanbazaar.com';
}

module.exports = {
  detectSource
};
