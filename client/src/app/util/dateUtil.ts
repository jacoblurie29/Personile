export function formatDateString(date: string) {
  var year = parseInt(date.substring(11, 15));
  var month = date.substring(4, 7);
  var dateNum = parseInt(date.substring(8, 10));
  var numMonth = 0;

  switch (month) {
    case "Jan":
      numMonth = 0;
      break;
    case "Feb":
      numMonth = 1;
      break;
    case "Mar":
      numMonth = 2;
      break;
    case "Apr":
      numMonth = 3;
      break;
    case "May":
      numMonth = 4;
      break;
    case "Jun":
      numMonth = 5;
      break;
    case "Jul":
      numMonth = 6;
      break;
    case "Aug":
      numMonth = 7;
      break;
    case "Sep":
      numMonth = 8;
      break;
    case "Oct":
      numMonth = 9;
      break;
    case "Nov":
      numMonth = 10;
      break;
    case "Dec":
      numMonth = 11;
      break;
    default:
      numMonth = 0;
      break;
  }

  var dateObject = new Date(year, numMonth, dateNum);

  return (
    dateObject.getMonth() +
    1 +
    "/" +
    dateObject.getDate() +
    "/" +
    dateObject.getFullYear()
  );
}

export function formatDateStringNoYear(date: string) {
  var year = parseInt(date.substring(11, 15));
  var month = date.substring(4, 7);
  var dateNum = parseInt(date.substring(8, 10));
  var numMonth = 0;

  switch (month) {
    case "Jan":
      numMonth = 0;
      break;
    case "Feb":
      numMonth = 1;
      break;
    case "Mar":
      numMonth = 2;
      break;
    case "Apr":
      numMonth = 3;
      break;
    case "May":
      numMonth = 4;
      break;
    case "Jun":
      numMonth = 5;
      break;
    case "Jul":
      numMonth = 6;
      break;
    case "Aug":
      numMonth = 7;
      break;
    case "Sep":
      numMonth = 8;
      break;
    case "Oct":
      numMonth = 9;
      break;
    case "Nov":
      numMonth = 10;
      break;
    case "Dec":
      numMonth = 11;
      break;
    default:
      numMonth = 0;
      break;
  }

  var dateObject = new Date(year, numMonth, dateNum);

  return dateObject.getMonth() + 1 + "/" + dateObject.getDate();
}

export function convertDateToMilliseconds(date: string) {
  return Date.parse(date);
}

export function convertTimeStringToSeconds(time: string) {
  if (time.substring(1, 2) != ":") {
    var hours = Number.parseInt(time.substring(0, 2));
    var minutes = Number.parseInt(time.substring(3, 5));
    var seconds = Number.parseInt(time.substring(6, 8));
    var half = time.substring(9, 11);
  } else {
    var hours = Number.parseInt(time.substring(0, 1));
    var minutes = Number.parseInt(time.substring(2, 4));
    var seconds = Number.parseInt(time.substring(5, 7));
    var half = time.substring(8, 10);
  }

  if (half == "PM" && hours != 12) {
    hours += 12;
  }

  if (half == "AM" && hours == 12) {
    hours = 0;
  }

  return hours * 3600 + minutes * 60 + seconds;
}

export function convertDateStringToSeconds(date: string) {
  return Math.floor(Date.parse(date) / 1000);
}

export function convertDateAndTimeStringToSeconds(date: string, time: string) {
  return convertDateStringToSeconds(date) + convertTimeStringToSeconds(time);
}
