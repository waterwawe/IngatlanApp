using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver.GeoJsonObjectModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IngatlanApi.Models {

    public enum StreetType { undefined, street, square, way }
    public class Address {

        /// <summary>
        /// Város
        /// </summary>
        [BsonRequired]
        public string City { get; set; }

        /// <summary>
        /// Kerület
        /// </summary>
        public int District { get; set; }
        
        /// <summary>
        /// Közterület neve
        /// </summary>
        public string StreetName { get; set; }

        /// <summary>
        /// Közterület típusa
        /// </summary>
        public StreetType StreetType { get; set; }

        /// <summary>
        /// Házszám
        /// </summary>
        public string StreetNumber { get; set; }

        /// <summary>
        /// Szélességi fok
        /// </summary>
        public double? Longitude { get; set; }

        /// <summary>
        /// Magassági fok
        /// </summary>
        public double? Latitude { get; set; }

        /// <summary>
        /// Elhelyezkedés
        /// </summary>
        public GeoJsonPoint<GeoJson2DGeographicCoordinates> Location { get; private set; }

        public void SetLocation(double? lon, double? lat) {
            if (lon == null || lat == null)
                throw new ArgumentException("arguments cannot be null");

            Location = new GeoJsonPoint<GeoJson2DGeographicCoordinates>(
                new GeoJson2DGeographicCoordinates((double)lon, (double)lat));
        }
    }
}
