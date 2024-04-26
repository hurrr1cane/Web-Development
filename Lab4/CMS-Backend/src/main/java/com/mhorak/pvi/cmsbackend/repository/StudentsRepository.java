package com.mhorak.pvi.cmsbackend.repository;

import com.mhorak.pvi.cmsbackend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentsRepository extends JpaRepository<Student, Integer> {

}
