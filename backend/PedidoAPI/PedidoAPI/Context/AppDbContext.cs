using Microsoft.EntityFrameworkCore;
using PedidoAPI.Models;

namespace PedidoAPI.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions <AppDbContext> options) : base(options)
        {
        }

        public DbSet<Pedido> Pedidos { get; set; }


    }
}
