using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AspNetCore.Identity.MongoDbCore.Models;

namespace IngatlanApi.Models.Identity {
    public class ApplicationUser: MongoIdentityUser<Guid> {

		public ApplicationUser() : base() {
		}

		public ApplicationUser(string userName, string email, string firstname, string lastname) : base(userName, email) {
			FirstName = firstname;
			LastName = lastname;
		}

		public string FirstName { get; set; }
		public string LastName { get; set; }
		
    }
}
