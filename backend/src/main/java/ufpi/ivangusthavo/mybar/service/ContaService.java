package ufpi.ivangusthavo.mybar.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ufpi.ivangusthavo.mybar.model.Conta;
import ufpi.ivangusthavo.mybar.model.StatusConta;
import ufpi.ivangusthavo.mybar.repository.IConta;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class ContaService {

    @Autowired
    private IConta iConta;

    @Autowired
    private UsuarioService usuarioService;

    @Transactional
    public Conta abrirConta(Conta novaConta, String codigoGarcom, String senha) {

        // 1. VALIDAR — senha do garçom
        usuarioService.verificarSenhaGarcom(codigoGarcom, senha);

        // 2. VALIDAR — CPF já tem conta aberta?
        boolean cpfComContaAberta = iConta.existsByCliente_CpfAndStatus(
                novaConta.getCliente().getCpf(),
                StatusConta.ABERTA
        );
        if (cpfComContaAberta) {
            throw new IllegalStateException("Já existe uma conta aberta para este CPF.");
        }

        // 3. VALIDAR — número do cartão já está em uso?
        boolean numeroEmUso = iConta.existsByNumeroAndStatus(
                novaConta.getNumero(),
                StatusConta.ABERTA
        );
        if (numeroEmUso) {
            throw new IllegalStateException("Este número de conta já está em uso.");
        }

        // 4. PROCESSAR — preenche dados automáticos
        novaConta.setStatus(StatusConta.ABERTA);
        novaConta.setDataAbertura(LocalDate.now());
        novaConta.setHoraAbertura(LocalTime.now());

        // 5. SALVAR
        return iConta.save(novaConta);
    }

    public Conta buscarConta(Long id) {
        return iConta.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Conta não encontrada."));
    }

    @Transactional
    public Conta alterarConta(Conta contaAlterada, String codigoGarcom, String senha) {

        // 1. VALIDAR — senha do garçom
        usuarioService.verificarSenhaGarcom(codigoGarcom, senha);

        // 2. BUSCAR — conta existe?
        Conta contaExistente = buscarConta(contaAlterada.getId());

        // 3. VALIDAR — número novo já está em uso em outra conta?
        boolean numeroEmUso = iConta.existsByNumeroAndStatusAndIdNot(
                contaAlterada.getNumero(),
                StatusConta.ABERTA,
                contaAlterada.getId()
        );
        if (numeroEmUso) {
            throw new IllegalStateException("Este número de conta já está em uso.");
        }

        // 4. PROCESSAR — atualiza campos permitidos
        contaExistente.setNumero(contaAlterada.getNumero());
        contaExistente.setCliente(contaAlterada.getCliente());

        // 5. SALVAR
        return iConta.save(contaExistente);
    }

    public List<Conta> listarContas() {
        return iConta.findAll();
    }
    @Transactional
    public void excluirConta(Long id) {

        // 1. BUSCAR
        Conta conta = buscarConta(id);

        // 2. VALIDAR — documento diz: só exclui se não tiver itens
        // quando LancamentoItem existir, adiciona verificação aqui

        // 3. SALVAR
        iConta.delete(conta);
    }
}