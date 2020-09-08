using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IngatlanApi.Models;
using IngatlanApi.Models.DTO;
using IngatlanApi.Models.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace IngatlanApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase {

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;

        public AccountController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signManager) {
            _userManager = userManager;
            _signInManager = signManager;
        }

        [Route("/[controller]/login")]
        [HttpPost]
        public async Task<IActionResult> SignIn(LoginDTO user) {
            var login = await _userManager.FindByEmailAsync(user.Email);
            Microsoft.AspNetCore.Identity.SignInResult result;
            
            if (login != null)
               result = await _signInManager.PasswordSignInAsync(login.UserName, user.Password, user.Remember, false);
            else
                return BadRequest();

            if (result.Succeeded)
                return Ok();
            else
                return BadRequest();
        }

        [Route("/[controller]/isloggedin")]
        [HttpGet]
        public ActionResult<LoggedStatusDTO> GetLoggedIn() {
            LoggedStatusDTO status = new LoggedStatusDTO();
            status.IsLoggedIn = User.Identity.IsAuthenticated;
            if (status.IsLoggedIn)
                status.UserName = User.Identity.Name;
            return Ok(status);
        }

        [Route("/[controller]/logout")]
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> SignOut() {
            await _signInManager.SignOutAsync();
            return Ok();
        }

        [Route("/[controller]/profile")]
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<ApplicationUser>> GetProfile() {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            var dto = new {
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserName = user.UserName
            };

            return Ok(dto);
        }

        [Route("/[controller]/profile/{username}")]
        [HttpGet]
        public async Task<ActionResult<ApplicationUser>> GetProfile(string username) {
            var user = await _userManager.FindByNameAsync(username);
            if (user != null) {
                var dto = new {
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    UserName = user.UserName
                };
                return Ok(dto);
            }
            else
                return NotFound();
        }

        [Route("/[controller]/register")]
        [HttpPost]
        public async Task<IActionResult> Register(RegisterDTO newUser) {
            var user = new ApplicationUser { UserName = newUser.UserName, Email = newUser.Email, FirstName = newUser.FirstName, LastName = newUser.LastName };
            IdentityResult response;

            if (newUser.Password.Equals(newUser.ConfirmPassword)) {
                response = await _userManager.CreateAsync(user, newUser.Password);
                if (response.Succeeded) {
                    await _signInManager.SignInAsync(user, isPersistent: false);

                    return Ok();
                }
                else
                    return BadRequest();
            }
            else
                return BadRequest();
        }
    }
}