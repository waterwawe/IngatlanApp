using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static IngatlanApi.Models.Review;

namespace IngatlanApi.Models.DTO {
    public class ReviewDTO {

        public ReviewType Type { get; set; }

        public int Count { get; set; }

    }
}
