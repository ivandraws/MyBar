package ufpi.ivangusthavo.mybar.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ufpi.ivangusthavo.mybar.model.RegisterDTO;
import ufpi.ivangusthavo.mybar.model.TipoUsuario;
import ufpi.ivangusthavo.mybar.model.Usuario;
import ufpi.ivangusthavo.mybar.repository.InterfaceUsuario;

import java.util.List;

@Service
public class UsuarioService {
    private InterfaceUsuario repository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    public UsuarioService(InterfaceUsuario repository)
    {
        this.repository = repository;
    }

    public List<Usuario> listarUsuario(){
        List<Usuario> lista = repository.findAll();
        return lista;
    }

    public Usuario criarUsuario(Integer id, RegisterDTO data){
        if (repository.existsById(id)){
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

    public Usuario autenticarGarcom(String codigoStr, String senha) {
        int codigo;
        try {
            codigo = Integer.parseInt(codigoStr);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Código de garçom inválido.");
        }

        Usuario usuario = repository.findByCodigo(codigo)
                .orElseThrow(() -> new IllegalArgumentException("Garçom não encontrado."));

        if (!encoder.matches(senha, usuario.getSenha())) {
            throw new IllegalArgumentException("Senha do garçom inválida.");
        }

        return usuario;
    }

    public void verificarSenhaGarcom(String codigoStr, String senha) {
        autenticarGarcom(codigoStr, senha);
    }

    // Subfluxo do documento — verifica senha do administrador pelo email
    public void verificarSenhaAdmin(String email, String senha) {
        Usuario usuario = (Usuario) repository.findByEmail(email);

        if (usuario == null) {
            throw new IllegalArgumentException("Administrador não encontrado.");
        }

        if (usuario.getTipo() != TipoUsuario.ADMIN) {
            throw new IllegalArgumentException("Usuário não tem permissão de administrador.");
        }

        if (!encoder.matches(senha, usuario.getSenha())) {
            throw new IllegalArgumentException("Senha do administrador inválida.");
        }
    }
}
