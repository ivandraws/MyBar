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
@RequestMapping("/usuarios")
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
    @PostMapping("/{id}")
    public ResponseEntity<Usuario> criarUsuario(@PathVariable Integer id, @RequestBody RegisterDTO user)
    {
        return ResponseEntity.status(201).body(usuarioService.criarUsuario(id,user));
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
