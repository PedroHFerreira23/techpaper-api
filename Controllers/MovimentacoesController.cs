using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TechPaperAPI.Data;
using TechPaperAPI.Models;

namespace TechPaperAPI.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class MovimentacoesController : ControllerBase {
        private readonly AppDbContext _ctx;
        public MovimentacoesController(AppDbContext ctx) { _ctx = ctx; }

        [HttpGet] public async Task<ActionResult> Get() => Ok(await _ctx.Movimentacoes.ToListAsync());

        [HttpPost]
        public async Task<ActionResult> Post(Movimentacao mov) {
            var produto = await _ctx.Produtos.FindAsync(mov.ProdutoId);
            if (produto == null) return BadRequest("Produto não existe.");

            if (mov.Tipo == "Saida" || mov.Tipo == "Saída") {
                if (produto.Estoque < mov.Quantidade) return BadRequest("Estoque insuficiente.");
                produto.Estoque -= mov.Quantidade;
            } else {
                produto.Estoque += mov.Quantidade;
            }

            mov.DataHora = DateTime.Now;
            mov.ProdutoNome = produto.Nome;
            _ctx.Movimentacoes.Add(mov);
            await _ctx.SaveChangesAsync();
            return Ok();
        }
    }
}