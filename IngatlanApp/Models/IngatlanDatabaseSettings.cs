using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IngatlanApi.Models {
    public class IngatlanDatabaseSettings : IIngatlanDatabaseSettings {
        public string IngatlanCollectionName { get; set; }
        public string UserCollectionName { get; set; }
        public string ReviewCollectionName { get; set; }
        public string ViewCollectionName { get; set; }
        public string MessageCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }

    public interface IIngatlanDatabaseSettings {
        string IngatlanCollectionName { get; set; }
        public string UserCollectionName { get; set; }
        public string ReviewCollectionName { get; set; }
        public string ViewCollectionName { get; set; }
        public string MessageCollectionName { get; set; }
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
    }
}
