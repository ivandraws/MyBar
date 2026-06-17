package ufpi.ivangusthavo.mybar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ufpi.ivangusthavo.mybar.dao.InterfaceUsuario;
import ufpi.ivangusthavo.mybar.model.Usuario;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/usuario")
@CrossOrigin("*")
public class UsuarioController {

    @Autowired
    private InterfaceUsuario dao;

    @GetMapping
    public List<Usuario> listarUsuarios() {
        List<Usuario> todos = (List<Usuario>) dao.findAll();
        return todos;
    }

    @PostMapping
    public Usuario criarUsuario(@RequestBody Usuario usu)
    {
        Usuario novo = dao.save(usu);
        return novo;
    }
    @PutMapping
    public Usuario editarUsuario(@RequestBody Usuario usu)
    {
        Usuario novo = dao.save(usu);
        return novo;
    }
    @DeleteMapping("/{id}")
    public Optional<?> removerUsuario(@PathVariable Integer id)
    {
        Optional<Usuario> usu = dao.findById(id);
        dao.deleteById(id);
        return usu;
    }
}
