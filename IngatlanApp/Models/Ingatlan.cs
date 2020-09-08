using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace IngatlanApi.Models {

    public enum IngatlanType {Undefined, DetachedHouse, SemiDeatchedHouse, Apartment, Penthouse, Farm}

    public class Ingatlan {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonRequired]
        public string Title { get; set; }

        [BsonRequired]
        public Address Address { get; set; }

        [BsonRequired]
        public double? Price { get; set; }

        [BsonRequired]
        public IngatlanType IngatlanType { get; set; }

        public string OwnerUsername { get; set; }

        public string NormalizedOwnerUsername { get; set; }

        public DateTime CreatedAt { get; set; }

        public List<string> Images{ get; set;}

        [BsonRequired]
        public string Description { get; set; }
    }
}
