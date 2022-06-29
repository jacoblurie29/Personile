using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class TaskDto
    {
         public string Id { get; set; }
        public string UserId { get; set; }
        public string SprintId { get; set; }
        public string GroupId { get; set; }
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