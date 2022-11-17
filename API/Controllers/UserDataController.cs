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
using Microsoft.EntityFrameworkCore.Metadata.Builders;

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

        // Gets a list of all recent activity for the user's boards
        [HttpGet("{userId}/getRecentActivity", Name = "GetRecentActivity")]
        public async Task<ActionResult<List<ActivityEventDto>>> GetRecentActivity(string userId) {
            var CurrentUserEntity = await RetrieveUserEntity(userId);

            var ActivityEvents = new List<ActivityEventDto>();

            foreach(var board in CurrentUserEntity.Boards) {
                foreach(var eventActivity in board.ActivityEvents) {
                    ActivityEvents.Add(_mapper.Map<ActivityEventDto>(eventActivity));
                }
            }

            return ActivityEvents;

        }

        // MARK: - POSTS
        
        [HttpPost("{userId}/addBoard", Name = "AddBoard")]
        public async Task<ActionResult<UserDto>> AddNewBoard(BoardDto boardDto, string userId) {

            var CurrentUserEntity = await RetrieveUserEntity(userId);

            var GeneratedSprints = boardDto.generateSprints();

            boardDto.Sprints = GeneratedSprints;

            var mappedBoard = _mapper.Map<BoardEntity>(boardDto);

            CurrentUserEntity.Boards.Add(mappedBoard);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) {
                var logResult = await LogUserAction("New board added: \"" + mappedBoard.Name + "\"", userId, mappedBoard.BoardEntityId);

                if(logResult) return CreatedAtRoute("GetBoard", new { userId = userId, boardId = mappedBoard.BoardEntityId }, _mapper.Map<UserDto>(CurrentUserEntity));

                return BadRequest(new ProblemDetails{Title = "Problem logging user data"});
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
                var logResult = await LogUserAction("New task added: \"" + MappedTask.Name + "\"", userId, CurrentBoard.BoardEntityId);
                
                if(logResult) return CreatedAtRoute("GetSprintById", new { sprintId = sprintId, boardId = boardId, userId = userId }, _mapper.Map<SprintDto>(CurrentSprint));

                return BadRequest(new ProblemDetails{Title = "Problem logging user data"});
            }

            return BadRequest(new ProblemDetails{Title = "Problem saving new task"});

        }

        [HttpPatch("{userId}/boards/{boardId}/milestones/{milestoneId}/sprints/{sprintId}/tasks/{taskId}/addTaskToMilestone", Name = "AddTaskToMilestone")]
        public async Task<ActionResult<TaskDto>> AddTaskToMilestone(string userId, string boardId, string sprintId, string taskId, string milestoneId) {

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
                var logResult = await LogUserAction("Task \"" + CurrentTask.Name + "\" added to milestone \"" + CurrentBoard.Name + "\"", userId, CurrentBoard.BoardEntityId);
                if (logResult) return CreatedAtRoute("GetTaskById", new { sprintId = sprintId, boardId = boardId, userId = userId, taskId = taskId }, _mapper.Map<TaskDto>(CurrentTask));
                return BadRequest(new ProblemDetails{Title = "Problem logging user data"});
            }

            return BadRequest(new ProblemDetails{Title = "Problem adding task to milestone"});

        }
        
        [HttpPatch("{userId}/boards/{boardId}/sprints/{sprintId}/tasks/{taskId}/changeTaskOrder/{newOrder}", Name = "MoveTask")]
        public async Task<ActionResult<SprintDto>> ChangeTaskOrder(string userId, string boardId, string sprintId, string taskId, string newOrder) {

            var newOrderNumber = Int32.Parse(newOrder);

            var CurrentUser = await RetrieveUserEntity(userId);

            var CurrentBoard = CurrentUser.Boards.Where(b => b.BoardEntityId == boardId).FirstOrDefault();

            var CurrentSprint = CurrentBoard.Sprints.Where(s => s.SprintEntityId == sprintId).FirstOrDefault();

            var CurrentTask = CurrentSprint.Tasks.Where(t => t.TaskEntityId == taskId).FirstOrDefault();

            if (CurrentTask == null) {
                return BadRequest(new ProblemDetails{Title = "Task not found"});
            }

            List<int> orderList = new List<int>();
            CurrentSprint.Tasks.OrderBy(t => t.Order).ToList().ForEach((task) => { orderList.Add(task.Order); });


            orderList.Remove(newOrderNumber);
            orderList.Insert(CurrentTask.Order, newOrderNumber);

            var index = 0;
            CurrentSprint.Tasks.OrderBy(t => t.Order).ToList().ForEach((task) => { task.Order = orderList[index]; index++; });


            var result = await _context.SaveChangesAsync() > 0;

            if(result) {
                var logResult = await LogUserAction("Task \"" + CurrentTask.Name + "\" order changed.", userId, CurrentBoard.BoardEntityId);
                if (logResult) return CreatedAtRoute("GetSprintById", new { sprintId = sprintId, boardId = boardId, userId = userId }, _mapper.Map<SprintDto>(CurrentSprint));
                return BadRequest(new ProblemDetails{Title = "Problem logging user data"});
            }

            return BadRequest(new ProblemDetails{Title = "Problem moving task order"});
        }

        [HttpPatch("{userId}/boards/{boardId}/sprints/{sprintId}/tasks/{taskId}/changeTaskSprint/{newSprintId}")]
        public async Task<ActionResult<SprintDto>> ChangeTaskSprint(string userId, string boardId, string sprintId, string taskId, string newSprintId) {

            var CurrentUser = await RetrieveUserEntity(userId);

            var CurrentBoard = CurrentUser.Boards.Where(b => b.BoardEntityId == boardId).FirstOrDefault();

            var CurrentSprint = CurrentBoard.Sprints.Where(s => s.SprintEntityId == sprintId).FirstOrDefault();
            var NewSprint = CurrentBoard.Sprints.Where(s => s.SprintEntityId == newSprintId).FirstOrDefault();

            var CurrentTask = CurrentSprint.Tasks.Where(t => t.TaskEntityId == taskId).FirstOrDefault();

            if (CurrentTask == null) {
                return BadRequest(new ProblemDetails{Title = "Task not found"});
            }

            CurrentSprint.Tasks.Remove(CurrentTask);
            int index = 0;
            CurrentSprint.Tasks.OrderBy(t => t.Order).ToList().ForEach((task) => { task.Order = index; index++; });

            CurrentTask.Order = 0;
            int indexNew = 1;
            NewSprint.Tasks.OrderBy(t => t.Order).ToList().ForEach((task) => { task.Order = indexNew; indexNew++; });
            NewSprint.Tasks.Add(CurrentTask);


            var result = await _context.SaveChangesAsync() > 0;

            if(result) {
                
                var logResult = await LogUserAction("Task \"" + CurrentTask.Name + "\" moved to different sprint.", userId, CurrentBoard.BoardEntityId);
                if (logResult) return CreatedAtRoute("GetSprintById", new { sprintId = sprintId, boardId = boardId, userId = userId }, _mapper.Map<SprintDto>(CurrentSprint));
                return BadRequest(new ProblemDetails{Title = "Problem logging user data"});

            }

            return BadRequest(new ProblemDetails{Title = "Problem changing task sprint"});
        }

        [HttpPatch("{userId}/boards/{boardId}/sprints/{sprintId}/tasks/{taskId}/changeTaskState/{newState}/newOrder/{newOrder}")]
        public async Task<ActionResult<SprintDto>> ChangeTaskState(string userId, string boardId, string sprintId, string taskId, string newOrder, string newState) {

            var newOrderNumber = Int32.Parse(newOrder);

            var CurrentUser = await RetrieveUserEntity(userId);

            var CurrentBoard = CurrentUser.Boards.Where(b => b.BoardEntityId == boardId).FirstOrDefault();

            var CurrentSprint = CurrentBoard.Sprints.Where(s => s.SprintEntityId == sprintId).FirstOrDefault();

            var CurrentTask = CurrentSprint.Tasks.Where(t => t.TaskEntityId == taskId).FirstOrDefault();

            if (CurrentTask == null) {
                return BadRequest(new ProblemDetails{Title = "Task not found"});
            }

            var oldState = CurrentTask.CurrentState;

            CurrentTask.CurrentState = Int32.Parse(newState);

            if(newOrderNumber > CurrentSprint.Tasks.Count) {


                List<int> orderList = new List<int>();
                CurrentSprint.Tasks.OrderBy(t => t.Order).ToList().ForEach((task) => { orderList.Add(task.Order); });


                orderList.Remove(newOrderNumber);
                orderList.Add(newOrderNumber);

                var index = 0;
                CurrentSprint.Tasks.OrderBy(t => t.Order).ToList().ForEach((task) => { task.Order = orderList[index]; index++; });
                
            } else if(newOrderNumber != CurrentTask.Order) {

                List<int> orderList = new List<int>();
                CurrentSprint.Tasks.OrderBy(t => t.Order).ToList().ForEach((task) => { orderList.Add(task.Order); });


                orderList.Remove(newOrderNumber);
                orderList.Insert(CurrentTask.Order, newOrderNumber);

                var index = 0;
                CurrentSprint.Tasks.OrderBy(t => t.Order).ToList().ForEach((task) => { task.Order = orderList[index]; index++; });
            }

            var result = await _context.SaveChangesAsync() > 0;

            if(result) {
                var logResult = await LogUserAction("Task \"" + CurrentTask.Name + "\" changed from state \"" + getStateString(oldState) + "\" to \"" + getStateString(CurrentTask.CurrentState) + "\"", userId, CurrentBoard.BoardEntityId);
                if (logResult) return CreatedAtRoute("GetSprintById", new { sprintId = sprintId, boardId = boardId, userId = userId }, _mapper.Map<SprintDto>(CurrentSprint));
                return BadRequest(new ProblemDetails{Title = "Problem logging user data"});

            }

            return BadRequest(new ProblemDetails{Title = "Problem changing task state"});

        }

        [HttpPatch("{userId}/boards/{boardId}/sprints/{sprintId}/tasks/{taskId}/changeTaskFocused")]
        public async Task<ActionResult> ChangeTaskFocused(string userId, string boardId, string sprintId, string taskId) {
            var CurrentUser = await RetrieveUserEntity(userId);

            var CurrentBoard = CurrentUser.Boards.Where(b => b.BoardEntityId == boardId).FirstOrDefault();

            var CurrentSprint = CurrentBoard.Sprints.Where(s => s.SprintEntityId == sprintId).FirstOrDefault();

            var CurrentTask = CurrentSprint.Tasks.Where(t => t.TaskEntityId == taskId).FirstOrDefault();

            CurrentTask.Focused = !CurrentTask.Focused;

            var result = await _context.SaveChangesAsync() > 0;

            if(result) {
                var logResult = false;
                if(CurrentTask.Focused) {
                    logResult = await LogUserAction("Task \"" + CurrentTask.Name + "\" moved to today's tasks.", userId, CurrentBoard.BoardEntityId);
                } else {
                    logResult = await LogUserAction("Task \"" + CurrentTask.Name + "\" removed from today's tasks.", userId, CurrentBoard.BoardEntityId);
                }

                if (logResult) return Ok();
                return BadRequest(new ProblemDetails{Title = "Problem logging user data"});
            }

            return BadRequest(new ProblemDetails{Title = "Problem changing task focused state"});


        }

        

        // Delete a task from a milestone
        [HttpDelete("{userId}/boards/{boardId}/milestones/{milestoneId}/sprints/{sprintId}/tasks/{taskId}/deleteTaskFromMilestone", Name = "DeleteTaskFromMilestone")]
        public async Task<ActionResult> DeleteTaskFromMilestone(string userId, string boardId, string sprintId, string taskId, string milestoneId) {

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

            CurrentMilestone.Tasks.Remove(CurrentTask);


            var result = await _context.SaveChangesAsync() > 0;

            if(result) {
                var logResult = await LogUserAction("Task \"" + CurrentTask.Name + "\" deleted from milestone \"" + CurrentBoard.Name + "\"", userId, CurrentBoard.BoardEntityId);
                if (logResult) return Ok();
                return BadRequest(new ProblemDetails{Title = "Problem logging user data"});
            }

            return BadRequest(new ProblemDetails{Title = "Problem deleting task from milestone"});

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
                var logResult = await LogUserAction("Subtask \"" + MappedSubtask.Details + "\" added to task \"" + CurrentTask.Name + "\"", userId, CurrentBoard.BoardEntityId);
                if (logResult) return CreatedAtRoute("GetTaskById", new { sprintId = sprintId, boardId = boardId, userId = userId, taskId = taskId }, _mapper.Map<TaskDto>(CurrentTask));
                return BadRequest(new ProblemDetails{Title = "Problem logging user data"});
            }

            return BadRequest(new ProblemDetails{Title = "Problem saving new task"});
        }

        [HttpDelete("{userId}/boards/{boardId}/deleteBoard", Name = "DeleteBoard")]
        public async Task<ActionResult> DeleteBoard(string userId, string boardId) {
            var CurrentUser = await RetrieveUserEntity(userId);

            var BoardToBeDeleted = CurrentUser.Boards.Where(b => b.BoardEntityId == boardId).FirstOrDefault();

            CurrentUser.Boards.Remove(BoardToBeDeleted);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) {
                return Ok();
            } 

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

            if (result) {
                var logResult = await LogUserAction("Task \"" + TaskToBeDeleted.Name + "\" deleted from sprint.", userId, CurrentBoard.BoardEntityId);
                if (logResult) return Ok();
                return BadRequest(new ProblemDetails{Title = "Problem logging user data"});
            }

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

            if (result) {
                var logResult = await LogUserAction("Subtask \"" + SubtaskToBeDeleted.Details + "\" deleted from task \"" + CurrentTask.Name + "\".", userId, CurrentBoard.BoardEntityId);
                if (logResult) return Ok();
                return BadRequest(new ProblemDetails{Title = "Problem logging user data"});
            }

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

            if (result) {
                var logResult = await LogUserAction("Board \"" + CurrentBoard.Name + "\" updated.", userId, CurrentBoard.BoardEntityId);
                if (logResult) return Ok(updateBoardDto);
                return BadRequest(new ProblemDetails{Title = "Problem logging user data"});
            }

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

            if (result) {
                var logResult = await LogUserAction("Task \"" + CurrentTask.Name + "\" updated.", userId, CurrentBoard.BoardEntityId);
                if (logResult) return Ok(updateTaskDto);
                return BadRequest(new ProblemDetails{Title = "Problem logging user data"});
            }

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

            if (result) {
                var logResult = await LogUserAction("Subtask \"" + CurrentSubtask.Details + "\" updated.", userId, CurrentBoard.BoardEntityId);
                if (logResult) return Ok(subTaskDto);
                return BadRequest(new ProblemDetails{Title = "Problem logging user data"});
            }

            return BadRequest(new ProblemDetails { Title = "Problem updating subtask" });


        }

 
        private async Task<UserEntity> RetrieveUserEntity(string userEntityId) {
            return await _context.Users.Where(u => u.Id == userEntityId)
            .Include(b => b.Boards).ThenInclude(u => u.Sprints).ThenInclude(s => s.Tasks).ThenInclude(t => t.SubTasks)
            .Include(b => b.Boards).ThenInclude(u => u.Sprints).ThenInclude(s => s.Tasks).ThenInclude(t => t.Milestones)
            .Include(b => b.Boards).ThenInclude(m => m.Milestones).ThenInclude(t => t.Tasks)
            .Include(b => b.Boards).ThenInclude(b => b.ActivityEvents)
            .Include(b => b.Boards).ThenInclude(g => g.Goals)
            .FirstOrDefaultAsync();
        }

        private async Task<bool> LogUserAction(string message, string userId, string boardId) {
            var CurrentUser = await RetrieveUserEntity(userId);

            if(CurrentUser == null) return false;

            var CurrentBoard = CurrentUser.Boards.Where(b => b.BoardEntityId == boardId).FirstOrDefault();

            if(CurrentBoard == null) return false;

            var newActivityEvent = new ActivityEventDto {
                ActivityEventEntityId = Guid.NewGuid().ToString(),
                Message = message,
                Date = DateTime.Today.ToString("ddd MMM dd yyyy"),
                Time = DateTime.Now.ToLongTimeString(),
                UserId = userId,
                UserName = CurrentUser.FirstName + " " + CurrentUser.LastName
            };

            var mappedNewActivityEvent = _mapper.Map<ActivityEventEntity>(newActivityEvent);

            CurrentBoard.ActivityEvents.Add(mappedNewActivityEvent);

            var result = await _context.SaveChangesAsync() > 0;

            if(result) return true;

            return false;

        }

        private string getStateString(int state) {
            if(state == 0) {
                return "Incomplete";
            }
            if(state == 1) {
                return "In-Progress";
            }

            return "Completed";
        }



    }
}