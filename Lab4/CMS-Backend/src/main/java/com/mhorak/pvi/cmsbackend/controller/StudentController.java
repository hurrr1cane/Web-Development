package com.mhorak.pvi.cmsbackend.controller;

import com.mhorak.pvi.cmsbackend.model.Student;
import com.mhorak.pvi.cmsbackend.service.IStudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {
    private final IStudentService studentService;

    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/page")
    public ResponseEntity<Page<Student>> getAllStudents(@RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "10") int size) {
        Page<Student> studentPage = studentService.getAllStudents(page, size);
        return ResponseEntity.ok(studentPage);
    }

    @GetMapping("{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Integer id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @PostMapping("/add")
    public ResponseEntity<Student> addStudent(@RequestBody @Valid Student student) {
        return ResponseEntity.ok(studentService.addStudent(student));
    }

    @PutMapping("{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable Integer id, @RequestBody Student student) {
        return ResponseEntity.ok(studentService.updateStudent(id, student));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Student> deleteStudent(@PathVariable Integer id) {
        return ResponseEntity.ok(studentService.deleteStudent(id));
    }
}
