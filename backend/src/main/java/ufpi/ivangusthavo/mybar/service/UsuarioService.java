package ufpi.ivangusthavo.mybar.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
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
        if (repository.existsById(data.codigo())){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O código de usuário está em uso");
        }
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

    public Usuario editarUsuario(Integer codigo, RegisterDTO data) {
        // 1. Busca o usuário que já existe no banco
        Usuario usuarioExistente = repository.findById(codigo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));

        // 2. Atualiza apenas os dados permitidos
        usuarioExistente.setNome(data.nome());
        usuarioExistente.setEmail(data.login());
        usuarioExistente.setTipo(data.role());

        // 3. Atualiza a senha APENAS se uma nova for fornecida
        if (data.password() != null && !data.password().trim().isEmpty()) {
            String senhaCriptografada = new BCryptPasswordEncoder().encode(data.password());
            usuarioExistente.setSenha(senhaCriptografada);
        }

        return repository.save(usuarioExistente);
    }

    public Boolean excluirUsuario(Integer id){
        repository.deleteById(id);
        return true;
    }

}
