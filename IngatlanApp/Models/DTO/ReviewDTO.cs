using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static IngatlanApi.Models.Review;

namespace IngatlanApi.Models.DTO {
    public class ReviewDTO {
        /// <summary>
        /// Értékelés típusa 0-Semleges 1-Pozitív 2-Negatív
        /// </summary>
        public ReviewType Type { get; set; }

        /// <summary>
        /// Értékelések száma
        /// </summary>
        public int Count { get; set; }

    }
}
