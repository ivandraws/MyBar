package ufpi.ivangusthavo.mybar.model;

public enum TipoUsuario {
    ADMIN("admin"),
    COZINHA("cozinha"),
    GARCOM("garcom"),
    ATENDENTE_BALCAO("atendente");


    private String role;
    TipoUsuario(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }
}
