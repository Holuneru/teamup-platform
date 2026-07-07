package com.teamup.service;

import com.teamup.entity.User;
import com.teamup.exception.UserNotFoundException;
import com.teamup.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AvatarService {

    private final UserRepository userRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String uploadAvatar(Long userId, MultipartFile file) throws IOException {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        String contentType = file.getContentType();

        if (contentType == null ||
                !(contentType.equals("image/png")
                        || contentType.equals("image/jpeg")
                        || contentType.equals("image/webp"))) {

            throw new RuntimeException("Only PNG, JPG and WEBP images are allowed");
        }

        // удаляем старый аватар
        if (user.getAvatarUrl() != null) {

            String oldFile = user.getAvatarUrl()
                    .replace("/uploads/avatars/", "");

            Path oldPath = Paths.get(uploadDir, "avatars", oldFile);

            Files.deleteIfExists(oldPath);
        }

        String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());

        String filename = UUID.randomUUID() + "." + extension;

        Path avatarFolder = Paths.get(uploadDir, "avatars");

        Files.createDirectories(avatarFolder);

        Path target = avatarFolder.resolve(filename);

        Files.copy(
                file.getInputStream(),
                target,
                StandardCopyOption.REPLACE_EXISTING
        );

        String avatarUrl = "/uploads/avatars/" + filename;

        user.setAvatarUrl(avatarUrl);

        userRepository.save(user);

        return avatarUrl;
    }

}