using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class SprintEntity
    {
        public string SprintEntityId { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public List<TaskEntity> Tasks { get; set; }
        public string UserId { get; set; }
        public UserEntity User { get; set; }

        public void AddTask(TaskEntity taskEntity) {
            if (Tasks.All(task => task.TaskEntityId != taskEntity.TaskEntityId)) {
                Tasks.Add(taskEntity);
            }
        }
    }
}