using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IngatlanApi.Models;
using IngatlanApi.Models.DTO;
using IngatlanApi.Models.Identity;
using IngatlanApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace IngatlanApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly ReviewService _reviewService;
        private readonly UserManager<ApplicationUser> _userManager;

        public ReviewController(ReviewService reviewService, UserManager<ApplicationUser> userManager) {
            _reviewService = reviewService;
            _userManager = userManager;
        }

        [Route("/api/[controller]/{username}")]
        [HttpGet]
        public ActionResult<List<Review>> GetbyUsername(string username) {
            return _reviewService.GetByUsername(username).Result;
        }

        [Route("/api/[controller]/{username}/count")]
        [HttpGet]
        public ActionResult<List<ReviewDTO>> GetCountbyUsername(string username) {
            return _reviewService.GetCountByUsername(username).Result;
        }


        [HttpGet("{id:length(24)}")]
        public ActionResult<Review> GetById(string id) {
            var rev = _reviewService.Get(id).Result;

            if (rev == null) {
                return NotFound();
            }

            return rev;
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Review>> Create(Review rev) {
            var user = await _userManager.FindByNameAsync(rev.ToUserName);

            if (user == null)
                return BadRequest();

            rev.FromUserName = User.Identity.Name;

            if (rev.FromUserName == rev.ToUserName)
                return BadRequest();
            
            _reviewService.Create(rev);

            return rev;
        }

        [HttpPut("{id:length(24)}")]
        [Authorize]
        public IActionResult Update(string id, Review reviewIn) {
            var rev  = _reviewService.Get(id).Result;

            if (rev == null) {
                return NotFound();
            }
            if (id != reviewIn.Id || rev.ToUserName != reviewIn.ToUserName)
                return BadRequest();
            
            if (rev.FromUserName != User.Identity.Name) {
                return Unauthorized();
            }

            reviewIn.FromUserName = User.Identity.Name;

            _reviewService.Update(id, reviewIn);

            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        [Authorize]
        public ActionResult<Review> Delete(string id) {
            var rev = _reviewService.Get(id).Result;

            if (rev == null) {
                return NotFound();
            }

            if (rev.FromUserName != User.Identity.Name) {
                return Unauthorized();
            }

            _reviewService.Remove(rev.Id);

            return rev;
        }
    }
}