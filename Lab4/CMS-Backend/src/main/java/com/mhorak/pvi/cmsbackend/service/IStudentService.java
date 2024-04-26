package com.mhorak.pvi.cmsbackend.service;

import com.mhorak.pvi.cmsbackend.model.Student;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IStudentService {
    List<Student> getAllStudents();

    Page<Student> getAllStudents(int page, int size);

    Student getStudentById(Integer id);

    Student addStudent(Student student);

    Student updateStudent(Integer id, Student student);

    Student deleteStudent(Integer id);

}
