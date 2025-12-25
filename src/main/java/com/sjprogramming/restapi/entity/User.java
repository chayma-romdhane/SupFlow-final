/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.sjprogramming.restapi.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

/**
 *
 * @author yassmine el arbi
 */
@Entity
@Table(name = "users")
public class User implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column (nullable=false, updatable=false)
    private Long id;
    @Column(name="user_name")
    private String name;
    @Column(name="user_role")
    private String role;
    @Column(name="user_program")
    private String program;   
    
    @Column(name="user_email", nullable = false, unique = true)
    @NotBlank(message = "Email is required")
    @Email(message = "Email is not valid")
    @Pattern(
        regexp = "^[A-Za-z0-9._%+-]+@supcom\\.tn$",
        message = "Email must be a @supcom.tn address"
    )
    private String email;
    
    @Column(name="user_password")
    private String password; 
    
    
    
    @ManyToMany
    @JoinColumn(name = "user_project_list")
    @JsonIgnoreProperties("projects")
    private List<Project> project;
    
    public User() {
    }

    public User (String name, String role, String program, String password, List<Project> project, String email) {
        this.name = name;
        this.role = role;
        this.program = program;
        this.project= project;
        this.email = email;
        this.password = password;


    }

    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    
    public void setName(String name) {
        this.name = name;
    }

    public void setRole (String role) {
        this.role = role;
    }

    public void setProgram(String program) {
        this.program = program;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public void setProject(List<Project> project) {
        this.project = project;
    }
    
    public String getName() {
        return name;
    }

    public String getRole () {
         return role;
    }

    public String getProgram() {
        return program;
    }
    
    public String getPassword() {
        return password;
    }
    
    
    
    public List<Project> getProject() {
        return project;
    }

    
    public String getEmail() {
    return email;
    }

    

}
