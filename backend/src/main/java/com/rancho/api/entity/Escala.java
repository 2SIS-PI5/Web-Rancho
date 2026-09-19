package com.rancho.api.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "escalas", uniqueConstraints = @UniqueConstraint(columnNames = {"data_escala", "area", "funcionario_id"}))
public class Escala {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_escala", nullable = false)
    private LocalDate data;

    @Column(nullable = false, length = 30)
    private String area;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "funcionario_id", nullable = false)
    private Funcionario funcionario;

    @Column(nullable = false, length = 20)
    private String status = "PLANEJADA";

    public Long getId() { return id; }
    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }
    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }
    public Funcionario getFuncionario() { return funcionario; }
    public void setFuncionario(Funcionario funcionario) { this.funcionario = funcionario; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}