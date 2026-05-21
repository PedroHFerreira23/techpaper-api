namespace TechPaperAPI.Models {
    public class Usuario {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Login { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = "Operador";
        public DateTime DataCriacao { get; set; } // Nova coluna adicionada
    }
}