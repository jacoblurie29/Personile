using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class SprintDto
    {
        public string SprintEntityId { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public List<TaskDto> Tasks { get; set; }
    }
}