package ufpi.ivangusthavo.mybar.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ufpi.ivangusthavo.mybar.dao.InterfaceCliente;

@RestController
@RequestMapping("/clientes")
@CrossOrigin("*")
public class ClienteController {
    @Autowired
    private InterfaceCliente dao;
}
