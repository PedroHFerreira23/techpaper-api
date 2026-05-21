using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechPaperAPI.Data;
using TechPaperAPI.Models;

namespace TechPaperAPI.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class FornecedoresController : ControllerBase {
        private readonly AppDbContext _ctx;
        public FornecedoresController(AppDbContext ctx) { _ctx = ctx; }

        [HttpGet] 
        public async Task<ActionResult> Get() => Ok(await _ctx.Fornecedores.ToListAsync());

        [HttpGet("{id}")] 
        public async Task<ActionResult> GetById(int id) => Ok(await _ctx.Fornecedores.FindAsync(id));

        [HttpPost] 
        public async Task<ActionResult> Post(Fornecedor f) { 
            _ctx.Fornecedores.Add(f); 
            await _ctx.SaveChangesAsync(); 
            return Ok(); 
        }

        // CORREÇÃO: Método PUT com sincronização de ID para Fornecedores
        [HttpPut("{id}")] 
        public async Task<ActionResult> Put(int id, Fornecedor f) { 
            f.Id = id; 
            _ctx.Entry(f).State = EntityState.Modified; 
            await _ctx.SaveChangesAsync(); 
            return Ok(); 
        }

        [HttpDelete("{id}")] 
        public async Task<ActionResult> Delete(int id) { 
            var f = await _ctx.Fornecedores.FindAsync(id); 
            if (f != null) {
                _ctx.Fornecedores.Remove(f); 
                await _ctx.SaveChangesAsync(); 
            }
            return Ok(); 
        }
    }
}