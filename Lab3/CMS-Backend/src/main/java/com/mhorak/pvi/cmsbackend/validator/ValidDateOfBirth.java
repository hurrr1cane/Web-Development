package com.mhorak.pvi.cmsbackend.validator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Documented
@Constraint(validatedBy = DateOfBirthValidator.class)
@Target({FIELD})
@Retention(RUNTIME)
public @interface ValidDateOfBirth {
    String message() default "Invalid date of birth";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}