using IngatlanApi.Models;
using IngatlanApi.Models.DTO;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.GeoJsonObjectModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

namespace IngatlanApi.Services {
    public class IngatlanService {

        private readonly IMongoCollection<Estate> _ingatlanok;

        public IngatlanService(IIngatlanDatabaseSettings settings) {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _ingatlanok = database.GetCollection<Estate>(settings.IngatlanCollectionName);
        }

        public async Task<List<Estate>> Get() =>
            await _ingatlanok.Find(house => true).ToListAsync();

        public async Task<Estate> Get(string id) =>
            await _ingatlanok.Find<Estate>(house => house.Id == id).FirstOrDefaultAsync();

        public async Task<List<Estate>> Get(QueryDTO queryDTO) {

            FilterDefinition<Estate> cityfilter;
            FilterDefinition<Estate> streetfilter;
            FilterDefinition<Estate> districtfilter;
            FilterDefinition<Estate> typefilter;
            FilterDefinition<Estate> priceFromfilter;
            FilterDefinition<Estate> priceTofilter;
            FilterDefinition<Estate> ownerfilter;
            FilterDefinition<Estate> descriptionfilter;
            FilterDefinition<Estate> combinefilter = Builders<Estate>.Filter.Empty;

            if (queryDTO.Address != null) {
                if (queryDTO.Address.City != null) {
                    cityfilter = Builders<Estate>.Filter.Eq(x => x.Address.City, queryDTO.Address.City.ToLower());
                    combinefilter = Builders<Estate>.Filter.And(combinefilter, cityfilter);
                }
                if (queryDTO.Address.StreetName != null) {
                    streetfilter = Builders<Estate>.Filter.Eq(x => x.Address.StreetName, queryDTO.Address.StreetName.ToLower());
                    combinefilter = Builders<Estate>.Filter.And(combinefilter, streetfilter);
                }

                if (queryDTO.Address.District != 0) {
                    districtfilter = Builders<Estate>.Filter.Eq(x => x.Address.District, queryDTO.Address.District);
                    combinefilter = Builders<Estate>.Filter.And(combinefilter, districtfilter);
                }
            }

            if (queryDTO.IngatlanType.Length > 0) {
                typefilter = Builders<Estate>.Filter.In(x => x.IngatlanType, queryDTO.IngatlanType);
                combinefilter = Builders<Estate>.Filter.And(combinefilter, typefilter);
            }

            if (queryDTO.PriceFrom > 0) {
                priceFromfilter = Builders<Estate>.Filter.Gt(x => x.Price, queryDTO.PriceFrom);
                combinefilter = Builders<Estate>.Filter.And(combinefilter, priceFromfilter);
            }

            if (queryDTO.PriceTo > 0) {
                priceTofilter = Builders<Estate>.Filter.Lt(x => x.Price, queryDTO.PriceTo);
                combinefilter = Builders<Estate>.Filter.And(combinefilter, priceTofilter);
            }

            if (queryDTO.OwnerUsername != null) {
                ownerfilter = Builders<Estate>.Filter.Eq(x => x.NormalizedOwnerUsername, queryDTO.OwnerUsername.ToLower());
                combinefilter = Builders<Estate>.Filter.And(combinefilter, ownerfilter);
            }

            if (queryDTO.AdvertisementType != 0) {
                ownerfilter = Builders<Estate>.Filter.Eq(x => x.AdvertisementType, queryDTO.AdvertisementType);
                combinefilter = Builders<Estate>.Filter.And(combinefilter, ownerfilter);
            }


            if (queryDTO.DescriptionContains != null) {
                descriptionfilter = Builders<Estate>.Filter.Empty;
                foreach (var item in queryDTO.DescriptionContains) {
                    var regex = new BsonRegularExpression("/." + item + ".*/i");
                    var temp = Builders<Estate>.Filter.Regex(x => x.Description, regex);
                    descriptionfilter = Builders<Estate>.Filter.And(descriptionfilter, temp);
                }
                combinefilter = Builders<Estate>.Filter.And(combinefilter, descriptionfilter);
            }

            var ingatlans = await _ingatlanok.Find(combinefilter).ToListAsync();

            foreach (var ingatlan in ingatlans) {
                var span = ingatlan.HighlightedUntil - DateTime.Now;
                if (span.TotalSeconds <= 0) {
                    ingatlan.IsHighlighted = false;
                } else {
                    ingatlan.IsHighlighted = true;
                }
            }

            return ingatlans;
        }

        public async Task<List<Estate>> GetByLocation(double longitude, double latitude, double distance) {
            return await _ingatlanok.Find(i => i.Address.Latitude >= latitude - distance &&
            i.Address.Latitude <= latitude + distance &&
            i.Address.Longitude >= longitude - distance && i.Address.Longitude <= longitude + distance)
                .ToListAsync();
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

        public Estate Create(Estate house) {
            _ingatlanok.InsertOne(house);
            return house;
        }

        public void Update(string id, Estate houseIn) =>
            _ingatlanok.ReplaceOne(house => house.Id == id, houseIn);

        public void Remove(Estate houseIn) =>
            _ingatlanok.DeleteOne(house => house.Id == houseIn.Id);

        public void Remove(string id) =>
            _ingatlanok.DeleteOne(house => house.Id == id);
    }
}
