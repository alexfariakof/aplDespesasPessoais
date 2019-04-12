﻿using Microsoft.EntityFrameworkCore;

namespace apiDespesasPessoais.Model.Context
{
    public class SqlServerContext : DbContext
    {
        public SqlServerContext()
        {

        }

        public SqlServerContext(DbContextOptions<SqlServerContext> options) : base(options)
        {

        }

        public DbSet<Usuario> Usuario { get; set; }
    }
}