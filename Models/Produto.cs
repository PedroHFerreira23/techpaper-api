namespace TechPaperAPI.Models {
    public class Produto {
        public int Id { get; set; }
        public string Sku { get; set; } = string.Empty;
        public string Nome { get; set; } = string.Empty;
        public string Categoria { get; set; } = string.Empty;
        public string Fornecedor { get; set; } = string.Empty;
        public decimal PrecoCusto { get; set; }
        public decimal PrecoVenda { get; set; }
        public int Estoque { get; set; }
        public DateTime DataCriacao { get; set; } // Nova coluna adicionada
    }
}