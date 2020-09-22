import React, { useState } from 'react';
import { Map, GoogleApiWrapper, Marker, InfoWindow, CurrentLocation } from 'google-maps-react';

const mapStyles = {
  width: '96%',
  height: '94%'
};

export function MapContainer({updateLocation, center, google }) {
  const [activeMarker, setActiveMarker] = useState();
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);

  const onDragEnd = (coord) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    updateLocation(lng, lat);
  }

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

  return (
    <>
      {center ? <Map
        google={google}
        zoom={14}
        style={mapStyles}
        initialCenter={center}>
        <Marker
          onClick={onMarkerClick}
          name={"Your estate's location"}
          draggable={true}
          onDragend={(t, map, coord) => onDragEnd(coord)}
        />
        <InfoWindow
          marker={activeMarker}
          visible={showingInfoWindow}
          onClose={onClose}
        >
          <div>
            <h4>Your estate's location</h4>
          </div>
        </InfoWindow>
      </Map> 
      :
      <CurrentLocation
      centerAroundCurrentLocation
      google={this.props.google}
    >
      <Marker onClick={this.onMarkerClick} name={"Your estate's location"} />
      <InfoWindow
        marker={this.state.activeMarker}
        visible={this.state.showingInfoWindow}
        onClose={this.onClose}
      >
        <div>
          <h4>Your estate's location</h4>
        </div>
      </InfoWindow>
    </CurrentLocation>
    }
    </>
  );
}

export default GoogleApiWrapper(
  (props) => ({
    apiKey: "AIzaSyApJurg5jDh3TeApK0pe9zIDuKSfaf7p94",
    center: props.center,
    updateLocation: props.updateLocation,
  }
  ))(MapContainer)