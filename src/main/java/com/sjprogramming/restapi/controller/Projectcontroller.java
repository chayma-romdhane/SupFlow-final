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
import org.springframework.web.bind.annotation.*;
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

    @PutMapping("/update/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable("id") Long id, @RequestBody Project updatedProject) {
        try {
            return ProjectRepository.findById(id).map(existingProject -> {
                existingProject.setTitle(updatedProject.getTitle());
                existingProject.setType(updatedProject.getType());
                existingProject.setClasse(updatedProject.getClasse());
                existingProject.setSuperviseur(updatedProject.getSuperviseur());
                existingProject.setDescription(updatedProject.getDescription());
                existingProject.setStatus(updatedProject.getStatus());

                if (updatedProject.getStudents() != null) {
                    List<Long> studentIds = new ArrayList<>();
                    for (User student : updatedProject.getStudents()) {
                        if (student != null && student.getId() != null) {
                            studentIds.add(student.getId());
                        }
                    }
                    List<User> fullStudents = studentRepository.findAllById(studentIds);
                    existingProject.setStudents(fullStudents);
                }

                Project saved = ProjectRepository.save(existingProject);
                return ResponseEntity.ok(saved);
            }).orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            System.out.println("error ==> " + e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<HttpStatus> deleteProject(@PathVariable("id") Long id) {
        try {
            if (!ProjectRepository.existsById(id)) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            ProjectRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            System.out.println("error ==> " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
