using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace IngatlanApi.Models.DTO {
    public class QueryDTO {
        /// <summary>
        /// Címre szűrés
        /// </summary>
        public Address Address { get; set; }

        /// <summary>
        /// Hirdetés típusa
        /// </summary>
        public AdvertisementType AdvertisementType { get; set; }

        /// <summary>
        /// Ennél olcsóbb ingatlanok szűrve lesznek
        /// </summary>
        public double? PriceFrom { get; set; }
        
        /// <summary>
        /// Ennél drágább ingatlanok szűrve lesznek
        /// </summary>
        public double? PriceTo { get; set; }

        /// <summary>
        /// Szűrés ingatlan típusra, több is szerepelhet
        /// </summary>
        public IngatlanType[] EstateType { get; set; }

        /// <summary>
        /// Szűrés egy adott hirdető ingatlanjaira
        /// </summary>
        public string OwnerUsername { get; set; }

        /// <summary>
        /// Szűrés a leírás tartalmára
        /// </summary>
        public string[] DescriptionContains { get; set; }
    }
}
