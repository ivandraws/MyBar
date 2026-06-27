package ufpi.ivangusthavo.mybar.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import ufpi.ivangusthavo.mybar.model.RegisterDTO;
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

    public Usuario criarUsuario(RegisterDTO data){
        String senhaCriptografada = new BCryptPasswordEncoder().encode(data.password());
        Usuario usuario = new Usuario(
                data.codigo(),
                data.nome(),
                data.login(),
                senhaCriptografada,
                data.role()
        );
        return repository.save(usuario);

    }

    public Usuario editarUsuario(RegisterDTO data){
        String senhaCriptografada = new BCryptPasswordEncoder().encode(data.password());
        Usuario usuario = new Usuario(
                data.codigo(),
                data.nome(),
                data.login(),
                senhaCriptografada,
                data.role()
        );
        return repository.save(usuario);
    }

    public Boolean excluirUsuario(Integer id){
        repository.deleteById(id);
        return true;
    }

}
