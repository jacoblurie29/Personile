using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    public class UserDataController : BaseApiController
    {
        private readonly PersonileContext _context;
        private readonly IMapper _mapper;

        public UserDataController(PersonileContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
            
        }

        [HttpGet("{userId}", Name = "GetUser")]
        public async Task<ActionResult<UserDto>> GetUser(string userId) {
            var userEntity = await _context.Users.Where(u => u.UserEntityId == userId).Include(u => u.Sprints).ThenInclude(s => s.Tasks).ThenInclude(t => t.SubTasks).FirstOrDefaultAsync();
            return userEntity.mapUserToDto();
        }

        [HttpGet("{userId}/sprints", Name = "GetAllSprints")]
        public async Task<ActionResult<List<SprintDto>>> GetAllSprints(string userId) {

           var CurrentUserEntity = await _context.Users.Where(u => u.UserEntityId == userId).Include(u => u.Sprints).ThenInclude(s => s.Tasks).ThenInclude(t => t.SubTasks).FirstOrDefaultAsync();

           var Sprints = CurrentUserEntity.Sprints;

           var mappedSprintList = new List<SprintDto>(); 

           foreach (var sprint in Sprints)
           {
               mappedSprintList.Add(sprint.mapSprintToDto());
           }

           return mappedSprintList;

        }


        // Gets the sprint structure for a specific sprint id
        [HttpGet("{userId}/sprints/{sprintId}", Name = "GetSprintById")]
        public async Task<ActionResult<SprintDto>> GetSprintById(string sprintId, string userId) {

            var CurrentUserEntity = await _context.Users.Where(u => u.UserEntityId == userId).Include(u => u.Sprints).ThenInclude(s => s.Tasks).ThenInclude(t => t.SubTasks).FirstOrDefaultAsync();

            var CurrentSprintEntity = CurrentUserEntity.Sprints.Where(s => s.SprintEntityId == sprintId).FirstOrDefault();

            return CurrentSprintEntity.mapSprintToDto();

        }

        // Gets the tast structure for a specific sprint + task id
        [HttpGet("{userId}/sprints/{sprintId}/getTask/{taskId}", Name = "GetTaskById")]
        public async Task<ActionResult<TaskDto>> GetTaskById(string sprintId, string taskId) {
            
            var CurrentSprint = await RetrieveSprintEntity(sprintId);

            var CurrentTaskEntity = CurrentSprint.Tasks.Where(x => x.TaskEntityId == taskId).FirstOrDefault();

            if(CurrentTaskEntity == null) {
                return BadRequest(new ProblemDetails{Title = "Task not found"});
            }
            return CurrentTaskEntity.mapTaskToDto();

        }


        // Gets the titles of all sprints
        [HttpGet("{userId}/sprints/titles", Name = "GetTitles")]
        public async Task<ActionResult<List<string>>> GetSprintTitles(string userId) {

            var currentUser = await _context.Users.Where(u => u.UserEntityId == userId).Include(u => u.Sprints).FirstOrDefaultAsync();

            var currentUserSprints = currentUser.Sprints;

            return currentUserSprints.Select(t => t.SprintEntityId).Distinct().ToList();

        }

        // MARK: - POSTS
        

        // add a new sprint (not sure if I'm going to need this)
        [HttpPost("{userId}/addSprint")]
        public async Task<ActionResult<UserDto>> AddNewSprint(SprintDto sprintDto, string userId) {

            var MappedSprint = _mapper.Map<SprintEntity>(sprintDto);

            var CurrentUser = await RetrieveUserEntity(userId);

            CurrentUser.Sprints.Add(MappedSprint); 

            var result = await _context.SaveChangesAsync() > 0;

            if (result) {
                return CreatedAtRoute("GetUser", new { UserId = userId }, CurrentUser.mapUserToDto());
            }

            return BadRequest(new ProblemDetails{Title = "Problem creating new sprint"});
        }   


        // Adds a task to a specific sprint
        [HttpPost("{userId}/sprints/{sprintId}/addTask", Name = "AddTaskToSprint")]
        public async Task<ActionResult<SprintDto>> AddTaskToSprint(string sprintId, string userId, TaskDto taskDto) {

            var MappedTask = _mapper.Map<TaskEntity>(taskDto);

            var CurrentUser = await RetrieveUserEntity(userId);

            var CurrentSprint = CurrentUser.Sprints.Where(s => s.SprintEntityId == sprintId).FirstOrDefault();

            if (CurrentSprint == null) {
                return BadRequest(new ProblemDetails{Title = "Sprint not found"});
            }

            CurrentSprint.AddTask(MappedTask);

            var result = await _context.SaveChangesAsync() > 0;

            if(result) {
                return CreatedAtRoute("GetSprintById", new { UserId = userId, SprintId = sprintId }, CurrentSprint.mapSprintToDto());
            }

            return BadRequest(new ProblemDetails{Title = "Problem saving new task"});

        }


        // Adds a subtask to a specific task
        [HttpPost("{userId}/sprints/{sprintId}/tasks/{taskId}/addSubtask", Name = "AddSubtaskToTask")]
        public async Task<ActionResult<TaskDto>> AddNewSubtask(string sprintId, string taskId, SubTaskDto subTaskDto, string userId) {
            var MappedSubtask = _mapper.Map<SubTaskEntity>(subTaskDto);

            var CurrentUser = await RetrieveUserEntity(userId);

            var CurrentSprint = CurrentUser.Sprints.Where(s => s.SprintEntityId == sprintId).FirstOrDefault();

            if (CurrentSprint == null) {
                return BadRequest(new ProblemDetails{Title = "Sprint not found"});
            }

            var CurrentTask = CurrentSprint.Tasks.Where(t => t.TaskEntityId == taskId).FirstOrDefault();

            CurrentTask.AddSubtask(MappedSubtask);

            var result = await _context.SaveChangesAsync() > 0;

            if(result) {
                return CreatedAtRoute("GetTaskById", new { UserId = userId, SprintId = sprintId, TaskId = taskId }, CurrentTask.mapTaskToDto());
            }

            return BadRequest(new ProblemDetails{Title = "Problem saving new task"});
        }

        [HttpDelete("{userId}/sprints/{sprintId}/tasks/{taskId}/deleteTask", Name = "DeleteTaskFromSprint")]
        public async Task<ActionResult> DeleteTaskFromSprint(string userId, string sprintId, string taskId) {
            var CurrentUser = await RetrieveUserEntity(userId);

            var CurrentSprint = CurrentUser.Sprints.Where(s => s.SprintEntityId == sprintId).FirstOrDefault(); 

            var TaskToBeDeleted = CurrentSprint.Tasks.Where(t => t.TaskEntityId == taskId).FirstOrDefault();

            CurrentSprint.Tasks.Remove(TaskToBeDeleted);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest(new ProblemDetails {Title = "Problem adding task"});
            
        }

        [HttpPut("{userId}/sprints/{sprintId}/tasks/{taskId}/updateTask", Name = "UpdateTask")]
        public async Task<ActionResult<UpdateTaskDto>> UpdateTask(string userId, string sprintId, string taskId, UpdateTaskDto updateTaskDto) {

            var currentUser = await _context.Users.Where(u => u.UserEntityId == userId).Include(u => u.Sprints).ThenInclude(s => s.Tasks).FirstOrDefaultAsync();

            if(currentUser == null) return NotFound();

            var currentSprint = currentUser.Sprints.Where(s => s.SprintEntityId == sprintId).FirstOrDefault();

            if(currentSprint == null) return NotFound();

            var currentTask = currentSprint.Tasks.Where(t => t.TaskEntityId == taskId).FirstOrDefault();

            if(currentTask == null) return NotFound();

            _mapper.Map(updateTaskDto, currentTask);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(updateTaskDto);

            return BadRequest(new ProblemDetails { Title = "Problem updating task" });

        }

        [HttpPut("{userId}/sprints/{sprintId}/tasks/{taskId}/subtasks/{subtaskId}/updateSubtask")]
        public async Task<ActionResult<SubTaskDto>> UpdateSubtask(string userId, string sprintId, string taskId, string subtaskId, SubTaskDto subTaskDto) {
            var currentUser = await _context.Users.Where(u => u.UserEntityId == userId).Include(u => u.Sprints).ThenInclude(s => s.Tasks).ThenInclude(s => s.SubTasks).FirstOrDefaultAsync();

            if(currentUser == null) return NotFound();

            var currentSprint = currentUser.Sprints.Where(s => s.SprintEntityId == sprintId).FirstOrDefault();

            if(currentSprint == null) return NotFound();

            var currentTask = currentSprint.Tasks.Where(t => t.TaskEntityId == taskId).FirstOrDefault();

            if(currentTask == null) return NotFound();

            var currentSubtask = currentTask.SubTasks.Where(s => s.SubTaskEntityId == subTaskDto.SubTaskEntityId).FirstOrDefault();

            if(currentSubtask == null) return NotFound();

            _mapper.Map(subTaskDto, currentSubtask);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(subTaskDto);

            return BadRequest(new ProblemDetails { Title = "Problem updating task" });


        }


        private async Task<UserEntity> RetrieveUserEntity(string userEntityId) {
                return await _context.Users
                        .Where(u => u.UserEntityId == userEntityId)
                        .Include(s => s.Sprints)
                        .ThenInclude(t => t.Tasks)
                        .ThenInclude(s => s.SubTasks)
                        .FirstOrDefaultAsync();
        }

        private async Task<SprintEntity> RetrieveSprintEntity(string sprintEntityId) {
            return await _context.Sprints
                        .Include(t => t.Tasks)
                        .ThenInclude(s => s.SubTasks)
                        .FirstOrDefaultAsync(x => x.SprintEntityId == sprintEntityId);
        }

        private TaskEntity RetrieveTaskEntity(SprintEntity currentSprint, string taskEntityId) {

            return currentSprint
                    .Tasks
                    .Where(x => x.TaskEntityId == taskEntityId)
                    .FirstOrDefault();
                        
        }

 
    }
}