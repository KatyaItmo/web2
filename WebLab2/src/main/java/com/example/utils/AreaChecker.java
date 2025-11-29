package com.example.utils;

import java.math.BigDecimal;

public class AreaChecker {
	
	public static boolean validatePoint(String xStr, String yStr, String rStr, boolean isClick) {
        try {
        	BigDecimal x = new BigDecimal(xStr.replace(',', '.'));
            BigDecimal y = new BigDecimal(yStr.replace(',', '.'));
            BigDecimal r = new BigDecimal(rStr.replace(',', '.'));
            
        	if (isClick) {
        		boolean xValid = x.compareTo(new BigDecimal("-5")) >= 0 && 
                        x.compareTo(new BigDecimal("5")) <= 0;
        		boolean yValid = y.compareTo(new BigDecimal("-5")) >= 0 && 
                        y.compareTo(new BigDecimal("5")) <= 0;
        		boolean rValid = r.compareTo(BigDecimal.ZERO) > 0;
        		
        		return xValid && yValid && rValid;
        	} else {
        		boolean xValid = isValidX(x);
        		boolean yValid = isValidY(y);
        		boolean rValid = isValidR(r);
        		
        		return xValid && yValid && rValid;
        	}
        } catch (Exception e) {
            System.err.println("Validation error: " + e.getMessage());
            return false;
        }
    }
    
	public static boolean checkHit(String xStr, String yStr, String rStr) {
        try {
            BigDecimal x = new BigDecimal(xStr.replace(',', '.'));
            BigDecimal y = new BigDecimal(yStr.replace(',', '.'));
            BigDecimal r = new BigDecimal(rStr.replace(',', '.'));
            
            if (x.compareTo(BigDecimal.ZERO) <= 0 && y.compareTo(BigDecimal.ZERO) >= 0) {
                BigDecimal halfR = r.divide(new BigDecimal("2"));
                return x.compareTo(halfR.negate()) >= 0 && y.compareTo(r) <= 0;
            }
            
            if (x.compareTo(BigDecimal.ZERO) <= 0 && y.compareTo(BigDecimal.ZERO) < 0) {
                BigDecimal lineY = x.multiply(new BigDecimal("-2")).subtract(r);
                return y.compareTo(lineY) >= 0;
            }

            if (x.compareTo(BigDecimal.ZERO) > 0 && y.compareTo(BigDecimal.ZERO) <= 0) {
                BigDecimal xSquared = x.multiply(x);
                BigDecimal ySquared = y.multiply(y);
                BigDecimal rSquared = r.multiply(r);
                return xSquared.add(ySquared).compareTo(rSquared) <= 0;
            }

            return false;
        } catch (Exception e) {
            System.err.println("Check hit error: " + e.getMessage());
            return false;
        }
    }
    
    public static boolean isValidR(BigDecimal r) {
        return r.equals(new BigDecimal("1")) || 
               r.equals(new BigDecimal("2")) || 
               r.equals(new BigDecimal("3")) || 
               r.equals(new BigDecimal("4")) || 
               r.equals(new BigDecimal("5"));
    }
    
    public static boolean isValidX(BigDecimal x) {
        return x.compareTo(new BigDecimal("-5")) >= 0 && 
               x.compareTo(new BigDecimal("3")) <= 0;
    }
    
    public static boolean isValidY(BigDecimal y) {
        try {
            int yInt = y.intValueExact();
            return yInt >= -3 && yInt <= 5;
        } catch (ArithmeticException e) {
            return false;
        }
    }
}