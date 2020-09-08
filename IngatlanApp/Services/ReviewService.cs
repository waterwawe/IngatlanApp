using IngatlanApi.Models;
using IngatlanApi.Models.DTO;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IngatlanApi.Services {
    public class ReviewService {

        private readonly IMongoCollection<Review> _reviews;

        public ReviewService(IIngatlanDatabaseSettings settings) {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _reviews = database.GetCollection<Review>(settings.ReviewCollectionName);
        }

        public List<Review> Get() =>
            _reviews.Find(rev => true).ToList();

        public async Task<Review> Get(string id) =>
            await _reviews.Find<Review>(rev => rev.Id == id).FirstOrDefaultAsync();

        public async Task<List<Review>> GetByUsername(string toUserName) {
            return await _reviews.Find(r => r.ToUserName.ToLower() == toUserName.ToLower()).ToListAsync();
        }

        public async Task<List<ReviewDTO>> GetCountByUsername(string toUserName) {
            var revs =  await _reviews.Aggregate().Match(r=> r.ToUserName.ToLower() == toUserName.ToLower()).Group(g => g.Type, t => new {Type = t.Key, count = t.Count() }).ToListAsync();
            var returnList = new List<ReviewDTO>();

            foreach (var rev in revs) {
                returnList.Add(new ReviewDTO { Type = rev.Type, Count = rev.count });
            }

            return returnList;
        }

        public Review Create(Review rev) {
            _reviews.InsertOne(rev);
            return rev;
        }

        public void Update(string id, Review revIn) =>
            _reviews.ReplaceOne(rev => rev.Id == id, revIn);

        public void Remove(Review revIn) =>
            _reviews.DeleteOne(rev => rev.Id == revIn.Id);

        public void Remove(string id) =>
            _reviews.DeleteOne(rev => rev.Id == id);
    }
}
