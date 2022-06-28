using System;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ErrorController : ControllerBase
    {
        [HttpGet("not-found")]
        public ActionResult GetNotFound() {
            return NotFound();
        }

        [HttpGet("bad-request")]
        public ActionResult GetBadRequest() {
            return BadRequest(new ProblemDetails{Title= "Bad request"});
        }

        [HttpGet("unauthorized")]
        public ActionResult GetUnauthorized() {
            return Unauthorized();
        }

        [HttpGet("validation-error")]
        public ActionResult GetValidationError() {
            ModelState.AddModelError("Problem1", "This is the first error");
            ModelState.AddModelError("Problem2", "This is the second error");
            return ValidationProblem();

        }

        [HttpGet("server-error")]
        public ActionResult GetServerError() {
            throw new Exception("Internal server error");
        }
    }
}