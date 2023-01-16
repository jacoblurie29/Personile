using System.Collections.Generic;
using System.Linq;

namespace API.Entities
{
    public class SprintEntity
    {
        public string SprintEntityId { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public List<TaskEntity> Tasks { get; set; }
        public BoardEntity BoardEntity { get; set; }
        public string BoardEntityId { get; set; }

        public void AddTask(TaskEntity taskEntity)
        {
            if (Tasks.All(task => task.TaskEntityId != taskEntity.TaskEntityId))
            {
                Tasks.Add(taskEntity);
            }
        }
    }
}