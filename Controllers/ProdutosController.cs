using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechPaperAPI.Data;
using TechPaperAPI.Models;

namespace TechPaperAPI.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class ProdutosController : ControllerBase {
        private readonly AppDbContext _ctx;
        public ProdutosController(AppDbContext ctx) { _ctx = ctx; }

        // 1. LISTAR TODOS
        [HttpGet] 
        public async Task<ActionResult> Get() => Ok(await _ctx.Produtos.ToListAsync());
        
        // 2. BUSCAR UM PRODUTO ESPECÍFICO (Para preencher o modal de edição)
        [HttpGet("{id}")] 
        public async Task<ActionResult> GetById(int id) => Ok(await _ctx.Produtos.FindAsync(id));
        
        // 3. CADASTRAR
        [HttpPost] 
        public async Task<ActionResult> Post(Produto p) { 
            _ctx.Produtos.Add(p); 
            await _ctx.SaveChangesAsync(); 
            return Ok(); 
        }

        // 4. ATUALIZAR / EDITAR (O método que estava faltando!)
        [HttpPut("{id}")] 
        public async Task<ActionResult> Put(int id, Produto p) { 
            p.Id = id; // Garante que a edição vai para a linha correta no banco
            _ctx.Entry(p).State = EntityState.Modified; 
            await _ctx.SaveChangesAsync(); 
            return Ok(); 
        }

        // 5. EXCLUIR
        [HttpDelete("{id}")] 
        public async Task<ActionResult> Delete(int id) { 
            var p = await _ctx.Produtos.FindAsync(id); 
            if (p != null) {
                _ctx.Produtos.Remove(p); 
                await _ctx.SaveChangesAsync(); 
            }
            return Ok(); 
        }
    }
}