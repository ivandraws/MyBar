package ufpi.ivangusthavo.mybar.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
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

    public void verificarSenhaGarcom(String codigoStr, String senha) {
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
