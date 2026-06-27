package ufpi.ivangusthavo.mybar.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ufpi.ivangusthavo.mybar.model.Usuario;
import ufpi.ivangusthavo.mybar.service.UsuarioService;

import java.util.List;


@RestController
@RequestMapping("/usuarios")
@CrossOrigin("*")
public class UsuarioController {


    @Autowired
    private UsuarioService usuarioService;


    @GetMapping
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        return ResponseEntity.status(200).body(usuarioService.listarUsuario());
    }

    @PostMapping
    public ResponseEntity<Usuario> criarUsuario(@RequestBody RegisterDTO user)
    {
        return ResponseEntity.status(201).body(usuarioService.criarUsuario(user));
    }
    @PutMapping
    public ResponseEntity<Usuario> editarUsuario(@RequestBody RegisterDTO user)
    {
        return ResponseEntity.ok(usuarioService.editarUsuario(user));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> removerUsuario(@PathVariable Integer id)
    {
        usuarioService.excluirUsuario(id);
        return ResponseEntity.status(204).build();
    }
}
