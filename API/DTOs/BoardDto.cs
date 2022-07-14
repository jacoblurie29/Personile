using System.Collections.Generic;

namespace API.DTOs
{
    public class BoardDto
    {
        public string SprintEntityId { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public List<TaskDto> Tasks { get; set; }
    }
}