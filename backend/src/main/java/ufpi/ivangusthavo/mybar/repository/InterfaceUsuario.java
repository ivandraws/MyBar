package ufpi.ivangusthavo.mybar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import ufpi.ivangusthavo.mybar.model.Usuario;
import java.util.Optional;


public interface InterfaceUsuario extends JpaRepository<Usuario, Integer> {
    UserDetails findByEmail(String email);
    Optional<Usuario> findByCodigo(int codigo);
}
