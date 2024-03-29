﻿using IngatlanApi.Models;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IngatlanApi.Services {
    public class ViewService {
        private readonly IMongoCollection<View> _views;

        public ViewService(IIngatlanDatabaseSettings settings) {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _views = database.GetCollection<View>(settings.ViewCollectionName);
            _views.Indexes.CreateOne(Builders<View>.IndexKeys.Ascending(_ => _.EstateId));
        }

        public async Task<View> FindByIngatlanId(string id) {
            return await _views.Find(v => v.EstateId == id).SingleOrDefaultAsync();
        }

        public async Task<View> AddView(string ingatlanId) {
            var view = new View();
            view.EstateId = ingatlanId;
            view.ViewedByIpList = new List<string>();
            await _views.InsertOneAsync(view);
            return view;
        }

        public async Task<View> AddUser(string ingatlanId, string username) {
            var view = await FindByIngatlanId(ingatlanId);
            view.ViewedByIpList.Add(username);
            await _views.ReplaceOneAsync(v=> v.Id == view.Id,view);
            return view;
        }
    }
}
