using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
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

        [HttpGet("{id}")]
        public async Task<ActionResult<List<TaskEntity>>> GetSprint(string id) {

            return await _context.Tasks.Where(t => t.SprintId == id).ToListAsync();

        }

/*
        [HttpGet("{id}/subtasks")]
        public async Task<ActionResult<List<SubTaskEntity>>> GetSubTaskForSprint(string id) {

            return await _context.Tasks.Where()

        }
*/

        [HttpGet("titles")]
        public async Task<ActionResult<List<string>>> GetSprintTitles() {
            return await _context.Tasks.Select(t => t.SprintId).Distinct().ToListAsync();
        }


    }
}