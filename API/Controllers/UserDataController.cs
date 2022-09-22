using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.RequestHelpers;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
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

        [HttpGet("{userId}/boards/{boardId}", Name = "GetBoard")]
        public async Task<ActionResult<BoardDto>> GetBoardById(string userId, string boardId) {

            var CurrentUserEntity = await RetrieveUserEntity(userId);
            
            if(CurrentUserEntity == null) return NotFound();

           var CurrentBoardEntity = CurrentUserEntity.Boards.Where(b => b.BoardEntityId == boardId).FirstOrDefault();

           if(CurrentBoardEntity == null) return NotFound();

           return _mapper.Map<BoardDto>(CurrentBoardEntity);

        }

        [HttpGet("{userId}/boards/{boardId}/sprints", Name = "GetAllSprints")]
        public async Task<ActionResult<List<SprintDto>>> GetAllSprints(string userId, string boardId) {

           var CurrentUserEntity = await RetrieveUserEntity(userId);

           var CurrentBoardEntity = CurrentUserEntity.Boards.Where(b => b.BoardEntityId == boardId).FirstOrDefault();

           var CurrentSprints = CurrentBoardEntity.Sprints;

           var mappedSprintList = new List<SprintDto>(); 

           foreach (var sprint in CurrentSprints)
           {
               mappedSprintList.Add(_mapper.Map<SprintDto>(sprint));
           }

           return mappedSprintList;

        }


        // Gets the sprint structure for a specific sprint id
        [HttpGet("{userId}/boards/{boardId}/sprints/{sprintId}", Name = "GetSprintById")]
        public async Task<ActionResult<SprintDto>> GetSprintById(string sprintId, string boardId, string userId) {

            var CurrentUserEntity = await RetrieveUserEntity(userId);

            var CurrentBoardEntity = CurrentUserEntity.Boards.Where(b => b.BoardEntityId == boardId).FirstOrDefault();

            var CurrentSprintEntity = CurrentBoardEntity.Sprints.Where(s => s.SprintEntityId == sprintId).FirstOrDefault();

            return _mapper.Map<SprintDto>(CurrentSprintEntity);

        }

        // Gets the tast structure for a specific sprint + task id
        [HttpGet("{userId}/boards/{boardId}/sprints/{sprintId}/getTask/{taskId}", Name = "GetTaskById")]
        public async Task<ActionResult<TaskDto>> GetTaskById(string sprintId, string taskId, string userId, string boardId) {
            
            var CurrentUserEntity = await RetrieveUserEntity(userId);

            var CurrentBoardEntity = CurrentUserEntity.Boards.Where(b => b.BoardEntityId == boardId).FirstOrDefault();

            var CurrentSprintEntity = CurrentBoardEntity.Sprints.Where(s => s.SprintEntityId == sprintId).FirstOrDefault();

            var CurrentTaskEntity = CurrentSprintEntity.Tasks.Where(x => x.TaskEntityId == taskId).FirstOrDefault();

            if(CurrentTaskEntity == null) {
                return BadRequest(new ProblemDetails{Title = "Task not found"});
            }

            return _mapper.Map<TaskDto>(CurrentTaskEntity);

        }


        // Gets the titles of all sprints for a specific board
        [HttpGet("{userId}/boards/{boardId}/sprints/titles", Name = "GetTitles")]
        public async Task<ActionResult<List<string>>> GetSprintTitles(string userId, string boardId) {

            var CurrentUserEntity = await RetrieveUserEntity(userId);

            var CurrentBoardEntity = CurrentUserEntity.Boards.Where(b => b.BoardEntityId == boardId).FirstOrDefault();

            var currentBoardSprints = CurrentBoardEntity.Sprints;

            return currentBoardSprints.Select(t => t.SprintEntityId).Distinct().ToList();

        }

        // MARK: - POSTS
        
        [HttpPost("{userId}/addBoard", Name = "AddBoard")]
        public async Task<ActionResult<BoardDto>> AddNewBoard(BoardDto boardDto, string userId) {

            var CurrentUserEntity = await RetrieveUserEntity(userId);

            var GeneratedSprints = boardDto.generateSprints();

            boardDto.Sprints = GeneratedSprints;

            var mappedBoard = _mapper.Map<BoardEntity>(boardDto);

            CurrentUserEntity.Boards.Add(mappedBoard);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) {
                return CreatedAtRoute("GetBoard", new { userId = userId, boardId = mappedBoard.BoardEntityId }, boardDto);
            }

            return BadRequest(new ProblemDetails{Title = "Problem creating new board"});
        }

        // add a new sprint (not sure if I'm going to need this)
        [HttpPost("{userId}/boards/{boardId}/addSprint")]
        public async Task<ActionResult<UserDto>> AddNewSprint(SprintDto sprintDto, string userId, string boardId) {

            var MappedSprint = _mapper.Map<SprintEntity>(sprintDto);

            var CurrentUser = await RetrieveUserEntity(userId);

            var CurrentBoard = CurrentUser.Boards.Where(b => b.BoardEntityId == boardId).FirstOrDefault();

            CurrentBoard.Sprints.Add(MappedSprint); 

            var result = await _context.SaveChangesAsync() > 0;

            if (result) {
                return CreatedAtRoute("GetUser", new { userId = userId }, _mapper.Map<UserDto>(CurrentUser));
            }

            return BadRequest(new ProblemDetails{Title = "Problem creating new sprint"});
        }   

        // Adds a task to a specific sprint
        [HttpPost("{userId}/boards/{boardId}/sprints/{sprintId}/addTask", Name = "AddTaskToSprint")]
        public async Task<ActionResult<SprintDto>> AddTaskToSprint(string sprintId, string userId, string boardId, TaskDto taskDto) {

            var MappedTask = _mapper.Map<TaskEntity>(taskDto);

            var CurrentUser = await RetrieveUserEntity(userId);

            

            var CurrentBoard = CurrentUser.Boards.Where(b => b.BoardEntityId == boardId).FirstOrDefault();

            var CurrentSprint = CurrentBoard.Sprints.Where(s => s.SprintEntityId == sprintId).FirstOrDefault();

            if (CurrentSprint == null) {
                return BadRequest(new ProblemDetails{Title = "Sprint not found"});
            }

            CurrentSprint.AddTask(MappedTask);

            var result = await _context.SaveChangesAsync() > 0;

            if(result) {
                return CreatedAtRoute("GetSprintById", new { sprintId = sprintId, boardId = boardId, userId = userId }, _mapper.Map<SprintDto>(CurrentSprint));
            }

            return BadRequest(new ProblemDetails{Title = "Problem saving new task"});

        }

        [HttpPatch("{userId}/boards/{boardId}/milestones/{milestoneId}/sprints/{sprintId}/tasks/{taskId}/addTaskToMilestone", Name = "AddTaskToMilestone")]
        public async Task<ActionResult<UserDto>> AddTaskToMilestone(string userId, string boardId, string sprintId, string taskId, string milestoneId) {

            var CurrentUser = await RetrieveUserEntity(userId);

            var CurrentBoard = CurrentUser.Boards.Where(b => b.BoardEntityId == boardId).FirstOrDefault();

            var CurrentMilestone = CurrentBoard.Milestones.Where(m => m.MilestoneEntityId == milestoneId).FirstOrDefault();

            var CurrentSprint = CurrentBoard.Sprints.Where(s => s.SprintEntityId == sprintId).FirstOrDefault();

            if (CurrentSprint == null) {
                return BadRequest(new ProblemDetails{Title = "Sprint not found"});
            }

            var CurrentTask = CurrentSprint.Tasks.Where(t => t.TaskEntityId == taskId).FirstOrDefault();

            if (CurrentTask == null) {
                return BadRequest(new ProblemDetails{Title = "Task not found"});
            }

            if(CurrentMilestone.Tasks.Contains(CurrentTask)) {
                return BadRequest(new ProblemDetails{Title = "Task already in milestone!"});
            }

            CurrentMilestone.Tasks.Add(CurrentTask);


            var result = await _context.SaveChangesAsync() > 0;

            if(result) {
                return CreatedAtRoute("GetSprintById", new { sprintId = sprintId, boardId = boardId, userId = userId }, _mapper.Map<SprintDto>(CurrentSprint));
            }

            return BadRequest(new ProblemDetails{Title = "Problem saving new task"});

        }


        // Adds a subtask to a specific task
        [HttpPost("{userId}/boards/{boardId}/sprints/{sprintId}/tasks/{taskId}/addSubtask", Name = "AddSubtaskToTask")]
        public async Task<ActionResult<TaskDto>> AddNewSubtask(string sprintId, string taskId, string boardId, SubTaskDto subTaskDto, string userId) {
            
            var MappedSubtask = _mapper.Map<SubTaskEntity>(subTaskDto);

            var CurrentUser = await RetrieveUserEntity(userId);

            var CurrentBoard = CurrentUser.Boards.Where(b => b.BoardEntityId == boardId).FirstOrDefault();

            var CurrentSprint = CurrentBoard.Sprints.Where(s => s.SprintEntityId == sprintId).FirstOrDefault();

            if (CurrentSprint == null) {
                return BadRequest(new ProblemDetails{Title = "Sprint not found"});
            }

            var CurrentTask = CurrentSprint.Tasks.Where(t => t.TaskEntityId == taskId).FirstOrDefault();

            CurrentTask.AddSubtask(MappedSubtask);

            var result = await _context.SaveChangesAsync() > 0;

            if(result) {
                return CreatedAtRoute("GetTaskById", new { sprintId = sprintId, boardId = boardId, userId = userId, taskId = taskId }, _mapper.Map<TaskDto>(CurrentTask));
            }

            return BadRequest(new ProblemDetails{Title = "Problem saving new task"});
        }

        [HttpDelete("{userId}/boards/{boardId}/deleteBoard", Name = "DeleteBoard")]
        public async Task<ActionResult> DeleteBoard(string userId, string boardId) {
            var CurrentUser = await RetrieveUserEntity(userId);

            var BoardToBeDeleted = CurrentUser.Boards.Where(b => b.BoardEntityId == boardId).FirstOrDefault();

            CurrentUser.Boards.Remove(BoardToBeDeleted);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest(new ProblemDetails {Title = "Problem deleting board"});
            
        }



        [HttpDelete("{userId}/boards/{boardId}/sprints/{sprintId}/tasks/{taskId}/deleteTask", Name = "DeleteTaskFromSprint")]
        public async Task<ActionResult> DeleteTaskFromSprint(string userId, string sprintId, string taskId, string boardId) {
            var CurrentUser = await RetrieveUserEntity(userId);

            var CurrentBoard = CurrentUser.Boards.Where(b => b.BoardEntityId == boardId).FirstOrDefault();

            var CurrentSprint = CurrentBoard.Sprints.Where(s => s.SprintEntityId == sprintId).FirstOrDefault();

            var TaskToBeDeleted = CurrentSprint.Tasks.Where(t => t.TaskEntityId == taskId).FirstOrDefault();

            CurrentSprint.Tasks.Remove(TaskToBeDeleted);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest(new ProblemDetails {Title = "Problem removing task"});
            
        }

        [HttpDelete("{userId}/boards/{boardId}/sprints/{sprintId}/tasks/{taskId}/subtasks/{subtaskId}/deleteSubtask", Name = "DeleteSubtaskFromTask")]
        public async Task<ActionResult> DeleteSubtaskFromTask(string userId, string sprintId, string taskId, string boardId, string subtaskId) {
            var CurrentUser = await RetrieveUserEntity(userId);

            if(CurrentUser == null) return NotFound();

            var CurrentBoard = CurrentUser.Boards.Where(b => b.BoardEntityId == boardId).FirstOrDefault();

            if(CurrentBoard == null) return NotFound();

            var CurrentSprint = CurrentBoard.Sprints.Where(s => s.SprintEntityId == sprintId).FirstOrDefault();

            if(CurrentSprint == null) return NotFound();

            var CurrentTask = CurrentSprint.Tasks.Where(t => t.TaskEntityId == taskId).FirstOrDefault();

            if(CurrentTask == null) return NotFound();

            var SubtaskToBeDeleted = CurrentTask.SubTasks.Where(s => s.SubTaskEntityId == subtaskId).FirstOrDefault();

            CurrentTask.SubTasks.Remove(SubtaskToBeDeleted);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();

            return BadRequest(new ProblemDetails {Title = "Problem removing subtask"});
            
        }

        [HttpPut("{userId}/boards/{boardId}/updateBoard", Name = "UpdateBoard")]
        public async Task<ActionResult<UpdateBoardDto>> UpdateBoard(string userId, string boardId, UpdateBoardDto updateBoardDto) {

            var CurrentUser = await RetrieveUserEntity(userId);

            if(CurrentUser == null) return NotFound();

            var CurrentBoard = CurrentUser.Boards.Where(b => b.BoardEntityId == boardId).FirstOrDefault();

            if(CurrentBoard == null) return NotFound();

            _mapper.Map(updateBoardDto, CurrentBoard);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(updateBoardDto);

            return BadRequest(new ProblemDetails { Title = "Problem updating board" });

        }

        [HttpPut("{userId}/boards/{boardId}/sprints/{sprintId}/tasks/{taskId}/updateTask", Name = "UpdateTask")]
        public async Task<ActionResult<UpdateTaskDto>> UpdateTask(string userId, string sprintId, string taskId, string boardId, UpdateTaskDto updateTaskDto) {

            var CurrentUser = await RetrieveUserEntity(userId);

            if(CurrentUser == null) return NotFound();

            var CurrentBoard = CurrentUser.Boards.Where(b => b.BoardEntityId == boardId).FirstOrDefault();

            if(CurrentBoard == null) return NotFound();

            var CurrentSprint = CurrentBoard.Sprints.Where(s => s.SprintEntityId == sprintId).FirstOrDefault();

            if(CurrentSprint == null) return NotFound();

            var CurrentTask = CurrentSprint.Tasks.Where(t => t.TaskEntityId == taskId).FirstOrDefault();

            if(CurrentTask == null) return NotFound();

            _mapper.Map(updateTaskDto, CurrentTask);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(updateTaskDto);

            return BadRequest(new ProblemDetails { Title = "Problem updating task" });

        }

        [HttpPut("{userId}/boards/{boardId}/sprints/{sprintId}/tasks/{taskId}/subtasks/{subtaskId}/updateSubtask")]
        public async Task<ActionResult<SubTaskDto>> UpdateSubtask(string userId, string sprintId, string taskId, string subtaskId, string boardId, SubTaskDto subTaskDto) {
            var CurrentUser = await RetrieveUserEntity(userId);

            if(CurrentUser == null) return NotFound();

            var CurrentBoard = CurrentUser.Boards.Where(b => b.BoardEntityId == boardId).FirstOrDefault();

            if(CurrentBoard == null) return NotFound();

            var CurrentSprint = CurrentBoard.Sprints.Where(s => s.SprintEntityId == sprintId).FirstOrDefault();

            if(CurrentSprint == null) return NotFound();

            var CurrentTask = CurrentSprint.Tasks.Where(t => t.TaskEntityId == taskId).FirstOrDefault();

            if(CurrentTask == null) return NotFound();

            var CurrentSubtask = CurrentTask.SubTasks.Where(s => s.SubTaskEntityId == subTaskDto.SubTaskEntityId).FirstOrDefault();

            if(CurrentSubtask == null) return NotFound();

            _mapper.Map(subTaskDto, CurrentSubtask);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(subTaskDto);

            return BadRequest(new ProblemDetails { Title = "Problem updating subtask" });


        }

 
        private async Task<UserEntity> RetrieveUserEntity(string userEntityId) {
                return await _context.Users.Where(u => u.Id == userEntityId)
                .Include(b => b.Boards).ThenInclude(u => u.Sprints).ThenInclude(s => s.Tasks).ThenInclude(t => t.SubTasks)
                .Include(b => b.Boards).ThenInclude(u => u.Sprints).ThenInclude(s => s.Tasks).ThenInclude(t => t.Milestones)
                .Include(b => b.Boards).ThenInclude(m => m.Milestones).ThenInclude(t => t.Tasks)
                .Include(b => b.Boards).ThenInclude(g => g.Goals)
                .FirstOrDefaultAsync();
        }



    }
}