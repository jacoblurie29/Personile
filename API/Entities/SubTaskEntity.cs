using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class SubTaskEntity
    {
        public string Id { get; set; }
        public string SprintId { get; set; }
        public string Status { get; set; }
        public string Details { get; set; }
    }
}