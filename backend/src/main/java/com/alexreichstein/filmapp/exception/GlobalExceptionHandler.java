package com.alexreichstein.filmapp.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.ErrorResponse;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.alexreichstein.filmapp.dto.MessageResponse;

// @RestControllerAdvice gör att klassen fångar fel från alla controllers.
// Varje metod tar hand om en viss typ av fel och gör om det till samma format:
// { "message": "..." }
// Då kan appen alltid visa ett begripligt meddelande, och ingen intern kod skickas ut
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Loggar oväntade fel i backend-terminalen, så att utvecklaren kan se vad som hände
    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

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

    // När ett värde i adressen har fel typ, till exempel /api/movies/abc
    // där ett id (ett tal) förväntas
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<MessageResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new MessageResponse("Ogiltigt värde i adressen"));
    }

    // När adressen finns men inte med den metoden,
    // till exempel DELETE /api/movies/1 där bara GET finns
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<MessageResponse> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex) {
        return ResponseEntity
                .status(HttpStatus.METHOD_NOT_ALLOWED)
                .body(new MessageResponse("Den här metoden stöds inte för adressen"));
    }

    // När adressen inte finns alls, till exempel /api/finnsinte
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<MessageResponse> handleNotFound(NoResourceFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new MessageResponse("Adressen finns inte"));
    }

    // Alla övriga fel, så att inget skickar ut Springs fullständiga felrapport
    @ExceptionHandler(Exception.class)
    public ResponseEntity<MessageResponse> handleOther(Exception ex) {

        // Springs egna fel har redan en statuskod, till exempel 415
        // om appen skickar något som inte är JSON. Den behålls
        if (ex instanceof ErrorResponse errorResponse) {
            return ResponseEntity
                    .status(errorResponse.getStatusCode())
                    .body(new MessageResponse("Anropet kunde inte hanteras"));
        }

        // Oväntade fel, alltså buggar: hela felet loggas för utvecklaren,
        // men appen får bara ett allmänt meddelande
        log.error("Oväntat fel", ex);

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new MessageResponse("Något gick fel på servern. Försök igen senare."));
    }
}