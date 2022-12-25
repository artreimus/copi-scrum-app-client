const formatDate = (date) => {
  return new Date(date).toLocaleString('en-US', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });
};

export default formatDate;
