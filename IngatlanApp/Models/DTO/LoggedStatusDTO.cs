using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IngatlanApi.Models.DTO {
    public class LoggedStatusDTO {
        public bool IsLoggedIn { get; set; }
        public string UserName { get; set; }
    }
}
