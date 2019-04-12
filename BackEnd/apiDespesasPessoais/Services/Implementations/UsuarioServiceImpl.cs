﻿using apiDespesasPessoais.Model;
using apiDespesasPessoais.Model.Context;
using apiDespesasPessoais.Services;
using System;
using System.Collections.Generic;
using System.Linq;

namespace apiDespesasPessoais.Services.Implementations
{
    public class UsuarioServiceImpl : IUsuarioService
    {
        private SqlServerContext _context;

        public UsuarioServiceImpl(SqlServerContext context)
        {
            _context = context;
        }
        public Usuario Create(Usuario usuario)
        {
            try
            {
                _context.Add(usuario);
                _context.SaveChanges();
            }
            catch(Exception ex)
            {
                throw ex;
            }
            return usuario;
        }

        public List<Usuario> FindAll()
        {
            return _context.Usuario.ToList();
        }  
    

        public Usuario FindById(long idUsuario)
        {
            return _context.Usuario.SingleOrDefault(prop => prop.Id.Equals(idUsuario));
        }

        public Usuario Update(Usuario usuario)
        {
            if (!Exist(usuario.Id))
                return new Usuario();

            var result = _context.Usuario.SingleOrDefault(prop => prop.Id.Equals(usuario.Id));            
            try
            {
                _context.Entry(result).CurrentValues.SetValues(usuario);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return usuario;
        }

        public void Delete(long id)
        {
            var result = _context.Usuario.SingleOrDefault(prop => prop.Id.Equals(id));
            try
            {
                if (result != null)
                    _context.Usuario.Remove(result);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private bool Exist(long idUsuario)
        {
            return _context.Usuario.Any(prop => prop.Id.Equals(idUsuario));
        }

    }
}