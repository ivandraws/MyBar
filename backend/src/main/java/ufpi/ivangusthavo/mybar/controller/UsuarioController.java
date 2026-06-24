package ufpi.ivangusthavo.mybar.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ufpi.ivangusthavo.mybar.model.Usuario;
import ufpi.ivangusthavo.mybar.service.UsuarioService;

import java.util.List;


@RestController
@RequestMapping("/usuario")
@CrossOrigin("*")
public class UsuarioController {

    private UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        return ResponseEntity.status(200).body(usuarioService.listarUsuario());
    }

    @PostMapping
    public ResponseEntity<Usuario> criarUsuario(@RequestBody Usuario usu)
    {
        return ResponseEntity.status(201).body(usuarioService.criarUsuario(usu));
    }
    @PutMapping
    public ResponseEntity<Usuario> editarUsuario(@RequestBody Usuario usu)
    {
        return ResponseEntity.status(201).body(usuarioService.editarUsuario(usu));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> removerUsuario(@PathVariable Integer id)
    {
        usuarioService.excluirUsuario(id);
        return ResponseEntity.status(204).build();
    }
}
