using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using IngatlanApi.Models;
using IngatlanApi.Models.DTO;
using IngatlanApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using MongoDB.Driver;

namespace IngatlanApi.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class IngatlanController : ControllerBase {

        private readonly IHostEnvironment _environment;
        private readonly IngatlanService _ingatlanService;
        private readonly ViewService _viewService;
        private IHttpContextAccessor _accessor;

        public IngatlanController(IHostEnvironment env,IngatlanService ingatlanService, ViewService viewService, IHttpContextAccessor accessor) {
            _ingatlanService = ingatlanService;
            _environment = env;
            _viewService = viewService;
            _accessor = accessor;
        }

        [Route("/api/[controller]")]
        [HttpGet]
        public ActionResult<List<Ingatlan>> Get(
            [FromQuery]double priceFrom, 
            [FromQuery]double priceTo, 
            [FromQuery]IngatlanType[] ingatlanType, 
            [FromQuery]string city,
            [FromQuery]int district,
            [FromQuery]string streetname, 
            [FromQuery] string owner,
            [FromQuery] string[] descriptioncontains) {
            var queryDTO = new QueryDTO {
                Address = new Address {
                    City = city,
                    StreetName = streetname,
                    District = district
                },
                IngatlanType = ingatlanType,
                PriceFrom = priceFrom,
                PriceTo = priceTo,
                DescriptionContains = descriptioncontains,
                OwnerUsername = owner
            };

            return Ok(_ingatlanService.Get(queryDTO).Result);
        }

        [Route("/api/[controller]/cities")]
        [HttpGet]
        public ActionResult<List<string>> GetAddresses() {
            return Ok(_ingatlanService.GetCites());
        }

        [Route("/api/[controller]/districts")]
        [HttpGet]
        public ActionResult<List<int>> GetDistricts() {
            return Ok(_ingatlanService.GetDistricts());
        }

        [Authorize]
        [HttpPost("{id:length(24)}")]
        public async Task<ActionResult<string>> Upload(string id,IFormFile file) {
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

        [Route("/api/[controller]/image")]
        [Authorize]
        [HttpDelete]
        public IActionResult DeleteImage([FromQuery]string id, [FromQuery]string name) { 
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

        [Route("/api/[controller]/viewcount")]
        [Authorize]
        [HttpGet]
        public IActionResult GetViewCount([FromQuery] string id) {
            var ingatlan = _ingatlanService.Get(id).Result;

            if(ingatlan == null) {
                return NotFound();
            }

            if (ingatlan.OwnerUsername.ToLowerInvariant() != User.Identity.Name.ToLowerInvariant())
                return Unauthorized("");

            var viewList = _viewService.FindByIngatlanId(ingatlan.Id).Result;
            if (viewList == null)
                return Ok(new { views = 0 });

            return Ok(new { views = viewList.ViewedByUsernameList.Count });
        }

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

        [HttpPut("{id:length(24)}")]
        [Authorize]
        public IActionResult Update(string id, Ingatlan ingatlanIn) {
            var ingatlan = _ingatlanService.Get(id).Result;

            if (id != ingatlanIn.Id)
                return BadRequest();

            if (ingatlan == null) {
                return NotFound();
            }
            if(ingatlan.OwnerUsername != User.Identity.Name) {
                return Unauthorized();
            }

            ingatlanIn.Address.City = ingatlan.Address.City.ToLower();
            if (ingatlanIn.Address.StreetName != null)
                ingatlanIn.Address.StreetName = ingatlanIn.Address.StreetName.ToLower();

            if(ingatlanIn.Address.Latitude != null && ingatlanIn.Address.Longitude != null)
                ingatlanIn.Address.SetLocation(ingatlanIn.Address.Longitude, ingatlanIn.Address.Latitude);

            ingatlanIn.OwnerUsername = ingatlan.OwnerUsername;
            ingatlanIn.NormalizedOwnerUsername = ingatlan.OwnerUsername.ToLower();

            ingatlanIn.CreatedAt = ingatlan.CreatedAt;

            _ingatlanService.Update(id, ingatlanIn);

            return NoContent();
        }

        [Route("api/[controller]/{id:length(24)}")]
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