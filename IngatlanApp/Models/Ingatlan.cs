using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace IngatlanApi.Models {

    /// <summary>
    /// Ingatlan típusa 0-Ismeretlen 1-Családi ház 2-Ikerház, 3-Lakás, 4-Penthouse, 5-Farm
    /// </summary>
    public enum IngatlanType {Undefined, DetachedHouse, SemiDeatchedHouse, Apartment, Penthouse, Farm}

    /// <summary>
    /// Hirdetés típusa 0-Ismeretlen 1-Eladó 2-Kiadó 3-Rövidtávon kiadó
    /// </summary>
    public enum AdvertisementType { Undefined, Sale, Rent, Rbnb}

    public class Ingatlan {

        /// <summary>
        /// Ingatlan azonosítója
        /// </summary>
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        /// <summary>
        /// Hirdetés címe
        /// </summary>
        [BsonRequired]
        public string Title { get; set; }

        /// <summary>
        /// Hirdetés típusa
        /// </summary>
        [BsonRequired]
        public AdvertisementType AdvertisementType { get; set; }

        /// <summary>
        /// Ingatlan (földrajzi) címe
        /// </summary>
        [BsonRequired]
        public Address Address { get; set; }


        /// <summary>
        /// Ingatlan ára
        /// </summary>
        [BsonRequired]
        public double? Price { get; set; }

        /// <summary>
        /// Ingatlan típusa 1-Családi ház 2-Ikerház 3-Lakás 4-Penthouse 5-Farm
        /// </summary>
        [BsonRequired]
        public IngatlanType IngatlanType { get; set; }

        /// <summary>
        /// Hirdető felhasználóneve
        /// </summary>
        public string OwnerUsername { get; set; }

        /// <summary>
        /// Hirdető felhasználóneve kisbetűvel
        /// </summary>
        public string NormalizedOwnerUsername { get; set; }

        /// <summary>
        /// Létrehozás dátuma
        /// </summary>
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// Képek listája (csak a képek fájlnevei)
        /// </summary>
        public List<string> Images{ get; set;}

        /// <summary>
        /// Hirdetés leírása
        /// </summary>
        [BsonRequired]
        public string Description { get; set; }
    }
}
