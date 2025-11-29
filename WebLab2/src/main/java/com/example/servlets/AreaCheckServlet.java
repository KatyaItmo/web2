package com.example.servlets;

import com.example.model.Point;
import com.example.utils.AreaChecker;
import com.example.utils.ResultsStorage;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/area-check")
public class AreaCheckServlet extends HttpServlet {
    private static final long serialVersionUID = 9104583245903486163L;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        long startTime = System.nanoTime();
        long requestTime = System.currentTimeMillis();
        
        try {
            String x = request.getParameter("x");
            String[] yValues = request.getParameterValues("y");
            String[] rValues = request.getParameterValues("r");
            String source = request.getParameter("source");
            boolean isClick = "graph".equals(source);
            
            List<Point> results = new ArrayList<>();
            
            for (String y : yValues) {
                for (String r : rValues) {
                    if (!AreaChecker.validatePoint(x, y, r, isClick)) {
                        continue;
                    }
                    
                    boolean hit = AreaChecker.checkHit(x, y, r);
                    
                    Point point = new Point(x, y, r, hit, requestTime, startTime);
                    results.add(point);
                    
                    ResultsStorage.addResult(getServletContext(), point);
                }
            }
            
            if (results.isEmpty()) {
                throw new IllegalArgumentException("Не было обработано ни одной валидной комбинации параметров.");
            }

            if (isClick) {
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                
                PrintWriter out = response.getWriter();
                
                StringBuilder jsonBuilder = new StringBuilder();
                jsonBuilder.append("{\"success\": true, \"points\": [");
                
                for (int i = 0; i < results.size(); i++) {
                    Point point = results.get(i);
                    if (i > 0) {
                        jsonBuilder.append(",");
                    }
                    jsonBuilder.append("{")
                        .append("\"x\":\"").append(point.getX()).append("\",")
                        .append("\"y\":\"").append(point.getY()).append("\",")
                        .append("\"r\":\"").append(point.getR()).append("\",")
                        .append("\"hit\":").append(point.isHit()).append(",")
                        .append("\"requestTime\":\"").append(point.getRequestTime()).append("\",")
                        .append("\"executionTime\":\"").append(point.getExecutionTime()).append("\"")
                        .append("}");
                }
                
                jsonBuilder.append("]}");
                
                out.print(jsonBuilder.toString());
                out.flush();
                return;
            } 
            else {
                request.setAttribute("results", results);
                request.getRequestDispatcher("/result.jsp").forward(request, response);
            }
            
        } catch (Exception e) { 
            String source = request.getParameter("source");
            if ("graph".equals(source)) {
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                
                PrintWriter out = response.getWriter();
                out.print("{\"success\": false, \"error\": \"" + e.getMessage().replace("\"", "\\\"") + "\"}");
                out.flush();
            } else {
                request.setAttribute("error", "Ошибка: " + e.getMessage());
                request.getRequestDispatcher("/form.jsp").forward(request, response);
            }
        }
    }
}