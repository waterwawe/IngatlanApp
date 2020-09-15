using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IngatlanApi.Models.DTO {
    public class LoggedStatusDTO {
        /// <summary>
        /// Be van-e jelentkezve vagy nincs (bool)
        /// </summary>
        public bool IsLoggedIn { get; set; }
        /// <summary>
        /// Felhasználónév
        /// </summary>
        public string UserName { get; set; }
    }
}
