import { ApiCallItem } from '../ApiConstants';

export const getEstateById = async (id) => {
  return await fetch(`${ApiCallItem}/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getEstates = async (queryobj) => {
  return await fetch(`${ApiCallItem}/?${serialize(queryobj)}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
  });
}

export const getEstatesByLocation = async (coords,distance) => {
  return await fetch(`${ApiCallItem}/bylocation?longitude=${coords.longitude}&latitude=${coords.latitude}&distance=${distance}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json'
    }
});
}

export const addEstate = async (estate) => {
  return await fetch(`${ApiCallItem}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(estate)
  });
}

export const updateEstate = async (id, estate) => {
  return await fetch(`${ApiCallItem}/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(estate)
  });
}

export const uploadImageToEstate = async (id, img) => {
  return await fetch(`${ApiCallItem}/${id}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
    },
    body: img
  });
}

export const removeImageFromEstate = async (id, imgName) => {
  return await fetch(`${ApiCallItem}/image?name=${imgName}&id=${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
    }
  });
}

export const deleteEstate = async (id) => {
  return await fetch(`${ApiCallItem}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
    }
  });
}

export const highlightEstate = async (id,type) => {
  return await fetch(`${ApiCallItem}/${id}/highlight?highlightType=${type}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export const getEstateViews = async (id) => {
  return await fetch(`${ApiCallItem}/viewcount/?id=${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json'
    }
});
}

export const getCities = async () => {
  return await fetch(`${ApiCallItem}/cities`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
  });
}

export const getDistricts = async () => {
  return await fetch(`${ApiCallItem}/districts`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
  });
}

const serialize = function (obj, prefix) {
  var str = [], p;
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      var k = prefix ? prefix + "[" + p + "]" : p,
        v = obj[p];
      str.push((v !== null && typeof v === "object") ?
        serialize(v, k) :
        encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
  }
  return str.join("&");
}