package com.example.servlets;

import com.example.utils.ResultsStorage;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/controller")
public class ControllerServlet extends HttpServlet {
    private static final long serialVersionUID = -3883612754403756393L;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        request.getRequestDispatcher("/form.jsp").forward(request, response);
    }
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String action = request.getParameter("action");
        
        if ("clear".equals(action)) {
            clearHistory(request, response);
            return;
        }
        
        String x = request.getParameter("x");
        String[] yValues = request.getParameterValues("y");
        String[] rValues = request.getParameterValues("r");
        
        boolean hasPointParams = x != null && !x.trim().isEmpty() &&
                               yValues != null && yValues.length > 0 &&
                               rValues != null && rValues.length > 0;
        
        if (hasPointParams) {
            request.getRequestDispatcher("/area-check").forward(request, response);
        } else {
            request.setAttribute("error", "Не все параметры указаны. Выберите хотя бы одно значение Y и один радиус R.");
            request.getRequestDispatcher("/form.jsp").forward(request, response);
        }
    }

    private void clearHistory(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        try {
            ResultsStorage.clearResults(getServletContext());
            
            PrintWriter out = response.getWriter();
            out.print("{\"success\": true}");
            out.flush();
            
        } catch (Exception e) {
            PrintWriter out = response.getWriter();
            out.print("{\"success\": false, \"error\": \"" + e.getMessage().replace("\"", "\\\"") + "\"}");
            out.flush();
        }
    }
}