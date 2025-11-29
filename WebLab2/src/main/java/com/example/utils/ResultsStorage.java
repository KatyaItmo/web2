package com.example.utils;

import com.example.model.Point;
import javax.servlet.ServletContext;
import java.util.ArrayList;
import java.util.List;

public class ResultsStorage {
    private static final String HISTORY = "resultsHistory";
    
    @SuppressWarnings("unchecked")
    public static List<Point> getResults(ServletContext context) {
        synchronized (context) {
            List<Point> results = (List<Point>) context.getAttribute(HISTORY);
            if (results == null) {
                results = new ArrayList<>();
                context.setAttribute(HISTORY, results);
            }
            return results;
        }
    }
    
    public static void addResult(ServletContext context, Point point) {
        synchronized (context) {
            List<Point> results = getResults(context);
            results.add(point);
        }
    }
    
    public static void clearResults(ServletContext context) {
        synchronized (context) {
            context.setAttribute(HISTORY, new ArrayList<Point>());
        }
    }
}