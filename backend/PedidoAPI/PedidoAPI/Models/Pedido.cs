using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.CompilerServices;


namespace PedidoAPI.Models
{
    [Table("Pedidos")]
    public class Pedido
    {
        
        [Key]
        public int pedidoId { get; set; }
       
       
        [StringLength(100, ErrorMessage = "O nome do produto não pode exceder 100 caracteres.")]
        public string? nome_produto { get; set; }
        
        
        [Column(TypeName = "decimal(10,2)")]
        
        public decimal valor { get; set; }
      
       
        public DateOnly data_vencimento { get; set; }

        public bool desconto_aplicado { get; set; }
        
        public float valor_desconto { get; set; }
    }
}
