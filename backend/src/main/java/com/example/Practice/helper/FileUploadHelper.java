package com.example.Practice.helper;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Component
public class FileUploadHelper {

    // Store in uploads directory inside static resources
    private final Path uploadPath = Paths.get("backend", "src", "main", "resources", "static", "uploads")
            .toAbsolutePath().normalize();

    public FileUploadHelper() {
        try {
            Files.createDirectories(uploadPath);
        } catch (Exception e) {
            // fallback to local uploads folder
            new File("uploads").mkdirs();
        }
    }

    public String uploadFileAndGetUrl(MultipartFile multipartFile) {
        try {
            if (multipartFile.isEmpty()) {
                return null;
            }

            Files.createDirectories(uploadPath);

            String originalFilename = multipartFile.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String cleanFileName = UUID.randomUUID().toString().substring(0, 8) + "_" + 
                    (originalFilename != null ? originalFilename.replaceAll("[^a-zA-Z0-9.-]", "_") : "upload" + extension);

            Path targetLocation = uploadPath.resolve(cleanFileName);
            Files.copy(multipartFile.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Return relative URL that Spring Boot serves
            return "/uploads/" + cleanFileName;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // Legacy method for existing code compatibility
    public boolean uploadFile(MultipartFile multipartFile) {
        return uploadFileAndGetUrl(multipartFile) != null;
    }
}