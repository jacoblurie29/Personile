using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class TaskEntity
    {
        public string TaskEntityId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Links { get; set; }
        public string DateCreated { get; set; }
        public string DateFinished { get; set; }
        public string DueDate { get; set; }
        public int CurrentState { get; set; }
        public string Tags { get; set; }
        public int Effort { get; set; }
        public int Color { get; set; }
        public int Order { get; set; }
        public List<SubTaskEntity> SubTasks { get; set; }
        public SprintEntity SprintEntity { get; set; }
        public string SprintEntityId { get; set; }
        public List<MilestoneEntity> Milestones { get; set; }


        public void AddSubtask(SubTaskEntity subTaskEntity) {
            if (SubTasks.All(subTask => subTask.SubTaskEntityId != subTaskEntity.SubTaskEntityId)) {
                SubTasks.Add(subTaskEntity);
            }
        }
        
    }
}