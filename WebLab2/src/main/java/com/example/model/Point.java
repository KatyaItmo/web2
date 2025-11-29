package com.example.model;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public class Point {
    private final String x;
    private final String y;
    private final String r;
    private final boolean hit;
    private final long requestTime;
    private final long startTime;
    
    public Point(String x, String y, String r, boolean hit, long requestTime, long startTime) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.requestTime = requestTime;
        this.startTime = startTime;
    }
    
    public String getX() { return x; }
    public String getY() { return y; }
    public String getR() { return r; }
    public boolean isHit() { return hit; }
    
    public String getRequestTime() {
        return Instant.ofEpochMilli(requestTime)
                     .atZone(ZoneId.systemDefault())
                     .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }
    
    public String getExecutionTime() {
        long nanos = System.nanoTime() - startTime;
        return String.format("%.6f", nanos / 1_000_000_000.0);
    }
}