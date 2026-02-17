// Detect source (loan-sarathi or smartmumbaisolutions)
function detectSource(req) {
  const appSource = req.headers['x-application-source'];
  
  if (appSource === 'smartmumbaisolutions') {
    return 'smartmumbaisolutions';
  }
  
  // Default to loan-sarathi
  return 'loan-sarathi';
}

module.exports = {
  detectSource
};
