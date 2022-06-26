using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly PersonileContext _context;

        public TasksController(PersonileContext context)
        {
            _context = context;
            
        }

        [HttpGet]
        public async Task<ActionResult<List<TaskEntity>>> GetTasks() {

            return await _context.Tasks.ToListAsync();


        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskEntity>> GetTask(string id) {

            return await _context.Tasks.FindAsync(id);

        }
    }
}