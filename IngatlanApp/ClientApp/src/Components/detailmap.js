import React, { useState } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow, CurrentLocation } from 'google-maps-react';
import { Ingatlantypes } from '../Api'

const mapStyles = {
  width: '96%',
  height: '94%'
};

export function MapContainer({ ingatlan, google, center }) {
  const [activeMarker, setActiveMarker] = useState();
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);


  const onMarkerClick = (props, marker, e) => {
    setActiveMarker(marker);
    setShowingInfoWindow(true);
  };

  const onClose = props => {
    if (showingInfoWindow) {
      setActiveMarker(null);
      setShowingInfoWindow(false);
    }
  };

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
      <Marker
        onClick={onMarkerClick}
        name={"Your estate's location"}
      />
      <InfoWindow
        marker={activeMarker}
        visible={showingInfoWindow}
        onClose={onClose}
      >
        <div className="text-left">
          <h5>{ingatlan.title}</h5>
          <div>
            <b>Address: <span> &nbsp; </span></b> {`${titleCase(ingatlan.address.city)}, ${romanize(ingatlan.address.district)}. ,${titleCase(ingatlan.address.streetName)}`} {ingatlan.address.streetNumber ? `${ingatlan.address.streetNumber}.` : <></>}
          </div>
          <div>
            <b>Type: <span> &nbsp; </span></b> {Ingatlantypes(ingatlan.ingatlanType)}
          </div>
          <div>
            <b>Price: <span> &nbsp; </span></b> {ingatlan.price} {ingatlan.advertisementType === 1 ? "M Ft." : ingatlan.advertisementType === 2 ? "Ft. / month" : "Ft. / day"}
          </div>
        </div>
      </InfoWindow>
    </Map >
  );
}

export default GoogleApiWrapper(
  (props) => ({
    apiKey: "AIzaSyApJurg5jDh3TeApK0pe9zIDuKSfaf7p94",
    ingatlan: props.ingatlan,
    center: props.center
  }
  ))(MapContainer)