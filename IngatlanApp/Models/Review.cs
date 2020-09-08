using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IngatlanApi.Models {
    public class Review {

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public enum ReviewType { neutral, positive, negative };

        [BsonRequired]
        public string ToUserName { get; set; }

        [BsonRequired]
        public string FromUserName { get; set; }

        public ReviewType Type { get; set; }

        public string Comment { get; set; }
    }
}
