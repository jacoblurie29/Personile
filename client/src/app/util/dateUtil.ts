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

    

    return (dateObject.getMonth() + 1) + "/" + dateObject.getDate() + "/" + dateObject.getFullYear();
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

    

    return (dateObject.getMonth() + 1) + "/" + dateObject.getDate();
}


