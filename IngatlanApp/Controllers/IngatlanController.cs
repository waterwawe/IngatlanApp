using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using IngatlanApi.Models;
using IngatlanApi.Models.DTO;
using IngatlanApi.Services;
using IngatlanApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using MongoDB.Driver;

namespace IngatlanApi.Controllers {
    /// <summary>
    /// Ingatlonok kezelése (CRUD)
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class IngatlanController : ControllerBase {

        private readonly IHostEnvironment _environment;
        private readonly IngatlanService _ingatlanService;
        private readonly UserService userService;
        private readonly ViewService _viewService;
        private IHttpContextAccessor _accessor;

        public IngatlanController(IHostEnvironment env, IngatlanService ingatlanService, UserService userService, ViewService viewService, IHttpContextAccessor accessor) {
            _ingatlanService = ingatlanService;
            this.userService = userService;
            _environment = env;
            _viewService = viewService;
            _accessor = accessor;
        }

        /// <summary>
        /// Ingatlanok lekérdezésére szolgál, a megadott szűrők alapján. Ha egy paramtér null, akkor nem történik szűrés az adott paraméter alapján.
        /// </summary>
        /// <param name="priceFrom">Ennél az értéknél olcsóbb ingatlanok szűrve lesznek.</param>
        /// <param name="priceTo">Ennél az értéknél drágább ingatlanok szűrve lesznek.</param>
        /// <param name="ingatlanType">Adott típusú ingatlanok listázása, több is megadható tömbként</param>
        /// <param name="city">Csak egy bizonyos városban lévő ingatlanok listázása</param>
        /// <param name="advertisementType">Ingatlan hirdetés típusa</param>
        /// <param name="district">Csak egy bizonyos kerületben lévő ingatlanok listázása</param>
        /// <param name="streetname">Csak egy bizonyos utcában lévő ingatlanok listázása</param>
        /// <param name="owner">Csak egy hirdető által feladott ingatlanok listázása</param>
        /// <param name="descriptioncontains">Szerepeljen a megadott szöveg a leírásban</param>
        /// <returns>Keresési feltételeknek megfelő ingatlanok listája</returns>
        [Route("/api/[controller]")]
        [HttpGet]
        public ActionResult<List<Ingatlan>> Get(
            [FromQuery] double priceFrom,
            [FromQuery] double priceTo,
            [FromQuery] IngatlanType[] ingatlanType,
            [FromQuery] string city,
            [FromQuery] int district,
            [FromQuery] AdvertisementType advertisementType,
            [FromQuery] string streetname,
            [FromQuery] string owner,
            [FromQuery] string[] descriptioncontains) {
            var queryDTO = new QueryDTO {
                Address = new Address {
                    City = city,
                    StreetName = streetname,
                    District = district
                },
                IngatlanType = ingatlanType,
                AdvertisementType = advertisementType,
                PriceFrom = priceFrom,
                PriceTo = priceTo,
                DescriptionContains = descriptioncontains,
                OwnerUsername = owner
            };

            return Ok(_ingatlanService.Get(queryDTO).Result);
        }

        /// <summary>
        /// Városok listájának lekérdezése
        /// </summary>
        /// <returns>Városok listája</returns>
        [Route("/api/[controller]/cities")]
        [HttpGet]
        public ActionResult<List<string>> GetAddresses() {
            return Ok(_ingatlanService.GetCites());
        }

        /// <summary>
        /// Kerületek listájának lekérdezése
        /// </summary>
        /// <returns>Kerületek listájának lekérdezése</returns>
        [Route("/api/[controller]/districts")]
        [HttpGet]
        public ActionResult<List<int>> GetDistricts() {
            return Ok(_ingatlanService.GetDistricts());
        }

        /// <summary>
        /// Képek feltöltése egy ingatlan hirdetéshez.
        /// </summary>
        /// <param name="id">Az ingatlan azonosítója</param>
        /// <param name="file">A kép fájl</param>
        /// <returns>Az ingatlan a feltöltött képpel hivatkozva</returns>
        [Authorize]
        [HttpPost("{id:length(24)}")]
        public async Task<ActionResult<string>> Upload(string id, IFormFile file) {
            var ingatlan = _ingatlanService.Get(id).Result;

            if (ingatlan == null) {
                return NotFound();
            }

            if (ingatlan.OwnerUsername != User.Identity.Name) {
                Unauthorized();
            }

            if (file == null)
                return BadRequest();

            var imagePath = @"\Upload\Images\";
            var uploadPath = _environment.ContentRootPath + imagePath;

            if (!Directory.Exists(uploadPath)) {
                Directory.CreateDirectory(uploadPath);
            }

            var uniqName = Guid.NewGuid().ToString();
            var fileName = Path.GetFileName(uniqName + "." + file.FileName.Split(".")[1].ToLower());
            string fullPath = uploadPath + fileName;

            var filePath = @"." + Path.Combine(imagePath, fileName);

            using (var fileStream = new FileStream(fullPath, FileMode.Create)) {
                await file.CopyToAsync(fileStream);
            }

            if (ingatlan.Images == null)
                ingatlan.Images = new List<string>();

            ingatlan.Images.Add(fileName);
            _ingatlanService.Update(ingatlan.Id, ingatlan);

            return Ok(ingatlan);
        }

        /// <summary>
        /// Egy adott kép törlése az ingatlan hirdetéséből
        /// </summary>
        /// <param name="id">Az ingatlan azonosítója</param>
        /// <param name="name">A kép fájl neve</param>
        /// <returns>Ha sikeres a törlés 200 OK, ha nem található a kép, vagy az ingatlan akkor 404.</returns>
        [Route("/api/[controller]/image")]
        [Authorize]
        [HttpDelete]
        public IActionResult DeleteImage([FromQuery] string id, [FromQuery] string name) {
            var ingatlan = _ingatlanService.Get(id).Result;

            if (ingatlan == null)
                NotFound();
            if (ingatlan.OwnerUsername != User.Identity.Name)
                Unauthorized();

            if (ingatlan.Images.Remove(name)) {
                _ingatlanService.Update(ingatlan.Id, ingatlan);

                var imagePath = @"\Upload\Images\";
                var uploadPath = _environment.ContentRootPath + imagePath;
                var fullPath = uploadPath + name;

                FileInfo file = new FileInfo(fullPath);
                file.Delete();

                return Ok();
            }

            return NotFound("Image not found");
        }

        [HttpGet("{id:length(24)}/highlight")]
        public async Task<ActionResult<Ingatlan>> Get(string id, [FromQuery] HighlightType highlightType) {
            var ingatlan = _ingatlanService.Get(id).Result;

            if (ingatlan == null) {
                return NotFound();
            }

            if(ingatlan.OwnerUsername.ToLowerInvariant() != User.Identity.Name.ToLowerInvariant()) {
                return Unauthorized();
            }

            int daysToAdd;
            int creditsToRemove;

            if (highlightType == HighlightType.Day) {
                daysToAdd = 1;
                creditsToRemove = 25;
            } else if (highlightType == HighlightType.Month) {
                daysToAdd = 7;
                creditsToRemove = 100;
            } else {
                daysToAdd = 31;
                creditsToRemove = 300;
            }

            try { 
            await userService.RemoveCredits(User.Identity.Name, creditsToRemove);
            } catch(ArgumentException e) {
                return Forbid(e.Message);
            }

            ingatlan.HighlightedUntil = DateTime.Now.AddDays(daysToAdd);

            return ingatlan;
        }

        /// <summary>
        /// Ingatlan lekérdezése azonosító alapján
        /// </summary>
        /// <param name="id">Az ingatlan azonosítója (24 karakter)</param>
        /// <returns>A kért ingatlan (200 OK) vagy 404 (Not Found)</returns>
        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<Ingatlan>> Get(string id) {
            var ingatlan = _ingatlanService.Get(id).Result;

            if (ingatlan == null) {
                return NotFound();
            }

            var view = _viewService.FindByIngatlanId(ingatlan.Id).Result;

            if (view == null)
                view = _viewService.AddView(ingatlan.Id).Result;

            if (!view.ViewedByUsernameList.Contains(_accessor.HttpContext.Connection.RemoteIpAddress.ToString()))
                await _viewService.AddUser(ingatlan.Id, _accessor.HttpContext.Connection.RemoteIpAddress.ToString());

            return ingatlan;
        }

        /// <summary>
        /// Az ingatlan megtekintések számának lekérdezése
        /// </summary>
        /// <param name="id">Az ingatlan azonosítója</param>
        /// <returns>200 OK - Az ingatlan megetkintéseinek száma, 400 Not Found vagy 401 Unauthorized</returns>
        [Route("/api/[controller]/viewcount")]
        [Authorize]
        [HttpGet]
        public IActionResult GetViewCount([FromQuery] string id) {
            var ingatlan = _ingatlanService.Get(id).Result;

            if (ingatlan == null) {
                return NotFound();
            }

            if (ingatlan.OwnerUsername.ToLowerInvariant() != User.Identity.Name.ToLowerInvariant())
                return Unauthorized("");

            var viewList = _viewService.FindByIngatlanId(ingatlan.Id).Result;
            if (viewList == null)
                return Ok(new { views = 0 });

            return Ok(new { views = viewList.ViewedByUsernameList.Count });
        }

        /// <summary>
        /// Új ingatlan hozzáadása
        /// </summary>
        /// <param name="ingatlan">Az ingatlan JSON objektum</param>
        /// <returns>A létrehozott ingatlan azonosítóval</returns>
        [HttpPost]
        [Authorize]
        public ActionResult<Ingatlan> Create(Ingatlan ingatlan) {
            ingatlan.OwnerUsername = User.Identity.Name;
            ingatlan.NormalizedOwnerUsername = User.Identity.Name.ToLower();

            ingatlan.Address.City = ingatlan.Address.City.ToLower();
            if (ingatlan.Address.StreetName != null)
                ingatlan.Address.StreetName = ingatlan.Address.StreetName.ToLower();

            ingatlan.CreatedAt = DateTime.Now;

            _ingatlanService.Create(ingatlan);

            return ingatlan;
        }

        /// <summary>
        /// Már létező ingatlan szerkesztése, felülírása
        /// </summary>
        /// <param name="id">Az ingatlan azonosítója</param>
        /// <param name="ingatlanIn">A módosított ingatlan (azonosító nem módosítható)</param>
        /// <returns>204 No content</returns>
        [HttpPut("{id:length(24)}")]
        [Authorize]
        public IActionResult Update(string id, Ingatlan ingatlanIn) {
            var ingatlan = _ingatlanService.Get(id).Result;

            if (id != ingatlanIn.Id)
                return BadRequest();

            if (ingatlan == null) {
                return NotFound();
            }
            if (ingatlan.OwnerUsername != User.Identity.Name) {
                return Unauthorized();
            }

            ingatlanIn.Address.City = ingatlan.Address.City.ToLower();
            if (ingatlanIn.Address.StreetName != null)
                ingatlanIn.Address.StreetName = ingatlanIn.Address.StreetName.ToLower();

            if (ingatlanIn.Address.Latitude != null && ingatlanIn.Address.Longitude != null)
                ingatlanIn.Address.SetLocation(ingatlanIn.Address.Longitude, ingatlanIn.Address.Latitude);

            ingatlanIn.OwnerUsername = ingatlan.OwnerUsername;
            ingatlanIn.NormalizedOwnerUsername = ingatlan.OwnerUsername.ToLower();

            ingatlanIn.CreatedAt = ingatlan.CreatedAt;

            _ingatlanService.Update(id, ingatlanIn);

            return NoContent();
        }

        /// <summary>
        /// Ingatlan törlése
        /// </summary>
        /// <param name="id">Az ingatlan azonosítója</param>
        /// <returns>A törölt ingatlan 200 OK, 404 Not found, vagy 401 Unathorized</returns>
        [HttpDelete("{id:length(24)}")]
        [Authorize]
        public ActionResult<Ingatlan> Delete(string id) {
            var ingatlan = _ingatlanService.Get(id).Result;

            if (ingatlan == null) {
                return NotFound();
            }

            if (ingatlan.OwnerUsername != User.Identity.Name) {
                return Unauthorized();
            }

            _ingatlanService.Remove(ingatlan.Id);

            return ingatlan;
        }

    }
}