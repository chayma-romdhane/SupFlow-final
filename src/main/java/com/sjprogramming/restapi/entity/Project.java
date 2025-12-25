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
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

/**
 *
 * @author yassmine el arbi
 */

@Entity
@Table(name = "Project")  
public class Project implements Serializable{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name="Project_title")
    private String title;
    
    @Column(name = "Project_type")
    private String type;

    @Column(name = "Project_class")
    private String classe;
    @Column(name = "Project_superviser")
    private String superviseur;
    @Column(name = "Project_description")
    private String description;
    
    @ManyToMany
    @JoinTable(
    name = "Project_students",
    joinColumns = @JoinColumn(name = "Project_id"),
    inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    @JsonIgnoreProperties("Project")
    private List<User> students;
    
    public Project() {
    
    }
    public Project(String classe,List<User> students,String title ,String type,String superviseur, String description ) {
        this.students = students;
        this.classe = classe;
        this.title = title;
        this.type = type;
        this.superviseur = superviseur;
        this.description = description;
    }
    
    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getType() {
        return type;
    }
    public String getClasse() {
        return classe;
    }
    public String getSuperviseur() {
        return superviseur;
    }
    public String getDescription() {
        return description;
    }
    public List<User> getStudents() {
        return students;
    }

    public void setStudents(List<User> students) {
        this.students = students;
    }  
    
     public void setTitle(String title) {
        this.title= title;
    }

    public void setType(String type) {
        this.type= type;
    }

    public void setClasse(String classe) {
        this.classe = classe;
    }

    public void setSuperviseur(String superviseur) {
    this.superviseur = superviseur;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    }

