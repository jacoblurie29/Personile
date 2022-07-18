using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class MilestoneDto
    {
        public string MilestoneEntityId { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string DueDate { get; set; }
        public Boolean HardDeadline { get; set; }
        public string AssociatedTaskIds { get; set; }
        public string CompletedDate { get; set; }
    }
}