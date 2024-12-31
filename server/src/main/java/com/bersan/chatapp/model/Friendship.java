package com.bersan.chatapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "friendships", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "sender_id", "receiver_id" })
})
// Friendship sınıfı iki kullanıcı arasındaki arkadaşlık ilişkisini temsil eder
public class Friendship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @DateTimeFormat(pattern = "MM-dd-yyyy")
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private UserEntity senderEntity;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private UserEntity receiverEntity;

    @Enumerated(EnumType.STRING)
    private FriendshiptStatus status;

    public Friendship(int id, LocalDate date, FriendshiptStatus status) {
        this.id = id;
        this.date = date;
        this.status = status;
    }

}
