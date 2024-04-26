package com.mhorak.pvi.cmsbackend.model;

import com.mhorak.pvi.cmsbackend.validator.ValidDateOfBirth;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Student {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Integer id;

    @NotNull(message = "Name cannot be null")
    @NotEmpty(message = "Name cannot be empty")
    // Name must start with capital letter and contain only letters, hyphens and apostrophes
    @Pattern(regexp = "^[A-Z][a-z]+([ '-][a-zA-Z]+)*$", message = "Name must start with capital letter and contain only letters, hyphens and apostrophes")
    private String name;

    @NotNull(message = "Surname cannot be null")
    @NotEmpty(message = "Surname cannot be empty")
    // Surname must start with capital letter and contain only letters, hyphens and apostrophes
    @Pattern(regexp = "^[A-Z][a-z]+([ '-][a-zA-Z]+)*$", message = "Surname must start with capital letter and contain only letters, hyphens and apostrophes")
    private String surname;

    @Column(name = "group_name")
    @NotNull(message = "Group cannot be null")
    @NotEmpty(message = "Group cannot be empty")
    @Pattern(regexp = "[A-Za-z0-9]+-[0-9]+", message = "Group must be in format XX-00")
    private String group;

    @NotNull(message = "Sex cannot be null")
    @NotEmpty(message = "Sex cannot be empty")
    @Pattern(regexp = "male|female|other", message = "Sex must be")
    private String sex;

    //Make this field optional and false by default
    private boolean active;

    @NotNull(message = "Date of birth cannot be null")
    @NotEmpty(message = "Date of birth cannot be empty")
    // dd.MM.yyyy
    @Pattern(regexp = "^(0[1-9]|[12][0-9]|3[01])\\.(0[1-9]|1[012])\\.(19|20)\\d\\d$", message = "Date of birth must be in format dd.MM.yyyy")
    @ValidDateOfBirth
    private String dateOfBirth;
}
