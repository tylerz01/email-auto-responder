package com.email.writter.app;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;


@Service
public class EmailGeneratorService {
    @Value("${gemini.api.url}")
    private String geminiApiUrl;
    @Value("${gemini.api.key}")
    private String geminiApiKey;
    private String dailyUpdate = "04/25/2025";
    private final WebClient webClient;

    public EmailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }
    public String generateEmailReply(EmailRequest emailRequest){

        //BuildPrompt
        String prompt = buildPrompt(emailRequest);
        //Craft a Request
        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)
                        ))
                )
        );
        //Do Request and Respond
        String response = webClient.post()
                .uri(geminiApiUrl + geminiApiKey) // Make sure this is a full URL
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        //extract response and return;
        return extractResponseContent(response);
    }

    private String extractResponseContent(String response) {
        try{
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);
            return rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
        }
        catch(Exception e){
            return "Error processing return: " + e.getMessage();
        }
    }

    public String buildPrompt(EmailRequest emailRequest){
        StringBuilder prompt = new StringBuilder();
        if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()){
            prompt.append("Write a response email in a ")
                    .append(emailRequest.getTone())
                    .append(" tone to the following message:\n\n");
            prompt.append(emailRequest.getEmailContent());
        } else {
            prompt.append("Please provide a tone to generate the response email.");
        }
        return prompt.toString();
    }

}
