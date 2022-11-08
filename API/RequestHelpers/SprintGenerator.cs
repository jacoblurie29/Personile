using System;
using System.Collections.Generic;
using System.Globalization;
using API.DTOs;

namespace API.RequestHelpers
{
    public static class SprintGenerator
    {
        public static List<SprintDto> generateSprints(this BoardDto boardDto) {

            /* 
                TODO: GENERATE SPRINTS BASED ON SPRINT LENGTH SELECTED 

                TWO ROADS HERE: End date or no date

                END DATE: GENERATE ALL SPRINTS (WILL WORK ON EXTREME CASES LATER)

                NO END DATE: GENERATE FIRST 10 SPRINTS (WILL WORK ON GENERATION LATER)

                Will abstract these later

                Based on sprint length - use a while loop and continually generate sprints until the end date is passed or the number of sprints is = 10

                For adding sprints, three cases:

                EVEN: Evenly distribute the overflow days (no idea how this is going to work yet)

                START: Tack on days to the first sprint (use modulo)

                END: Tack on days to last sprint (if days left is less than 2 * sprint length, add all days)
            
            */

            var stringStartDate = boardDto.StartDate.Substring(0, 15);
            var startDate = DateTime.ParseExact(stringStartDate,
                                  "ddd MMM dd yyyy",
                                  CultureInfo.InvariantCulture);
                           
            var sprintLength = boardDto.SprintDaysLength;
            var overflow = boardDto.HandleOverflow;

            var sprintList = new List<SprintDto>();


            
            if(boardDto.EndDate == "") {
                
                var totalDays = sprintLength * 10;

                var currentDate = startDate;

                while (totalDays > 0) {
                    

                    var sprint = new SprintDto {
                        SprintEntityId = Guid.NewGuid().ToString(),
                        StartDate = currentDate.ToString("ddd MMM dd yyyy"),
                        EndDate = currentDate.AddDays(sprintLength - 1).ToString("ddd MMM dd yyyy"),
                        Tasks = new List<TaskDto>(),
                    };

                    sprintList.Add(sprint);

                    currentDate = currentDate.AddDays(sprintLength);
                    totalDays -= sprintLength;
    
                }

            } else {
                
                // end date (as number)
                var stringEndDate = boardDto.EndDate.Substring(0, 15);
                var endDate = DateTime.ParseExact(stringEndDate,
                                  "ddd MMM dd yyyy",
                                  CultureInfo.InvariantCulture);
                
                // total days of board
                var totalDays = (endDate - startDate).Days;

                // overflow days
                var overflowDays = totalDays % sprintLength;

                // current date placeholder (will move with calculation)
                var currentDate = startDate;

                while (totalDays > 0) {
                    
                    // value to be added to sprint if it gets extra days
                    var overflowAddition = 0;
                    if(overflow == "start" && currentDate == startDate) {
                        overflowAddition = overflowDays;
                    } else if(overflow == "end" && (endDate - currentDate).Days <= sprintLength * 2) {
                        overflowAddition = overflowDays;
                    }

                    // build sprint object
                    var sprint = new SprintDto {
                        SprintEntityId = Guid.NewGuid().ToString(),
                        StartDate = currentDate.ToString("ddd MMM dd yyyy"),
                        EndDate = currentDate.AddDays((sprintLength - 1) + overflowAddition).ToString("ddd MMM dd yyyy"),
                        Tasks = new List<TaskDto>(),
                    };

                    // add sprint to list
                    sprintList.Add(sprint);
    
                    // update currentDate and total days left to be allocated
                    if(overflow == "start" && currentDate == startDate) {
                        currentDate = currentDate.AddDays(sprintLength + overflowDays);
                        totalDays -= sprintLength + overflowDays;
                    } else if(overflow == "end" && (endDate - currentDate).Days <= sprintLength * 2) {
                        currentDate = currentDate.AddDays(sprintLength + overflowDays);
                        totalDays -= sprintLength + overflowDays;
                    } else {
                        currentDate = currentDate.AddDays(sprintLength);
                        totalDays -= sprintLength;
                    }

                    
                }
            }

            return sprintList;
        }
    }
}