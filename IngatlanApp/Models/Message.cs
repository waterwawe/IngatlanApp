using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IngatlanApi.Models {
    public class Message {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonRequired]
        public string FromUsername { get; set; }

        [BsonRequired]
        public string ToUserName { get; set; }

        public bool IsSeen { get; set; }

        [BsonRequired]
        public string Text { get; set; }

        [BsonRequired]
        public DateTime TimeSent { get; set; }
    }
}
