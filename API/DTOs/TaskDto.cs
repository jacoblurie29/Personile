using System;
using System.Collections.Generic;

namespace API.DTOs
{
    public class TaskDto
    {
        public string TaskEntityId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Links { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateFinished { get; set; }
        public DateTime? DueDate { get; set; }
        public int CurrentState { get; set; }
        public string Tags { get; set; }
        public int Effort { get; set; }
        public int Color { get; set; }
        public List<SubTaskDto> SubTasks { get; set; }

    }
}