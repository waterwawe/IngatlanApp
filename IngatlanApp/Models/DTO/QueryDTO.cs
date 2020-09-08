using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace IngatlanApi.Models.DTO {
    public class QueryDTO {

        public Address Address { get; set; }

        public double? PriceFrom { get; set; }
        
        public double? PriceTo { get; set; }

        public IngatlanType[] IngatlanType { get; set; }

        public string OwnerUsername { get; set; }

        public string[] DescriptionContains { get; set; }
    }
}
