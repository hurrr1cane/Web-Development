package com.mhorak.pvi.cmsbackend.service;

import com.mhorak.pvi.cmsbackend.exception.StudentNotFoundException;
import com.mhorak.pvi.cmsbackend.model.Student;
import com.mhorak.pvi.cmsbackend.repository.StudentsRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService implements IStudentService {

    private final StudentsRepository studentsRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<Student> getAllStudents() {
        return studentsRepository.findAll();
    }

    @Override
    public Page<Student> getAllStudents(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return studentsRepository.findAll(pageable);
    }

    @Override
    public Student getStudentById(Integer id) {
        return studentsRepository.findById(id).orElseThrow(
                () -> new StudentNotFoundException("Student with id " + id + " not found")
        );
    }

    @Override
    public Student addStudent(Student student) {
        return studentsRepository.save(student);
    }

    @Override
    public Student updateStudent(Integer id, Student student) {
        //Use modelMapper
        Student studentExisting = getStudentById(id);
        modelMapper.map(student, studentExisting);
        return studentsRepository.save(studentExisting);
    }

    @Override
    public Student deleteStudent(Integer id) {
        Student student = getStudentById(id);
        studentsRepository.deleteById(id);
        return student;
    }


}
