package com.example.Practice.controller;

import com.example.Practice.helper.FileUploadHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class FileUpload {

    @Autowired
    private FileUploadHelper fileUploadHelper;

    @PostMapping({"/uploadfile", "/api/upload"})
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
        }

        String fileUrl = fileUploadHelper.uploadFileAndGetUrl(file);

        if (fileUrl != null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "File uploaded successfully");
            response.put("url", fileUrl);
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "File upload failed"));
    }
}
