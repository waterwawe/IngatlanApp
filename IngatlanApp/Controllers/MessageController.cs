﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IngatlanApi.Models;
using IngatlanApi.Models.Identity;
using IngatlanApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace IngatlanApi.Controllers {
    /// <summary>
    /// Üzenetek kezelése
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase {

        private readonly MessageService _messageService;
        private readonly UserManager<ApplicationUser> _userManager;

        public MessageController(MessageService msgservice, UserManager<ApplicationUser> userManager) {
            _messageService = msgservice;
            _userManager = userManager;
        }

        /// <summary>
        /// Azon felhasználók lekérdezése amelyekkel a bejelentkezett felhasználó már váltott legalább egy db üzenetet
        /// </summary>
        /// <returns>Felhasználók listája</returns>
        [Route("/api/[controller]/users")]
        [Authorize]
        [HttpGet]
        public IEnumerable<object> GetUsers() {
            return _messageService.FindUsers(User.Identity.Name);
        }

        /// <summary>
        /// A bejelentkezett felhasználó egy adott másik felhasználóval váltott üzeneteinek listája. Lehetőség van csak az új, vagy minden üzenet lekérdezésére
        /// </summary>
        /// <param name="otherUser">Ellen felhasználó neve</param>
        /// <param name="all">Minden üzenet lekérdezése, vagy csak az újakat.</param>
        /// <returns>Kért üzenetek listája</returns>
        [Authorize]
        [HttpGet]
        public async Task<List<Message>> Get([FromQuery]string otherUser, [FromQuery] bool all = true) {
            if (all) {
                var list = await _messageService.FindAllByUsername(User.Identity.Name, otherUser);
                if (otherUser != User.Identity.Name)
                    list.AddRange(await _messageService.FindAllByUsername(otherUser, User.Identity.Name));
                return list.OrderByDescending(m => m.TimeSent).ToList();
            }

            var listunseen = await _messageService.FindUnSeenByUsername(User.Identity.Name, otherUser);
            if (otherUser != User.Identity.Name)
                listunseen.AddRange(await _messageService.FindUnSeenByUsername(otherUser, User.Identity.Name));
            return listunseen.OrderByDescending(m => m.TimeSent).ToList();
        }

        /// <summary>
        /// Egy adott azonosítóval rendelkező üzenet lekérdezése
        /// </summary>
        /// <param name="id">Az üzenet azonosítója</param>
        /// <returns>A kért üzenet</returns>
        [Authorize]
        [HttpGet("{id:length(24)}")]
        public async Task<Message> Get(string id) {
            return await _messageService.FindById(id);
        }

        /// <summary>
        /// Egy új üzenet küldése
        /// </summary>
        /// <param name="to">Címzett felhasználó neve</param>
        /// <param name="text">Az üzenet szövege</param>
        /// <returns>Az elküldött üzenet</returns>
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Message>> Post([FromQuery]string to, [FromBody] string text) {
            var toUser = await _userManager.FindByNameAsync(to);

            if (toUser == null)
                return NotFound();

            var username = User.Identity.Name;
            var message = await _messageService.AddMessage(username, toUser.UserName, text);

            return message;
        }

        /// <summary>
        /// Láttam beállítása egy üzenetre
        /// </summary>
        /// <param name="id">Az üzenet azonosítója</param>
        /// <returns>A módosított üzenet 200 OK vagy 404 Not Found</returns>
        [Route("/api/[controller]/setseen")]
        [Authorize]
        [HttpPatch]
        public async Task<ActionResult<Message>> SetSeen([FromQuery]string id) {
            var message = await Get(id);

            if (message == null)
                return NotFound();

            return await _messageService.SetSeen(message.Id);
        }
    }
}
