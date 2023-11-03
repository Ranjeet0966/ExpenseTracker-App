const getExpenses = (req, where) => {
    return req.user.getExpenses();
  };
  
  const getAllDownloadHistory=(req)=>{
      return req.user.getFileurls()
  }
  
  module.exports = { getExpenses, getAllDownloadHistory };