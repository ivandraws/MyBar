package ufpi.ivangusthavo.mybar.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ufpi.ivangusthavo.mybar.model.Conta;
import ufpi.ivangusthavo.mybar.model.StatusConta;
import ufpi.ivangusthavo.mybar.model.TipoUsuario;
import ufpi.ivangusthavo.mybar.model.Usuario;
import ufpi.ivangusthavo.mybar.repository.IConta;
import ufpi.ivangusthavo.mybar.repository.InterfaceCliente;
import ufpi.ivangusthavo.mybar.repository.InterfaceUsuario;

@Service
public class ContaService {

    @Autowired
    private IConta iConta;

    @Autowired
    private InterfaceCliente iCliente;

    @Autowired
    private InterfaceUsuario iUsuario;

    @Transactional
    public Conta abrirConta(Conta novaConta, String senhaGarcom) {

        // 1. Validar se o Garçom existe e se a senha confere
        Usuario garcom = iUsuario.findById(novaConta.getGarconAbertura().getCodigo())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Garçom não encontrado."));

        if (!garcom.getTipo().equals(TipoUsuario.GARCOM) || !garcom.getSenha().equals(senhaGarcom)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Senha incorreta ou usuário sem permissão.");
        }

        // 2. Verificar duplicidade de Conta para o CPF
        if (iConta.existsByCliente_CpfAndStatus(novaConta.getCliente().getCpf(), StatusConta.ABERTA)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Este cliente já possui uma conta aberta.");
        }

        // 3. Verificar duplicidade do Número do cartão
        if (iConta.existsByNumeroAndStatus(novaConta.getNumero(), StatusConta.ABERTA)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O número da conta já está em uso.");
        }

        // 4. Forçar os status corretos por segurança antes de salvar
        novaConta.setStatus(true);
        novaConta.setGarconAbertura(garcom);

        return iConta.save(novaConta);
    }

    //TODO Método de fecharConta()
}
