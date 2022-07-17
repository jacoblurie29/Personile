using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<UserEntity> _userManager;
        private readonly TokenService _tokenService;
        private readonly PersonileContext _context;

        public AccountController(UserManager<UserEntity> userManager, TokenService tokenService, PersonileContext context)
        {
            _context = context;
            _tokenService = tokenService;
            _userManager = userManager;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto) {

            var user = await _userManager.FindByNameAsync(loginDto.Username);

            if (user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password)) {
                return Unauthorized();
            }

            var CurrentUserEntity = await _context.Users.Where(u => u.Id == user.Id)
                .Include(b => b.Boards).ThenInclude(u => u.Sprints).ThenInclude(s => s.Tasks).ThenInclude(t => t.SubTasks)
                .Include(b => b.Boards).ThenInclude(g => g.Goals).FirstOrDefaultAsync();

            var mappedUser = CurrentUserEntity.mapUserToDto();

            return new UserDto {
                UserEntityId = user.Id,
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Boards = mappedUser.Boards,
                FirstName = user.FirstName,
                LastName = user.LastName
            };
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto) {

            var user = new UserEntity{UserName = registerDto.Username, Email = registerDto.Email, FirstName = registerDto.FirstName, LastName = registerDto.LastName};

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if(!result.Succeeded) {
                foreach (var error in result.Errors) {
                    ModelState.AddModelError(error.Code, error.Description);
                }

                return ValidationProblem();

            }

            
            await _userManager.AddToRoleAsync(user, "Member");

            /*
                 HERE IS WHERE THE BASE CONDITIONS WILL BE ADDED. This includes:

                 Default sprints and their dates
                 Example tasks
                 User settings
                 
            */

            BoardEntity defaultBoard = new BoardEntity{
                BoardEntityId = Guid.NewGuid().ToString(),
                StartDate = null,
                EndDate = null,
                Sprints = null,
            };

            SprintEntity defaultSprint = new SprintEntity{
                SprintEntityId = Guid.NewGuid().ToString(),
                StartDate = null,
                EndDate = null,
                Tasks = null,
            };

            var CurrentUserEntity = await _context.Users.Where(u => u.Id == user.Id)
                            .Include(b => b.Boards).ThenInclude(u => u.Sprints).ThenInclude(s => s.Tasks).ThenInclude(t => t.SubTasks)
                            .Include(b => b.Boards).ThenInclude(g => g.Goals).FirstOrDefaultAsync();

            defaultBoard.Sprints.Add(defaultSprint);
            CurrentUserEntity.Boards.Add(defaultBoard);
            
            
            await _context.SaveChangesAsync();


            return StatusCode(201);
        }

        [Authorize]
        [HttpGet("currentUser", Name = "GetCurrentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser() {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            
            var CurrentUserEntity = await _context.Users.Where(u => u.Id == user.Id)
                .Include(b => b.Boards).ThenInclude(u => u.Sprints).ThenInclude(s => s.Tasks).ThenInclude(t => t.SubTasks)
                .Include(b => b.Boards).ThenInclude(g => g.Goals).FirstOrDefaultAsync();

            var mappedUser = CurrentUserEntity.mapUserToDto();

            return new UserDto {
                UserEntityId = user.Id,
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Boards = mappedUser.Boards,
                FirstName = user.FirstName,
                LastName = user.LastName
            };
        }
    }
}