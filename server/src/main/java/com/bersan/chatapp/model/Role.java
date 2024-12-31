package com.bersan.chatapp.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
// Role sınıfı bir kullanıcının rolünü temsil eder
@Setter
@Getter
@Entity
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

}
