using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    public class SprintController : BaseApiController
    {
        private readonly PersonileContext _context;

        public SprintController(PersonileContext context)
        {
            _context = context;
            
        }

        // Gets the sprint structure for a specific sprint id
        [HttpGet("{sprintId}")]
        public async Task<ActionResult<SprintDto>> GetSprintById(string sprintId) {

            var sprint = await _context.Sprints.Where(s => s.SprintEntityId == sprintId).Include(s => s.Tasks).ThenInclude(t => t.SubTasks).FirstOrDefaultAsync();

            return sprint.mapSprintToDto();

        }


        // Gets the titles of all sprints
        [HttpGet("titles")]
        public async Task<ActionResult<List<string>>> GetSprintTitles() {
            return await _context.Sprints.Select(t => t.SprintEntityId).Distinct().ToListAsync();
        }

/*
        // Adds a task to a specific sprint
        [HttpPost("{sprintId}")]
        public async Task<ActionResult<Task>> AddTaskToSprint(TaskDto taskDto) {

        }
*/
 
    }
}