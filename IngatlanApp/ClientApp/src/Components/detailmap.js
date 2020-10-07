import React, { useState} from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { useHistory } from 'react-router-dom';

const mapStyles = {
  width: '96%',
  height: '94%'
};

var count = 0;

export function MapContainer({ ingatlans, google, center }) {
  const [activeMarker, setActiveMarker] = useState();
  let history = useHistory();

  const onMarkerClick = (id) => {
    history.push(`/ingatlan/${id}`)
  };

  const onClose = () => {
    setActiveMarker(null);
  }


  function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  }

  function romanize(num) {
    if (isNaN(num))
      return NaN;
    var digits = String(+num).split(""),
      key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
        "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
        "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
      roman = "",
      i = 3;
    while (i--)
      roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
  }

  return (
    <Map
      google={google}
      zoom={16}
      style={mapStyles}
      initialCenter={center}>
      {ingatlans.map((ingatlan) => {
        return (
          
            <Marker
              onClick={e => {onMarkerClick(ingatlan.id)}}
              key={ingatlan.id + "marker"}
              position={{
                lat: ingatlan.address.latitude,
                lng: ingatlan.address.longitude
              }}
            >
            </Marker>
        );
      })}
    </Map >
  );
}

export default GoogleApiWrapper(
  (props) => ({
    apiKey: "AIzaSyApJurg5jDh3TeApK0pe9zIDuKSfaf7p94",
    ingatlan: props.ingatlans,
    center: props.center,
  }
  ))(MapContainer)