using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class ActivityEventEntity
    {
        public string ActivityEventEntityId { get; set; }
        public string Message { get; set; }
        public string Date { get; set; }
        public string Time { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public BoardEntity BoardEntity { get; set; }
        public string BoardEntityId { get; set; }
    }
}