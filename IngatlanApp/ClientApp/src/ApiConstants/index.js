export const ApiCallItem = "/api/estate";
export const ApiCallAccount = "/account";
export const ApiCallReview = "/api/review";
export const ApiCallImage = "/api/image";
export const ApiCallMessage = "/api/message";

export const AdvertisementTypes = (value) => {
  switch(value) {
      case 0:
        return "Unknown";
      case 1:
        return "For sale"
      case 2:
          return "For rent"
      case 3:
          return "AirBnB"
      default:
        return "Unknown"
    }
}

export const estatetypes = (value) => {
    switch(value) {
        case 0:
          return "Unknown";
        case 1:
          return "Detached House"
        case 2:
            return "Semi-deatched House"
        case 3:
            return "Apartment"
        case 4:
            return "Penthouse"
        case 5:
            return "Farm"
        default:
          return "Unknown"
      }
}
export const Streettypes = (value) => {
    switch(value) {
        case 0:
          return "Unknown";
        case 1:
          return "street"
        case 2:
            return "square"
        case 3:
            return "road"
        default:
          return "Unknown"
      }
}

export const Reviewtypes = (value) =>{
  switch(value) {
    case 0:
      return "neutral";
    case 1:
      return "positive"
    case 2:
        return "negative"
    default:
      return "unkown"
  }
}