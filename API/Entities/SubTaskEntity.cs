using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class SubTaskEntity
    {
        public string SubTaskEntityId { get; set; }
        public string Status { get; set; }
        public string Details { get; set; }
        public TaskEntity TaskEntity { get; set; }
        public string TaskEntityId { get; set; }
    }
}