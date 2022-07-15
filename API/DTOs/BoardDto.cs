using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class BoardDto
    {
        public string BoardEntityId { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public List<SprintDto> Sprints { get; set; }

    }
}