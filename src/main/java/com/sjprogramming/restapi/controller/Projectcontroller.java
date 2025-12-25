/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.sjprogramming.restapi.controller;

import com.sjprogramming.restapi.entity.Project;
import com.sjprogramming.restapi.entity.User;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.sjprogramming.restapi.repository.UserRepository;
import com.sjprogramming.restapi.repository.ProjectRepository;
import java.util.ArrayList;

/**
 *
 * @author yassmine el arbi
 */
@RestController
@RequestMapping("/Project")
@CrossOrigin(origins="*")
public class Projectcontroller {



    @Autowired
    private ProjectRepository ProjectRepository;
    @Autowired
    private UserRepository studentRepository;
    
    
    

    // Post http://localhost:8080/springbootrestapiproject/Activity/create
    @PostMapping("/create")
    public ResponseEntity<Project> createProject(@RequestBody Project Project) {
    try {
        
        List<Long> studentIds = new ArrayList<>();
        for (User s : Project.getStudents()) {
            if (s.getId() != null) {
                studentIds.add(s.getId());
            }
        }
        List<User> fullStudents = studentRepository.findAllById(studentIds);

        Project.setStudents(fullStudents);
        
        Project savedProject = ProjectRepository.save(Project);
        return ResponseEntity.ok(savedProject);
    
    
    } catch (Exception e) {
        System.out.println("error ==> " + e.getMessage());
        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    

}

    // GET http://localhost:8080/springbootrestapiproject/Activity/get    
    @GetMapping("/get")
    public ResponseEntity<List<Project>> getAllProjects() {
        List<Project> lists = ProjectRepository.findAll();
        return ResponseEntity.ok(lists);
    }

}