/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.sjprogramming.restapi.controller;

import com.sjprogramming.restapi.entity.Project;
import com.sjprogramming.restapi.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import com.sjprogramming.restapi.repository.UserRepository;
import com.sjprogramming.restapi.repository.ProjectRepository;

/**
 *
 * @author yassmine el arbi
 */
@RestController
@RequestMapping("/User")
@CrossOrigin(origins="*")
public class Usercontroller {

    @Autowired
    private UserRepository userrepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private ProjectRepository projectRepository;
    

    // GET http://localhost:8080/springbootrestapiproject/User/get
    @GetMapping("/get")
    public ResponseEntity<List<User>> getAllStudents() {
        return new ResponseEntity<>(userrepo.findAll(), HttpStatus.OK);
    }

    // GET http://localhost:8080/springbootrestapiproject/User/id
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") long id) {
        Optional<User> User = userrepo.findById(id);
        return new ResponseEntity<>(User.get(), HttpStatus.OK);
    }

    // POST http://localhost:8080/springbootrestapiproject/User/create
    @PostMapping("/create")
    public ResponseEntity<?> createStudent(@RequestBody User newUser) {
        try {
            
            //à la creation de user il n'y a aucun projet affecté 
            newUser.setProject(null);

            //controle sur le mail
            if (newUser.getEmail() != null) {
                if (!newUser.getEmail().endsWith("@supcom.tn")) {
                    throw new IllegalArgumentException("Email must end with @supcom.tn");
                }
            }
            
            //cryptage de password
            String encodedPassword = passwordEncoder.encode(newUser.getPassword());
            newUser.setPassword(encodedPassword);
            
            User savedUser = userrepo.save(newUser);
            return new ResponseEntity<>(savedUser, HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>("Error creating student: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //modification de profil
    @PutMapping("/update/{mail}")
    public ResponseEntity<User> updateStudent(@PathVariable("mail") String mail, @RequestBody User newUserData) {
        try {
            Optional<User> searchedUser = userrepo.findByEmail(mail);

            if (!searchedUser.isPresent()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            User existingUser= searchedUser.get();

            if (newUserData.getName() != null) {
                existingUser.setName(newUserData.getName());
            }

            if (newUserData.getRole() != null) {
                existingUser.setRole(newUserData.getRole());
            }
            if (newUserData.getProgram() != null) {
                existingUser.setProgram(newUserData.getProgram());
            }

            if (newUserData.getEmail() != null) {
            existingUser.setEmail(newUserData.getEmail()); 
            }
            
            List<Long> projectIds = new ArrayList<>();

            for (Project project : newUserData.getProject()) {
                if (project != null && project.getId() != null) {
                    projectIds.add(project.getId());
                }
            }
            List<Project> fullprojects = projectRepository.findAllById(projectIds);
            existingUser.setProject(fullprojects);
            
            User updatedUser = userrepo.save(existingUser);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println("eror ===>  " + e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    

    // DELETE http://localhost:8080/springbootrestapiproject/user/delete/id
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<HttpStatus> deleteStudent(@PathVariable("id") long id) {
        try {
            userrepo.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    //find by mail 
    //GET 
    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmailExists(@RequestParam String email) {
        boolean exists = userrepo.findByEmail(email).isPresent();
        return ResponseEntity.ok(exists);
    }
    
    // POST http://localhost:8080/springbootrestapiproject/students/login
    @PostMapping("/login")
    public ResponseEntity<?> l4oginUser(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        
        if (email == null ) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        Optional<User> UserOpt = userrepo.findByEmail(email);
        if (UserOpt== null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Account does not exist");
        }

        User User = UserOpt.get();
        
        // DIRECT PASSWORD COMPARISON (NOT SECURE FOR PRODUCTION)
        

        // Create response without sensitive data
        Map<String, Object> response = new HashMap<>();
        response.put("name", User.getName());
        response.put("email", User.getEmail());
        
        return ResponseEntity.ok(response);
    }
    
        
    
}
