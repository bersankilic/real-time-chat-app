package com.bersan.chatapp.controller;

import com.bersan.chatapp.dto.FriendRequestDto;
import com.bersan.chatapp.dto.FriendRequestOpDto;
import com.bersan.chatapp.services.FriendshipService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/*
     arkadaşlık isteği gönderme, onaylama, iptal etme gibi işlemler bu REST controller aracılığıyla yapılır.
 */
@RestController
@RequestMapping("/api/friendship")
public class FriendshipController {

    private FriendshipService friendshipService;

    public FriendshipController(FriendshipService friendshipService) {
        this.friendshipService = friendshipService;

    }
    
    @GetMapping("get-requests")
    public ResponseEntity<?> getFriendRequests(HttpServletRequest request) {

        return friendshipService.getFriendRequests(request);

    }

    @PostMapping("add")
    public ResponseEntity<String> addFriend(@RequestBody FriendRequestDto friendRequestDto,
            HttpServletRequest request) {
        return friendshipService.sendFriendRequest(friendRequestDto, request);

    }

    @PatchMapping("confirm")
    public ResponseEntity<String> approveFriendRequest(@RequestBody FriendRequestOpDto friendRequestOpDto,
            HttpServletRequest request) {
        return friendshipService.confirmFriendRequest(friendRequestOpDto, request);
    }

    @DeleteMapping("cancel")
    public ResponseEntity<String> cancelFriendRequest(@RequestBody FriendRequestOpDto friendRequestOpDto,
            HttpServletRequest request) {
        return friendshipService.cancelFriendRequest(friendRequestOpDto, request);

    }

    @DeleteMapping("delete")
    public ResponseEntity<String> deleteFriendship(@RequestBody FriendRequestOpDto friendRequestOpDto,
            HttpServletRequest request) {
        return friendshipService.deleteFriendship(friendRequestOpDto, request);

    }

}
