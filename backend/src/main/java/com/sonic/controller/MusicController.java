package com.sonic.controller;

import com.sonic.service.JioSaavnService;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriUtils;

@RestController
@RequestMapping("/api/music")
public class MusicController {

    private final JioSaavnService jioSaavnService;

    public MusicController(JioSaavnService jioSaavnService) {
        this.jioSaavnService = jioSaavnService;
    }

    @GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> searchSongs(@RequestParam("q") String query) {
        return json(jioSaavnService.get("/search/songs?query=" + query(query)));
    }

    @GetMapping(value = "/search/albums", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> searchAlbums(@RequestParam("q") String query) {
        return json(jioSaavnService.get("/search/albums?query=" + query(query)));
    }

    @GetMapping(value = "/search/artists", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> searchArtists(@RequestParam("q") String query) {
        return json(jioSaavnService.get("/search/artists?query=" + query(query)));
    }

    @GetMapping(value = "/song/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> song(@PathVariable String id) {
        return json(jioSaavnService.get("/songs/" + path(id)));
    }

    @GetMapping(value = "/album/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> album(@PathVariable String id) {
        return json(jioSaavnService.get("/albums?id=" + query(id)));
    }

    @GetMapping(value = "/artist/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> artist(@PathVariable String id) {
        return json(jioSaavnService.get("/artists/" + path(id)));
    }

    @GetMapping(value = "/artist/{id}/songs", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> artistSongs(@PathVariable String id) {
        return json(jioSaavnService.get("/artists/" + path(id) + "/songs"));
    }

    @GetMapping(value = "/artist/{id}/albums", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> artistAlbums(@PathVariable String id) {
        return json(jioSaavnService.get("/artists/" + path(id) + "/albums"));
    }

    @GetMapping(value = "/trending", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> trending() {
        return json(jioSaavnService.get("/search/songs?query=trending+hindi+2024"));
    }

    private ResponseEntity<String> json(String body) {
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(body);
    }

    private String query(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private String path(String value) {
        return UriUtils.encodePathSegment(value, StandardCharsets.UTF_8);
    }
}

