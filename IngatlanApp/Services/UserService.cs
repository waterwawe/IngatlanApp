using IngatlanApi.Models;
using IngatlanApi.Models.Identity;
using Microsoft.AspNetCore.Identity;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IngatlanApi.Services {
    public class UserService {
        private readonly IMongoCollection<ApplicationUser> _users;

        public UserService(IIngatlanDatabaseSettings settings) {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _users = database.GetCollection<ApplicationUser>(settings.UserCollectionName);
        }

        public List<ApplicationUser> Get() =>
            _users.Find(house => true).ToList();

    }
}
