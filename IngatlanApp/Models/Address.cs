using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver.GeoJsonObjectModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IngatlanApi.Models {

    public enum StreetType { undefined, street, square, way }
    public class Address {

        [BsonRequired]
        public string City { get; set; }

        public int District { get; set; }

        public string StreetName { get; set; }
        public StreetType StreetType { get; set; }

        public string StreetNumber { get; set; }

        public double? Longitude { get; set; }

        public double? Latitude { get; set; }

        public GeoJsonPoint<GeoJson2DGeographicCoordinates> Location { get; private set; }

        public void SetLocation(double? lon, double? lat) {
            if (lon == null || lat == null)
                throw new ArgumentException("arguments cannot be null");

            Location = new GeoJsonPoint<GeoJson2DGeographicCoordinates>(
                new GeoJson2DGeographicCoordinates((double)lon, (double)lat));
        }
    }
}
