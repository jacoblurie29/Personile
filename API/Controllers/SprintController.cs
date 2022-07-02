using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    public class SprintController : BaseApiController
    {
        private readonly PersonileContext _context;
        private readonly IMapper _mapper;

        public SprintController(PersonileContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
            
        }

        // Gets the sprint structure for a specific sprint id
        [HttpGet("{sprintId}", Name = "GetSprintById")]
        public async Task<ActionResult<SprintDto>> GetSprintById(string sprintId) {

            var CurrentSprintEntity = await _context.Sprints.Where(s => s.SprintEntityId == sprintId).Include(s => s.Tasks).ThenInclude(t => t.SubTasks).FirstOrDefaultAsync();

            return CurrentSprintEntity.mapSprintToDto();

        }

        // Gets the tast structure for a specific sprint + task id
        [HttpGet("{sprintId}/getTask/{taskId}", Name = "GetTaskById")]
        public async Task<ActionResult<TaskDto>> GetTaskById(string sprintId, string taskId) {
            
            var CurrentSprint = await RetrieveSprintEntity(sprintId);

            var CurrentTaskEntity = CurrentSprint.Tasks.Where(x => x.TaskEntityId == taskId).FirstOrDefault();

            if(CurrentTaskEntity == null) {
                return BadRequest(new ProblemDetails{Title = "Task not found"});
            }
            return CurrentTaskEntity.mapTaskToDto();

        }


        // Gets the titles of all sprints
        [HttpGet("titles")]
        public async Task<ActionResult<List<string>>> GetSprintTitles() {
            return await _context.Sprints.Select(t => t.SprintEntityId).Distinct().ToListAsync();
        }
        

        // add a new sprint (not sure if I'm going to need this)
        [HttpPost("addSprint")]
        public async Task<ActionResult<SprintEntity>> AddNewSprint(SprintDto sprintDto) {

            var MappedSprint = _mapper.Map<SprintEntity>(sprintDto);

            _context.Sprints.Add(MappedSprint); 

            var result = await _context.SaveChangesAsync() > 0;

            if (result) {
                return CreatedAtRoute("GetSprintById", new { sprintId = MappedSprint.SprintEntityId }, MappedSprint.mapSprintToDto());
            }

            return BadRequest(new ProblemDetails{Title = "Problem creating new sprint"});
        }


        // Adds a task to a specific sprint
        [HttpPost("{sprintId}/addTask", Name = "AddTaskToSprint")]
        public async Task<ActionResult<TaskEntity>> AddTaskToSprint(string sprintId, TaskDto taskDto) {

            var MappedTask = _mapper.Map<TaskEntity>(taskDto);

            var CurrentSprint = await RetrieveSprintEntity(sprintId);

            if (CurrentSprint == null) {
                return BadRequest(new ProblemDetails{Title = "Sprint not found"});
            }

            CurrentSprint.AddTask(MappedTask);

            var result = await _context.SaveChangesAsync() > 0;

            if(result) {
                return CreatedAtRoute("GetSprintById", new { sprintId = sprintId }, CurrentSprint.mapSprintToDto());
            }

            return BadRequest(new ProblemDetails{Title = "Problem saving new task"});

        }


        // Adds a subtask to a specific task
        [HttpPost("{sprintId}/tasks/{taskId}/addSubTask", Name = "AddSubtaskToTask")]
        public async Task<ActionResult<SubTaskEntity>> AddNewSubtask(string sprintId, string taskId, SubTaskDto subTaskDto) {
            var MappedSubtask = _mapper.Map<SubTaskEntity>(subTaskDto);

            var CurrentTask = await RetrieveTaskEntity(sprintId, taskId);

            CurrentTask.AddSubtask(MappedSubtask);

            var result = await _context.SaveChangesAsync() > 0;

            if(result) {
                return CreatedAtRoute("GetTaskById", new { sprintId = sprintId, taskId = taskId }, MappedSubtask.mapSubtaskToDto());
            }

            return BadRequest(new ProblemDetails{Title = "Problem saving new task"});
        }

        private async Task<SprintEntity> RetrieveSprintEntity(string sprintEntityId) {
            return await _context.Sprints
                        .Include(t => t.Tasks)
                        .ThenInclude(s => s.SubTasks)
                        .FirstOrDefaultAsync(x => x.SprintEntityId == sprintEntityId);
        }

        private async Task<TaskEntity> RetrieveTaskEntity(string sprintEntityId, string taskEntityId) {
            var CurrentSprint = await _context.Sprints
                        .Include(t => t.Tasks)
                        .ThenInclude(s => s.SubTasks)
                        .FirstOrDefaultAsync(x => x.SprintEntityId == sprintEntityId);

            return CurrentSprint
                    .Tasks
                    .Where(x => x.TaskEntityId == taskEntityId)
                    .FirstOrDefault();
                        
        }

 
    }
}