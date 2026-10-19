package com.alexreichstein.filmapp.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import com.alexreichstein.filmapp.dto.MessageResponse;

// @RestControllerAdvice gör att klassen fångar fel från alla controllers.
// Varje metod tar hand om en viss typ av fel och gör om det till ett tydligt JSON-svar.
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Fel som vi själva kastar med ResponseStatusException,
    // till exempel 409 när användarnamnet redan är taget
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<MessageResponse> handleResponseStatus(ResponseStatusException ex) {
        return ResponseEntity
                // Samma statuskod som vi angav när felet kastades
                .status(ex.getStatusCode())
                // getReason() är vår text, till exempel "Användarnamnet är redan taget"
                .body(new MessageResponse(ex.getReason()));
    }

    // Valideringsfel från @Valid, till exempel för kort lösenord
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<MessageResponse> handleValidation(MethodArgumentNotValidException ex) {

        // Hämtar det första felet och dess meddelande från annoteringen,
        // till exempel "Lösenordet ska vara minst 6 tecken"
        String message = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("Ogiltig data");

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new MessageResponse(message));
    }

    // När datan inte går att läsa, till exempel trasig JSON eller tom body
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<MessageResponse> handleUnreadable(HttpMessageNotReadableException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new MessageResponse("Ogiltig data i anropet"));
    }
}