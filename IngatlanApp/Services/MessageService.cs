using IngatlanApi.Models;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IngatlanApi.Services {
    public class MessageService {

        private readonly IMongoCollection<Message> _messages;

        public MessageService(IIngatlanDatabaseSettings settings) {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _messages = database.GetCollection<Message>(settings.MessageCollectionName);
            _messages.Indexes.CreateOne(Builders<Message>.IndexKeys.Ascending(_ => _.ToUserName));
        }

        public async Task<Message> FindById(string id) {
            return await _messages.Find(m => m.Id == id).SingleOrDefaultAsync();
        }

        public IEnumerable<object> FindUsers(string username) {
            var aggregateFromUser = _messages
                .AsQueryable()
                .Where(m => m.FromUsername == username)
                .GroupBy(g => g.ToUserName)
                .Select(n => new { 
                    value = n.Key
                });

            var fromList = aggregateFromUser.ToList();

            var aggregateToUser = _messages
               .AsQueryable()
               .Where(m => m.ToUserName == username)
               .GroupBy(g => g.FromUsername)
               .Select(n => new {
                   value = n.Key,
               });

            var toList = aggregateToUser.ToList();

            foreach(var message in fromList) {
                if (!toList.Contains(message))
                    toList.Add(message);
            }

            return toList;
        }

        public async Task<List<Message>> FindAllByUsername(string fromUsername,string toUsername) {
            var fromFilter = Builders<Message>.Filter.Eq(m => m.FromUsername, fromUsername);
            var toFilter = Builders<Message>.Filter.Eq(m => m.ToUserName, toUsername);
            var combinedFilter = Builders<Message>.Filter.And(fromFilter, toFilter);

            return await _messages.Find(combinedFilter).ToListAsync();
        }

        public async Task<List<Message>> FindUnSeenByUsername(string fromUsername,string toUsername){
            var fromFilter = Builders<Message>.Filter.Eq(m => m.FromUsername, fromUsername);
            var toFilter = Builders<Message>.Filter.Eq(m => m.ToUserName, toUsername);
            var combinedFilter = Builders<Message>.Filter.And(fromFilter, toFilter);
            var seenFilter = Builders<Message>.Filter.Eq(m => m.IsSeen, false);
            combinedFilter = Builders<Message>.Filter.And(combinedFilter, seenFilter);

            return await _messages.Find(combinedFilter).ToListAsync();
        }

        public async Task<Message> AddMessage(string from, string to, string text) {
            var message = new Message {
                FromUsername = from,
                Text = text,
                ToUserName = to,
                IsSeen = false,
                TimeSent = DateTime.Now
            };

            await _messages.InsertOneAsync(message);

            return message;
        }

        public async Task<Message> SetSeen(string id) {
            var message = FindById(id).Result;

            message.IsSeen = true;

            await _messages.ReplaceOneAsync(m => m.Id == message.Id, message);

            return message;
        }
    }
}
