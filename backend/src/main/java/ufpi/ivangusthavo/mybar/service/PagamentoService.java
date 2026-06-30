package ufpi.ivangusthavo.mybar.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ufpi.ivangusthavo.mybar.model.Conta;
import ufpi.ivangusthavo.mybar.model.Pagamento;
import ufpi.ivangusthavo.mybar.model.StatusConta;
import ufpi.ivangusthavo.mybar.repository.IConta;
import ufpi.ivangusthavo.mybar.repository.IPagamento;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PagamentoService {

    @Autowired
    private IPagamento iPagamento;

    @Autowired
    private IConta iConta;

    @Autowired
    private UsuarioService usuarioService;

    // RF3 — registra um pagamento na conta
    public Pagamento registrarPagamento(Long contaId, Pagamento pagamento,
                                        String codigoGarcom, String senha) {
        // 1. VALIDAR — senha do garçom
        usuarioService.verificarSenhaGarcom(codigoGarcom, senha);

        // 2. BUSCAR — conta existe e está aberta?
        Conta conta = iConta.findById(contaId)
                .orElseThrow(() -> new IllegalArgumentException("Conta não encontrada."));

        if (conta.getStatus() != StatusConta.ABERTA) {
            throw new IllegalStateException("Conta não está aberta.");
        }

        // 3. PROCESSAR — vincula o pagamento à conta
        pagamento.setConta(conta);

        // 4. SALVAR
        return iPagamento.save(pagamento);
    }

    // RF3 — exclui pagamento com senha de admin
    public void excluirPagamento(Long pagamentoId, String usuarioAdmin, String senha) {
        // 1. VALIDAR — senha do admin
        usuarioService.verificarSenhaAdmin(usuarioAdmin, senha);

        // 2. BUSCAR — pagamento existe?
        Pagamento pagamento = iPagamento.findById(pagamentoId)
                .orElseThrow(() -> new IllegalArgumentException("Pagamento não encontrado."));


        iPagamento.delete(pagamento);
    }


    public BigDecimal somarPagamentos(Long contaId) {
        List<Pagamento> pagamentos = iPagamento.findByConta_Id(contaId);
        return pagamentos.stream()
                .map(Pagamento::getValor)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}