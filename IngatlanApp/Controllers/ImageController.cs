using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

namespace IngatlanApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private readonly IHostEnvironment _environment;

        public ImageController(IHostEnvironment env) {
            _environment = env;
        }

        [HttpGet("{name}", Name = "Get")]
        public IActionResult Get(string name) {
            var imagePath = @"\Upload\Images\";
            var uploadPath = _environment.ContentRootPath + imagePath;
            var fullPath = uploadPath + name;
            try {
                var fileStream = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read);
                return File(fileStream, "image/jpeg");
            }catch (Exception) {
                return NotFound("File not available");
            }
        }
    }
}
