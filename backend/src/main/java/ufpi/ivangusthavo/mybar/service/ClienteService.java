package ufpi.ivangusthavo.mybar.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ufpi.ivangusthavo.mybar.model.Cliente;
import ufpi.ivangusthavo.mybar.repository.InterfaceCliente; // Lembre de renomear a InterfaceCliente

import java.util.List;

@Service
public class ClienteService {

    @Autowired
    private InterfaceCliente interfaceClienteliente;

    public List<Cliente> listarClientes() {
        return interfaceClienteliente.findAll();
    }

    public Cliente buscarPorId(Long id) {
        return interfaceClienteliente.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado"));
    }

    public Cliente incluirCliente(Cliente cliente) {
        // Verifica se o CPF já está cadastrado para evitar erro 500 do banco
        if (interfaceClienteliente.findByCpf(cliente.getCpf()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Já existe um cliente cadastrado com este CPF.");
        }
        return interfaceClienteliente.save(cliente);
    }

    public Cliente editarCliente(Long id, Cliente clienteAtualizado) {
        Cliente clienteExistente = buscarPorId(id);

        // Atualiza os dados permitidos
        clienteExistente.setNome(clienteAtualizado.getNome());
        clienteExistente.setTelefone(clienteAtualizado.getTelefone());
        clienteExistente.setSexo(clienteAtualizado.getSexo());
        // Obs: Não atualizamos o CPF, pois o documento diz que é alterável apenas na inclusão.

        return interfaceClienteliente.save(clienteExistente);
    }

    public void deletarCliente(Long id) {
        Cliente cliente = buscarPorId(id);

        // TODO: Futuramente, verificar se o cliente tem contas atreladas antes de deletar
        // Se tiver, lançar um erro ou fazer soft delete

        interfaceClienteliente.delete(cliente);
    }
}