using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AspNetCore.Identity.MongoDbCore.Models;

namespace IngatlanApi.Models.Identity {
    public class ApplicationUser: MongoIdentityUser<Guid> {

		public ApplicationUser() : base() {
		}

		public ApplicationUser(string userName, string email, string firstname, string lastname, int credits) : base(userName, email) {
			FirstName = firstname;
			LastName = lastname;
			Credits = credits;
		}

		public string FirstName { get; set; }
		public string LastName { get; set; }

		public int Credits { get; set; }
		
    }
}
