package ufpi.ivangusthavo.mybar.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ufpi.ivangusthavo.mybar.repository.InterfaceCliente;
import ufpi.ivangusthavo.mybar.model.Cliente;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/clientes")
@CrossOrigin("*")
public class ClienteController {
    @Autowired
    private InterfaceCliente dao;

    @GetMapping
    public ResponseEntity<List<Cliente>> listarClientes()
    {
        List<Cliente> todos = (List<Cliente>) dao.findAll();
        return ResponseEntity.status(200).body(todos);
    }

    @PostMapping
    public ResponseEntity<Cliente> incluirCliente(@RequestBody Cliente cliente){
        Cliente novo = dao.save(cliente);
        return ResponseEntity.status(201).body(novo);
    }

    @PutMapping
    public ResponseEntity<Cliente> editarCliente(@RequestBody Cliente cli)
    {
        Cliente novo = dao.save(cli);
        return ResponseEntity.status(201).body(novo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarCliente(@PathVariable Long id)
    {

        dao.deleteById(id);
        return ResponseEntity.status(204).build();
    }
    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<Cliente> buscarPorCpf(@PathVariable String cpf) {
        return dao.findByCpf(cpf)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
