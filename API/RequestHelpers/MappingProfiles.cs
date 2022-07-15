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
            CreateMap<UpdateTaskDto, TaskEntity>();
        }
    }
}