package ufpi.ivangusthavo.mybar.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import ufpi.ivangusthavo.mybar.repository.InterfaceUsuario;

@Service
public class AuthorizationService implements UserDetailsService {

    @Autowired
    InterfaceUsuario repository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return repository.findByEmail(username);
    }
}
