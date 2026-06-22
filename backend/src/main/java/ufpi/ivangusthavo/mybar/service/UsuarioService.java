package ufpi.ivangusthavo.mybar.service;

import org.springframework.stereotype.Service;
import ufpi.ivangusthavo.mybar.model.Usuario;
import ufpi.ivangusthavo.mybar.repository.InterfaceUsuario;

import java.util.List;

@Service
public class UsuarioService {
    private InterfaceUsuario repository;

    public UsuarioService(InterfaceUsuario repository)
    {
        this.repository = repository;
    }

    public List<Usuario> listarUsuario(){
        List<Usuario> lista = repository.findAll();
        return lista;
    }

    public Usuario criarUsuario(Usuario usuario){
        Usuario usuarioNovo = repository.save(usuario);
        return usuarioNovo;
    }

    public Usuario editarUsuario(Usuario usuario){
        Usuario usuarioEditado = repository.save(usuario);
        return usuarioEditado;
    }

    public Boolean excluirUsuario(Integer id){
        repository.deleteById(id);
        return true;
    }

}
