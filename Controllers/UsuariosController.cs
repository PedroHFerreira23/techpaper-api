using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechPaperAPI.Data;
using TechPaperAPI.Models;

namespace TechPaperAPI.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase {
        private readonly AppDbContext _ctx;

        public UsuariosController(AppDbContext ctx) { 
            _ctx = ctx; 
        }

        [HttpGet] 
        public async Task<ActionResult> Get() {
            return Ok(await _ctx.Usuarios.ToListAsync());
        }

        [HttpPost] 
        public async Task<ActionResult> Post(Usuario u) {
            var usuarioExistente = await _ctx.Usuarios
                .FirstOrDefaultAsync(x => EF.Functions.Collate(x.Login, "utf8mb4_bin") == u.Login);

            if (usuarioExistente != null) {
                return BadRequest(new {
                    message = "Já existe um usuário cadastrado com este e-mail."
                });
            }

            u.DataCriacao = DateTime.Now;

            _ctx.Usuarios.Add(u); 
            await _ctx.SaveChangesAsync(); 

            return Ok(new {
                message = "Usuário cadastrado com sucesso."
            }); 
        }

        [HttpPut("{id}")] 
        public async Task<ActionResult> Put(int id, Usuario u) {
            var usuario = await _ctx.Usuarios.FindAsync(id);

            if (usuario == null) {
                return NotFound(new {
                    message = "Usuário não encontrado."
                });
            }

            usuario.Name = u.Name;
            usuario.Login = u.Login;
            usuario.Password = u.Password;
            usuario.Role = u.Role;

            await _ctx.SaveChangesAsync(); 

            return Ok(new {
                message = "Usuário atualizado com sucesso."
            }); 
        }

        [HttpDelete("{id}")] 
        public async Task<ActionResult> Delete(int id) {
            var u = await _ctx.Usuarios.FindAsync(id); 

            if (u == null) {
                return NotFound(new {
                    message = "Usuário não encontrado."
                });
            }

            _ctx.Usuarios.Remove(u); 
            await _ctx.SaveChangesAsync();

            return Ok(new {
                message = "Usuário removido com sucesso."
            }); 
        }
[HttpPost("login")]
public async Task<ActionResult> Login(Usuario login) {
    if (string.IsNullOrWhiteSpace(login.Login) || string.IsNullOrWhiteSpace(login.Password)) {
        return BadRequest(new {
            message = "Preencha o e-mail e a senha."
        });
    }

    var user = await _ctx.Usuarios
        .FirstOrDefaultAsync(u => EF.Functions.Collate(u.Login, "utf8mb4_bin") == login.Login);

    if (user == null) {
        return NotFound(new {
            message = "Usuário não encontrado. Verifique o e-mail informado."
        });
    }

    if (user.Password != login.Password) {
        return Unauthorized(new {
            message = "Senha incorreta. Tente novamente."
        });
    }

    return Ok(new {
        message = "Login realizado com sucesso.",
        usuario = new {
            id = user.Id,
            name = user.Name,
            login = user.Login,
            role = user.Role
        }
    });
}
        

    }
}