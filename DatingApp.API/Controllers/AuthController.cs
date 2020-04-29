using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
      private readonly IAuthRepository _repo;
      private readonly IConfiguration configuration;
      public AuthController(IAuthRepository repo, IConfiguration config ){
        _repo = repo;
        configuration = config;
        
      }  

      [HttpPost("register")]
      public async Task<IActionResult> Register(UserForRegisterDTO userForDTO)
      {
        // Not needed since using [ApiControler]
        // if(!ModelState.IsValid)
        //   return BadRequest(ModelState);
          //Validate Request
          userForDTO.Username = userForDTO.Username.ToLower();
          if (await _repo.UserExists(userForDTO.Username)){
              return BadRequest("Username already Exists");
          }
          var userToCreate = new User
          {
              Username = userForDTO.Username
          };

          var createdUser = await _repo.Register(userToCreate, userForDTO.Password);
          return StatusCode(201);
      }
    [HttpPost("login")]
    public async Task<IActionResult> Login(UserForLoginDTO userLoginDto){
      var userFromRepo = await _repo.Login(userLoginDto.Username.ToLower(), userLoginDto.Password);
      if(userFromRepo == null) return Unauthorized();

      var claims = new []
      {
        new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),
        new Claim(ClaimTypes.Name, userFromRepo.Username)
      };
      var key = new SymmetricSecurityKey(Encoding.UTF8
        .GetBytes(configuration.GetSection("AppSettings:Token")
        .Value));
      var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
      var tokenDescriptor = new SecurityTokenDescriptor
      {
        Subject = new ClaimsIdentity(claims),
        Expires = DateTime.Now.AddDays(1),
        SigningCredentials = creds
      };
      var tokenHandler = new JwtSecurityTokenHandler();
      var token = tokenHandler.CreateToken(tokenDescriptor);
      return Ok( new {
        token = tokenHandler.WriteToken(token)
      });
    }
    }
}