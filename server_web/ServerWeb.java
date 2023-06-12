import org.json.JSONArray;
import org.json.JSONObject;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.zip.GZIPOutputStream;

public class ServerWeb {

    // metoda care comprimă datele cu gzip
    public static byte[] gzipCompress(byte[] data) throws IOException {
        ByteArrayOutputStream byteOS = new ByteArrayOutputStream();
        GZIPOutputStream gzip = new GZIPOutputStream(byteOS);
        gzip.write(data);
        gzip.close();
        return byteOS.toByteArray();
    }

    public static void main(String[] args) throws IOException {
        System.out.println("########################################################################");
        System.out.println("Serverul asculta potentiali clienti.");
        // pornește un server pe portul 5678
        ServerSocket serverSocket = new ServerSocket(5678);
        //ServerJSON serverJSON = new ServerJSON("D:\\an3S2\\pw\\ProiectPW\\proiect-1-CosminSergiu\\continut\\resurse\\utilizatori.json");

        while (true) {

            String httpResponse;
            String numeResursa;
            String resursa;
            String extensie;

            // așteaptă conectarea unui client la server
            // metoda accept este blocantă
            // clientSocket - socket-ul clientului conectat
            Socket clientSocket = serverSocket.accept();
            System.out.println("S-a conectat un client.");
            // socketWriter - wrapper peste fluxul de ieșire folosit pentru atransmite date
            // clientului
            PrintWriter socketWriter = new PrintWriter(clientSocket.getOutputStream(), true);
            // socketReader - wrapper peste fluxul de intrare folosit pentru aprimi date de
            // la client
            BufferedReader socketReader = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));

            // este citită prima linie de text din cerere
            String linieDeStart = socketReader.readLine();
            System.out.println("S-a citit linia de start din cerere: ##### " + linieDeStart + " #####");
            // mesajul citit este transmis la client

            // se extrage numele resursei cerute din prima linie a cererii
            numeResursa = linieDeStart.substring(linieDeStart.indexOf("/") + 1, linieDeStart.lastIndexOf(" "));
            numeResursa = numeResursa.replace('/', '\\');
            resursa = "D:\\an3S2\\pw\\ProiectPW\\proiect-1-CosminSergiu\\continut\\" + numeResursa;


            // verificăm dacă cererea este de tip POST pentru API-ul de utilizatori
            if (linieDeStart.startsWith("POST") && linieDeStart.contains("/api/utilizatori")) {
                String line;
                Map<String, String> headers = new HashMap<>();
                while (!(line = socketReader.readLine()).isEmpty()) {
                    if (line.contains(": ")) {
                        String[] parts = line.split(": ", 2);
                        headers.put(parts[0].trim(), parts[1].trim());
                    }
                }
                int contentLength = Integer.parseInt(headers.get("Content-Length"));
                char[] payload = new char[contentLength];
                socketReader.read(payload, 0, contentLength);
                String payloadJson = new String(payload);

                if (payloadJson.trim().startsWith("{")) {
                    Path filePath = Paths.get("D:\\an3S2\\pw\\ProiectPW\\proiect-1-CosminSergiu\\continut\\resurse\\utilizatori.json");
                    String existingJsonData = Files.readString(filePath);
                    JSONArray existingUsersArray;
                    //verificam daca mai exista date in fisier ca sa nu le suprascriem
                    if (!existingJsonData.trim().isEmpty()) {
                        existingUsersArray = new JSONArray(existingJsonData);
                    } else {
                        existingUsersArray = new JSONArray();
                    }

                    JSONObject newUser = new JSONObject(payloadJson);
                    existingUsersArray.put(newUser);

                    Files.writeString(filePath, existingUsersArray.toString(), StandardOpenOption.TRUNCATE_EXISTING, StandardOpenOption.WRITE, StandardOpenOption.CREATE);

                    httpResponse = "HTTP/1.1 200 OK\r\n" +
                            "Content-Length: 0\r\n" +
                            "Server: ServerWeb \r\n" +
                            "Date: " + new Date() + "\r\n" +
                            "\r\n";
                } else {
                    httpResponse = "HTTP/1.1 400 Bad Request\r\n" +
                            "Content-Length: 0\r\n" +
                            "Server: ServerWeb \r\n" +
                            "Date: " + new Date() + "\r\n" +
                            "\r\n";
                }
                clientSocket.getOutputStream().write(httpResponse.getBytes("UTF-8"));
                clientSocket.close();
            } else {

                System.out.println(resursa);
                // #TODO interpretarea sirului de caractere `linieDeStart` pentru a extrage
                // numele resursei cerute
                // #TODO trimiterea răspunsului HTTP
                extensie = resursa.substring(resursa.lastIndexOf('.') + 1);
                String tipResursa = "";
                switch (extensie) {
                    case "html":
                        tipResursa = "text/html";
                        break;
                    case "css":
                        tipResursa = "text/css";
                        break;
                    case "js":
                        tipResursa = "application/javascript";
                        break;
                    case "png":
                        tipResursa = "image/png";
                        break;
                    case "jpg":
                        tipResursa = "image/jpeg";
                        break;
                    case "jpeg":
                        tipResursa = "image/jpeg";
                        break;
                    case "gif":
                        tipResursa = "image/gif";
                        break;
                    case "ico":
                        tipResursa = "image/x-icon";
                        break;
                    case "xml":
                        tipResursa = "application/xml";
                        break;
                    case "json":
                        tipResursa = "application/json";
                        break;
                    default:
                        tipResursa = "application/octet-stream";
                        break;
                }
                try {

                    File fisier = new File(resursa);
                    if (fisier.exists()) {
                        Path caleFisier = Paths.get(resursa);
                        byte[] continutFisier = Files.readAllBytes(caleFisier);
                        //comprimare gzip
                        byte[] continutComprimat = gzipCompress(continutFisier);
                        
                        httpResponse = "HTTP/1.1 200 OK\r\n" +
                                "Content-Encoding: gzip\r\n" +
                                "Content-Length: " + continutComprimat.length + "\r\n" +
                                "Content-Type: " + tipResursa + "\r\n" +
                                "Server: ServerWeb \r\n" +
                                "Date: " + new Date() + "\r\n" +
                                "\r\n";// + new String(continutFisier, "UTF-8");

                        clientSocket.getOutputStream().write(httpResponse.getBytes("UTF-8"));
                        clientSocket.getOutputStream().write(continutComprimat);
                    } else {
                        httpResponse = "HTTP/1.1 404 Not Found";
                    }
                    clientSocket.getOutputStream().write(httpResponse.getBytes("UTF-8"));
                } catch (Exception ex) {
                    System.out.printf(ex.getMessage());
                }
            }

            // închide conexiunea cu clientul
            // la apelul metodei close() se închid automat fluxurile de intrare și ieșire
            // (socketReader și socketWriter)
            clientSocket.close();
            System.out.println("S-a terminat comunicarea cu clientul.");
        }
        // închide serverul
        // serverSocket.close();
    }
}
