package ufpi.ivangusthavo.mybar.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ufpi.ivangusthavo.mybar.model.TipoUsuario;
import ufpi.ivangusthavo.mybar.model.Usuario;
import ufpi.ivangusthavo.mybar.repository.InterfaceUsuario;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final InterfaceUsuario repository;
    private final PasswordEncoder passwordEncoder;

    @Value("${api.security.admin.nome:Administrador}")
    private String adminNome;

    @Value("${api.security.admin.email:admin@mybar.com}")
    private String adminEmail;

    @Value("${api.security.admin.senha:admin123}")
    private String adminSenha;

    public DatabaseSeeder(InterfaceUsuario repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (repository.count() == 0) {
            Usuario admin = new Usuario(
                    1,
                    adminNome,
                    adminEmail,
                    passwordEncoder.encode(adminSenha),
                    TipoUsuario.ADMIN
            );
            repository.save(admin);
            System.out.println("Usuário admin padrão criado: " + adminEmail);
        }
    }
}