package ufpi.ivangusthavo.mybar.controller;


import org.springframework.beans.factory.annotation.Autowired;
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
    public List<Cliente> listarClientes()
    {
        List<Cliente> todos = (List<Cliente>) dao.findAll();
        return todos;
    }

    @PostMapping
    public Cliente incluirCliente(@RequestBody Cliente cliente){
        Cliente novo = dao.save(cliente);
        return novo;
    }

    @PutMapping
    public Cliente editarCliente(@RequestBody Cliente cli)
    {
        Cliente novo = dao.save(cli);
        return novo;
    }

    @DeleteMapping("/{id}")
    public Optional<Cliente> deletarCliente(@PathVariable Integer id)
    {
        Optional<Cliente> cli = dao.findById(id);
        dao.deleteById(id);
        return cli;
    }
}
