using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace IngatlanApi.Models {
    public class RegisterDTO {

        /// <summary>
        /// Email-cím
        /// </summary>
        [EmailAddress]
        [Required]
        public string Email { get; set; }

        /// <summary>
        /// Felhasználónév
        /// </summary>
        [Required]
        public string UserName { get; set; }
        /// <summary>
        /// Keresztnév
        /// </summary>
        [Required]
        public string FirstName {get; set;}
        /// <summary>
        /// Vezetéknév
        /// </summary>
        [Required]
        public string LastName { get; set; }
        /// <summary>
        /// Jelszó
        /// </summary>
        [Required]
        public string Password { get; set; }
        /// <summary>
        /// Jelszó megerősítése
        /// </summary>
        [Required]
        public string ConfirmPassword { get; set; }
    }
}
