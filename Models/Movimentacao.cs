namespace TechPaperAPI.Models {
    public class Movimentacao {
        public int Id { get; set; }
        public string Tipo { get; set; } = string.Empty;
        public int? ProdutoId { get; set; } // Agora tem o "?" porque o SQL permite INT NULL
        public string ProdutoNome { get; set; } = string.Empty;
        public int Quantidade { get; set; }
        public string Motivo { get; set; } = string.Empty;
        public string Responsavel { get; set; } = string.Empty;
        public string? UsuarioId { get; set; } // Nova coluna permitindo nulo
        public DateTime DataHora { get; set; }
    }
}