﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using PedidoAPI.Context;

#nullable disable

namespace PedidoAPI.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20250127140855_initial")]
    partial class initial
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            MySqlModelBuilderExtensions.AutoIncrementColumns(modelBuilder);

            modelBuilder.Entity("PedidoAPI.Models.Pedido", b =>
                {
                    b.Property<int>("pedidoId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("pedidoId"));

                    b.Property<DateOnly>("data_vencimento")
                        .HasColumnType("date");

                    b.Property<bool>("desconto_aplicado")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("nome_produto")
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<decimal>("valor")
                        .HasColumnType("decimal(10,2)");

                    b.Property<float>("valor_desconto")
                        .HasColumnType("float");

                    b.HasKey("pedidoId");

                    b.ToTable("Pedidos");
                });
#pragma warning restore 612, 618
        }
    }
}
