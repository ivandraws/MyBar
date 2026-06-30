package ufpi.ivangusthavo.mybar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ufpi.ivangusthavo.mybar.model.RegisterDTO;
import ufpi.ivangusthavo.mybar.model.Usuario;
import ufpi.ivangusthavo.mybar.model.UsuarioResponseDTO;
import ufpi.ivangusthavo.mybar.service.UsuarioService;

import java.util.List;


@RestController
@RequestMapping("/usuario")
@CrossOrigin("*")
public class UsuarioController {


    @Autowired
    private UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService){
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listarUsuarios() {
        List<UsuarioResponseDTO> lista = usuarioService.listarUsuario()
                .stream()
                .map(u -> new UsuarioResponseDTO(u.getCodigo(), u.getNome(), u.getEmail(), u.getTipo()))
                .toList();
        return ResponseEntity.ok(lista);
    }
    @PostMapping
    public ResponseEntity<Usuario> criarUsuario(@RequestBody RegisterDTO user)
    {
        return ResponseEntity.status(201).body(usuarioService.criarUsuario(user));
    }
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> editarUsuario(@PathVariable Integer id, @RequestBody RegisterDTO user)
    {
        return ResponseEntity.ok(usuarioService.editarUsuario(id, user));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> removerUsuario(@PathVariable Integer id)
    {
        usuarioService.excluirUsuario(id);
        return ResponseEntity.status(204).build();
    }
}
