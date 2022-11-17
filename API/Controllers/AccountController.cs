using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.RequestHelpers;
using API.Services;
using AutoMapper;
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
        private readonly IMapper _mapper;

        public AccountController(UserManager<UserEntity> userManager, TokenService tokenService, PersonileContext context, IMapper mapper)
        {
            _mapper = mapper;
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
                .Include(b => b.Boards).ThenInclude(u => u.Sprints).ThenInclude(s => s.Tasks).ThenInclude(t => t.Milestones)
                .Include(b => b.Boards).ThenInclude(m => m.Milestones).ThenInclude(t => t.Tasks)
                .Include(b => b.Boards).ThenInclude(b => b.ActivityEvents)
                .Include(b => b.Boards).ThenInclude(g => g.Goals)
                .FirstOrDefaultAsync();

            var mappedUser = _mapper.Map<UserDto>(CurrentUserEntity);

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
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto) {

            var user = new UserEntity{
                UserName = registerDto.Username,
                Email = registerDto.Email,
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if(!result.Succeeded) {
                foreach (var error in result.Errors) {
                    ModelState.AddModelError(error.Code, error.Description);
                }

                return ValidationProblem();

            }

            await _userManager.AddToRoleAsync(user, "Member");

            var CurrentUserEntity = await _context.Users.Where(u => u.Id == user.Id)
                .Include(b => b.Boards).ThenInclude(u => u.Sprints).ThenInclude(s => s.Tasks).ThenInclude(t => t.SubTasks)
                .Include(b => b.Boards).ThenInclude(u => u.Sprints).ThenInclude(s => s.Tasks).ThenInclude(t => t.Milestones)
                .Include(b => b.Boards).ThenInclude(m => m.Milestones).ThenInclude(t => t.Tasks)
                .Include(b => b.Boards).ThenInclude(b => b.ActivityEvents)
                .Include(b => b.Boards).ThenInclude(g => g.Goals)
                .FirstOrDefaultAsync();


            var initializer = new AccountInitializer();
            
            var defaultBoard = initializer.generateInitialUserBoard(user.Id, user.FirstName + " " + user.LastName);

            var dtoBoard = _mapper.Map<BoardDto>(defaultBoard);
            var dtoSprints = dtoBoard.generateSprints();

            foreach(SprintDto generatedSprint in dtoSprints) {
                var currentSprint = _mapper.Map<SprintEntity>(generatedSprint);
                defaultBoard.Sprints.Add(currentSprint);
            }
            defaultBoard.Sprints[0].Tasks.Add(initializer.generateInitialUserTask());
            var generatedMilestone1 = initializer.generateInitialUserMilestone("Make milestones!", 10);
            var generatedMilestone2 = initializer.generateInitialUserMilestone("Track progress!", 20);
            defaultBoard.Sprints[0].Tasks[0].Milestones.Add(generatedMilestone1);
            defaultBoard.Milestones.Add(generatedMilestone1);
            defaultBoard.Sprints[0].Tasks[0].Milestones.Add(generatedMilestone2);
            defaultBoard.Milestones.Add(generatedMilestone2);

            CurrentUserEntity.Boards.Add(defaultBoard);
            
            await _context.SaveChangesAsync();
            
            var mappedUser = _mapper.Map<UserDto>(CurrentUserEntity);

            return new UserDto {
                UserEntityId = user.Id,
                Email = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Boards = mappedUser.Boards,
                FirstName = user.FirstName,
                LastName = user.LastName
            };
        }

        [Authorize]
        [HttpGet("currentUser", Name = "GetCurrentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser() {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            
            var CurrentUserEntity = await _context.Users.Where(u => u.Id == user.Id)
                .Include(b => b.Boards).ThenInclude(u => u.Sprints).ThenInclude(s => s.Tasks).ThenInclude(t => t.SubTasks)
                .Include(b => b.Boards).ThenInclude(u => u.Sprints).ThenInclude(s => s.Tasks).ThenInclude(t => t.Milestones)
                .Include(b => b.Boards).ThenInclude(m => m.Milestones).ThenInclude(t => t.Tasks)
                .Include(b => b.Boards).ThenInclude(b => b.ActivityEvents)
                .Include(b => b.Boards).ThenInclude(g => g.Goals)
                .FirstOrDefaultAsync();
            
            var mappedUser = _mapper.Map<UserDto>(CurrentUserEntity);
            
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