using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class MilestoneEntity
    {
        public string MilestoneEntityId { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string DueDate { get; set; }
        public Boolean HardDeadline { get; set; }
        public string AssociatedTaskIds { get; set; }
        public string CompletedDate { get; set; }
        public BoardEntity BoardEntity { get; set; }
        public string BoardEntityId { get; set; }
        public List<TaskEntity> Tasks { get; set; }
    }
}