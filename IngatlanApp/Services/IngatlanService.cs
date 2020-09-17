using IngatlanApi.Models;
using IngatlanApi.Models.DTO;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IngatlanApi.Services {
    public class IngatlanService {

        private readonly IMongoCollection<Ingatlan> _ingatlanok;

        public IngatlanService(IIngatlanDatabaseSettings settings) {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _ingatlanok = database.GetCollection<Ingatlan>(settings.IngatlanCollectionName);
        }

        public async Task<List<Ingatlan>> Get() =>
            await _ingatlanok.Find(house => true).ToListAsync();

        public async Task<Ingatlan> Get(string id) =>
            await _ingatlanok.Find<Ingatlan>(house => house.Id == id).FirstOrDefaultAsync();

        public async Task<List<Ingatlan>> Get(QueryDTO queryDTO) {

            FilterDefinition<Ingatlan> cityfilter;
            FilterDefinition<Ingatlan> streetfilter;
            FilterDefinition<Ingatlan> districtfilter;
            FilterDefinition<Ingatlan> typefilter;
            FilterDefinition<Ingatlan> priceFromfilter;
            FilterDefinition<Ingatlan> priceTofilter;
            FilterDefinition<Ingatlan> ownerfilter;
            FilterDefinition<Ingatlan> descriptionfilter;
            FilterDefinition<Ingatlan> combinefilter = Builders<Ingatlan>.Filter.Empty;

            if (queryDTO.Address != null) {
                if (queryDTO.Address.City != null) {
                    cityfilter = Builders<Ingatlan>.Filter.Eq(x => x.Address.City, queryDTO.Address.City.ToLower());
                    combinefilter = Builders<Ingatlan>.Filter.And(combinefilter, cityfilter);
                }
                if (queryDTO.Address.StreetName != null) {
                    streetfilter = Builders<Ingatlan>.Filter.Eq(x => x.Address.StreetName, queryDTO.Address.StreetName.ToLower());
                    combinefilter = Builders<Ingatlan>.Filter.And(combinefilter, streetfilter);
                }

                if (queryDTO.Address.District != 0) {
                    districtfilter = Builders<Ingatlan>.Filter.Eq(x => x.Address.District, queryDTO.Address.District);
                    combinefilter = Builders<Ingatlan>.Filter.And(combinefilter, districtfilter);
                }
            }

            if (queryDTO.IngatlanType.Length > 0) {
                typefilter = Builders<Ingatlan>.Filter.In(x => x.IngatlanType, queryDTO.IngatlanType);
                combinefilter = Builders<Ingatlan>.Filter.And(combinefilter, typefilter);
            }

            if (queryDTO.PriceFrom > 0) {
                priceFromfilter = Builders<Ingatlan>.Filter.Gt(x => x.Price, queryDTO.PriceFrom);
                combinefilter = Builders<Ingatlan>.Filter.And(combinefilter, priceFromfilter);
            }

            if (queryDTO.PriceTo > 0) {
                priceTofilter = Builders<Ingatlan>.Filter.Lt(x => x.Price, queryDTO.PriceTo);
                combinefilter = Builders<Ingatlan>.Filter.And(combinefilter, priceTofilter);
            }

            if (queryDTO.OwnerUsername != null) {
                ownerfilter = Builders<Ingatlan>.Filter.Eq(x => x.NormalizedOwnerUsername, queryDTO.OwnerUsername.ToLower());
                combinefilter = Builders<Ingatlan>.Filter.And(combinefilter, ownerfilter);
            }

            if (queryDTO.AdvertisementType != 0)
            {
                ownerfilter = Builders<Ingatlan>.Filter.Eq(x => x.AdvertisementType, queryDTO.AdvertisementType);
                combinefilter = Builders<Ingatlan>.Filter.And(combinefilter, ownerfilter);
            }


            if (queryDTO.DescriptionContains != null) {
                descriptionfilter = Builders<Ingatlan>.Filter.Empty;
                foreach (var item in queryDTO.DescriptionContains) {
                    var regex = new BsonRegularExpression("/." + item + ".*/i");
                    var temp = Builders<Ingatlan>.Filter.Regex(x => x.Description, regex);
                    descriptionfilter = Builders<Ingatlan>.Filter.And(descriptionfilter, temp);
                }
                combinefilter = Builders<Ingatlan>.Filter.And(combinefilter, descriptionfilter);
            }

            return await _ingatlanok.Find(combinefilter).ToListAsync();

        }

        public List<string> GetCites() {
            var addrobjects = _ingatlanok.Aggregate().Group(g => g.Address.City, t => new { City = t.Key }).ToList();
            var returnlist = new List<string>();

            foreach (var address in addrobjects) {
                returnlist.Add(address.City.ToLower());
            }
            return returnlist;
        }

        public List<int> GetDistricts() {
            var addrobjects = _ingatlanok.Aggregate().Group(g => g.Address.District, t => new { District = t.Key }).ToList();
            var returnlist = new List<int>();

            foreach (var address in addrobjects) {
                returnlist.Add(address.District);
            }
            return returnlist;
        }

        public Ingatlan Create(Ingatlan house) {
            _ingatlanok.InsertOne(house);
            return house;
        }

        public void Update(string id, Ingatlan houseIn) =>
            _ingatlanok.ReplaceOne(house => house.Id == id, houseIn);

        public void Remove(Ingatlan houseIn) =>
            _ingatlanok.DeleteOne(house => house.Id == houseIn.Id);

        public void Remove(string id) =>
            _ingatlanok.DeleteOne(house => house.Id == id);
    }
}
