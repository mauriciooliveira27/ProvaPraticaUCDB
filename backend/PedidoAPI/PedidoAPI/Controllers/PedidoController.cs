using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PedidoAPI.Context;
using PedidoAPI.Models;
using Microsoft.EntityFrameworkCore;
using PedidoAPI.Functions;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.JsonPatch.Adapters;
using Microsoft.AspNetCore.JsonPatch.Operations;


namespace PedidoAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PedidoController : ControllerBase 
{
    public readonly AppDbContext _context;
    public PedidoController(AppDbContext context)
    {   
        _context = context;
    }
    
    [HttpGet]
    public ActionResult<IEnumerable<Pedido>> Get()
    {
        var pedidos = _context.Pedidos.ToList();
        if (pedidos is null )
        {
            return NotFound();
        }

        return Ok(pedidos);
    }

    [HttpGet("{id:int}", Name ="ObterPedido")]
    public ActionResult<Pedido> Get(int id)
    {
        var pedido = _context.Pedidos.FirstOrDefault(p => p.pedidoId == id);

        if (pedido is null)
        {
            return NotFound();
        }
        return Ok(pedido);
    }

    [HttpPost]
    public ActionResult Post(Pedido pedido )
    {

        try
        {
            if(!ModelState.IsValid)
            {
                return BadRequest();
            }

            if (pedido.valor_desconto > (float)pedido.valor )
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Valor de desconto não pode ser maior que o valor de compra."
                });
            }

            pedido = ValidarDesconto.Validar(pedido);
            pedido.valor_desconto = 0;
            _context.Pedidos.Add(pedido);
            _context.SaveChanges();

            return CreatedAtRoute("ObterPedido", new { id = pedido.pedidoId }, pedido);
        }

        catch (Exception ex)
        {

            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                success = false,
                message = "Ocorreu um erro ao processar a solicitação.",
                details = ex.Message
            });

        }
    }

    [HttpPut("{id:int}")]
    public ActionResult<Pedido> put(int id , Pedido pedido)
    {

        try
        {
            if(!ModelState.IsValid)
            {
                return BadRequest();
            }

            if (pedido.valor_desconto > (float)pedido.valor || id != pedido.pedidoId)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Cheque novamente os dados."
                });
            }

            pedido = ValidarDesconto.Validar(pedido);
            _context.Entry(pedido).State = EntityState.Modified;
            _context.SaveChanges();
            return Ok(pedido);

        }

        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                success = false,
                message = "Ocorreu um erro ao processar a solicitação.",
                details = ex.Message
            });

        }

    }
    [HttpPatch("{id:int}")]
    public ActionResult<Pedido> Patch(int id, [FromBody] Pedido pedidoAtualizado)
    {
        // Log para verificar se a requisição está recebendo o corpo correto
        if (pedidoAtualizado == null)
        {
            Console.WriteLine("Erro: pedidoAtualizado é null");
            return BadRequest("Pedido Atualizado não pode ser nulo");
        }

        Console.WriteLine($"Pedido Atualizado: {pedidoAtualizado}");

        var pedido = _context.Pedidos.FirstOrDefault(p => p.pedidoId == id);
        if (pedido == null)
        {
            return NotFound("Pedido não encontrado");
        }

        // Atualiza apenas as propriedades fornecidas (não nulas)
        if (pedidoAtualizado.data_vencimento != default(DateOnly))
        {
            pedido.data_vencimento = pedidoAtualizado.data_vencimento;
        }
        if (pedidoAtualizado.desconto_aplicado != null)
        {
            pedido.desconto_aplicado = pedidoAtualizado.desconto_aplicado;
        }
        if (!string.IsNullOrEmpty(pedidoAtualizado.nome_produto))
        {
            pedido.nome_produto = pedidoAtualizado.nome_produto;
        }
        if (pedidoAtualizado.valor != default(decimal))
        {
            pedido.valor = pedidoAtualizado.valor;
        }
        if (pedidoAtualizado.valor_desconto != default(float))
        {
            pedido.valor_desconto = pedidoAtualizado.valor_desconto;
        }

        // Marca como modificado e salva
        _context.Entry(pedido).State = EntityState.Modified;
        _context.SaveChanges();

        return Ok(pedido);
    }





    [HttpDelete("{id:int}")]
    public ActionResult Delete(int id)
    {
        var pedido = _context.Pedidos.FirstOrDefault(p => p.pedidoId == id);
        if(pedido is null)
        {
            return NotFound();
        }
        _context.Pedidos.Remove(pedido);
        _context.SaveChanges();
        return Ok(pedido);

    }

}
