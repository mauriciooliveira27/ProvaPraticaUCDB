using PedidoAPI.Models;

namespace PedidoAPI.Functions
{
    public class ValidarDesconto
    {
        public static Pedido Validar(Pedido pedido)
        {
            DateOnly dataVencimento = pedido.data_vencimento;
            DateOnly dataAtual = DateOnly.FromDateTime(DateTime.Now);

            if (dataAtual > dataVencimento)
            {
                pedido.desconto_aplicado = false;
                pedido.valor_desconto = 0;
                return pedido;
            }

            pedido.desconto_aplicado = true;
            return pedido;

        }
    }
}
