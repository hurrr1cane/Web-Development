package com.mhorak.pvi.cmsbackend.validator;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class DateOfBirthValidator implements ConstraintValidator<ValidDateOfBirth, String> {

    @Override
    public void initialize(ValidDateOfBirth constraintAnnotation) {
        // Initialize method
    }

    @Override
    public boolean isValid(String dateOfBirth, ConstraintValidatorContext context) {
        if (dateOfBirth == null || dateOfBirth.isEmpty()) {
            // If dateOfBirth is null or empty, it's considered invalid
            return false;
        }

        // Parse the date string using the specified format
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
        try {
            LocalDate parsedDate = LocalDate.parse(dateOfBirth, formatter);
            // Check if the parsed date is valid according to the calendar
            return isValidDate(parsedDate);
        } catch (Exception e) {
            // If parsing fails, the date is invalid
            return false;
        }
    }

    private boolean isValidDate(LocalDate date) {
        // Custom validation logic to check if the date is valid according to the calendar
        try {
            // Attempt to create a valid date object using the given input
            LocalDate.of(date.getYear(), date.getMonth(), date.getDayOfMonth());
            return true;
        } catch (Exception e) {
            // If an exception is thrown, the date is invalid (e.g., February 30th)
            return false;
        }
    }
}

