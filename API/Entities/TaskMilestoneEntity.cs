using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class TaskMilestoneEntity
    {
        public MilestoneEntity MilestoneEntity { get; set; }
        public string MilestoneEntityId { get; set; }
        public TaskEntity TaskEntity { get; set; }
        public string TaskEntityId { get; set; }
    }
}