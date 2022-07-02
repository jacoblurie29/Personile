using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.RequestHelpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<SprintDto, SprintEntity>();
            CreateMap<TaskDto, TaskEntity>();
            CreateMap<SubTaskDto, SubTaskEntity>();
            
        }
    }
}