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
    /// <summary>
    /// Felhasználó értékelések kezelése (CRUD)
    /// </summary>
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

        /// <summary>
        /// Egy adott felhasználóhoz tartozó összes értékelés lekérdezése
        /// </summary>
        /// <param name="username">Felhasználónév</param>
        /// <returns>A kért értékelések listája</returns>
        [Route("/api/[controller]/{username}")]
        [HttpGet]
        public ActionResult<List<Review>> GetbyUsername(string username) {
            return _reviewService.GetByUsername(username).Result;
        }

        /// <summary>
        /// Egy adott felhasználó értékelései számának lekérdezése
        /// </summary>
        /// <param name="username">Felhasználónév</param>
        /// <returns>Az értékelések száma</returns>
        [Route("/api/[controller]/{username}/count")]
        [HttpGet]
        public ActionResult<List<ReviewDTO>> GetCountbyUsername(string username) {
            return _reviewService.GetCountByUsername(username).Result;
        }

        /// <summary>
        /// Egy adott értékelés lekérdezése azonosító alapján
        /// </summary>
        /// <param name="id">Azonosító</param>
        /// <returns>A kért értékelés, 200 OK vagy 404 Not Found</returns>
        [HttpGet("{id:length(24)}")]
        public ActionResult<Review> GetById(string id) {
            var rev = _reviewService.Get(id).Result;

            if (rev == null) {
                return NotFound();
            }

            return rev;
        }

        /// <summary>
        /// Egy új értékelés hozzáadása
        /// </summary>
        /// <param name="rev">Értékelés JSON fájl</param>
        /// <returns>A hozzáadott értékelés azonosítóval ellátva</returns>
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

        /// <summary>
        /// Egy létező értékelés módosítása
        /// </summary>
        /// <param name="id">Azonosító</param>
        /// <param name="reviewIn">Módosított értékelés</param>
        /// <returns>204 No Content (siker esetén) vagy 401 Unauthorized</returns>
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

        /// <summary>
        /// Egy adott értékelés törlése
        /// </summary>
        /// <param name="id">Értékelés azonosíója</param>
        /// <returns>A törölt objektum</returns>
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