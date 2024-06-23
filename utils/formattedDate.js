const formatTimeToUTC = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  const formatDateToUTC = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }
  
  module.exports = {
    formattedDate: (timestamp) => {
      let date = new Date(timestamp);
      let options = { day: "numeric", month: "long", year: "numeric" };
      let formattedDate = new Intl.DateTimeFormat("id-ID", options).format(date);
      return formattedDate;
    },
  
    convertToIso: ({ day = "00", month = "01", year, hour = "00", minutes = "00", second = "00" }) => {
      return `${year}-${month}-${day}T${hour}:${minutes}:${second}.000Z`
    },
  
    convertTOManual: ({ day = "00", month = "01", year }) => {
      return `${year}-${month}-${day}`
    },
  
  
    formatTimeToUTC,
    formatDateToUTC,
  
    formatDateTimeToUTC: (dateString) => {
      return `${formatDateToUTC(dateString)} ${formatTimeToUTC(dateString)}`
    },
  
    formatAddZeroFront: (data) => {
      if (data.length < 2) {
        data = '0' + data;
      }
      return data
    },
  
    getNextWeekDate: () => {
      const currentDate = new Date();
  
      const nextWeekDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
  
      return nextWeekDate;
    }
  };