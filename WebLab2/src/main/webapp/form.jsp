<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.List" %>
<%@ page import="com.example.model.Point" %>
<%@ page import="com.example.utils.ResultsStorage" %>
<%@ page errorPage="form.jsp" %>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Лабораторная работа №2</title>
    <link rel="stylesheet" type="text/css" href="css/styles.css"/>
</head>

<body>
    <div id="page-container">
    
        <header id="header">
            <div class="meme-container">
                <div id="meme-column1">
                    <img src="picture/shlepa.png" alt="Мем_1" class="meme">
                </div>
                <div id="header-content">
                    <h1>Лабораторная работа №2</h1>
                    <div class="student-info">
                        <div class="info-item">ФИО: Чистякова Екатерина Александровна</div>
                        <div class="info-item">Группа: P3218</div>
                        <div class="info-item">Вариант: 18340</div>
                    </div>
                </div>
                <div id="meme-column2">
                    <img src="picture/shlepa.png" alt="Мем_1" class="meme">
                </div>
            </div>
        </header>

        <% if (request.getAttribute("error") != null) { %>
            <div class="error-message">
                <%= request.getAttribute("error") %>
            </div>
        <% } %>

        <main id="main-content">
        
            <section id="input-section" class="content-block">
                <h2>Ввод параметров</h2>
                
                <form id="point-form" class="input-form" action="controller" method="POST">

                    <div class="form-row">
                        <label for="x-coord" class="input-label">Координата X:</label>
                        <div class="input-description">Диапазон: от -5 до 3</div>
                        <input type="text" id="x-coord" name="x" class="text-input"
                            placeholder="Введите число от -5 до 3" required>
                        <div class="validation-message" id="x-validation"></div>
                    </div>

                    <div class="form-row">
                        <label class="input-label">Координата Y:</label>
                        <div class="input-description">Выберите значения</div>
                        <div class="button-group" id="y-button-group">
                            <button type="button" class="y-btn" data-value="-3">-3</button>
                            <button type="button" class="y-btn" data-value="-2">-2</button>
                            <button type="button" class="y-btn" data-value="-1">-1</button>
                            <button type="button" class="y-btn" data-value="0">0</button>
                            <button type="button" class="y-btn" data-value="1">1</button>
                            <button type="button" class="y-btn" data-value="2">2</button>
                            <button type="button" class="y-btn" data-value="3">3</button>
                            <button type="button" class="y-btn" data-value="4">4</button>
                            <button type="button" class="y-btn" data-value="5">5</button>
                        </div>
                        <div class="validation-message" id="y-validation"></div>
                    </div>
                    
                    <div class="form-row">
                        <label class="input-label">Радиус R:</label>
                        <div class="input-description">Выберите радиусы</div>
                        <div class="checkbox-group" id="r-checkbox-group">
                            <div class="checkbox-row">
                                <input type="checkbox" name="r" value="1" id="r1" class="checkbox-input">
                                <label for="r1" class="checkbox-label">1</label>
                            </div>
                            <div class="checkbox-row">
                                <input type="checkbox" name="r" value="2" id="r2" class="checkbox-input">
                                <label for="r2" class="checkbox-label">2</label>
                            </div>
                            <div class="checkbox-row">
                                <input type="checkbox" name="r" value="3" id="r3" class="checkbox-input">
                                <label for="r3" class="checkbox-label">3</label>
                            </div>
                            <div class="checkbox-row">
                                <input type="checkbox" name="r" value="4" id="r4" class="checkbox-input">
                                <label for="r4" class="checkbox-label">4</label>
                            </div>
                            <div class="checkbox-row">
                                <input type="checkbox" name="r" value="5" id="r5" class="checkbox-input">
                                <label for="r5" class="checkbox-label">5</label>
                            </div>
                        </div>
                        <div class="validation-message" id="r-validation"></div>
                    </div>
                    
                    <div class="form-row">
                        <button type="submit" id="submit-btn" class="submit-button">Проверить точку</button>
                    </div>
                </form>
            </section>
            
            <section id="result-section" class="content-block">
                
                <div id="graph-section">
                    <h2>Область попадания</h2>
                    <canvas id="coordinate-plane" width="650" height="650"></canvas>
                </div>
                
                <div id="results-section">
                    <h2>История проверок</h2>
                    <div id="table-container">
                        <table id="result-table">
                            <thead>
                                <tr>
                                    <th>X</th>
                                    <th>Y</th>
                                    <th>R</th>
                                    <th>Результат</th>
                                    <th>Время запроса</th>
                                    <th>Время работы</th>
                                </tr>
                            </thead>
                            <tbody id="results">
                                <%
                                    List<Point> history = ResultsStorage.getResults(application);
                                    if (history != null) {
                                        for (int i = history.size() - 1; i >= 0; i--) {
                                            Point point = history.get(i);
                                %>
                                    <tr>
                                        <td><%= point.getX() %></td>
                                        <td><%= point.getY() %></td>
                                        <td><%= point.getR() %></td>
										<%
										    String resultClass = point.isHit() ? "result-hit" : "result-miss";
										    String resultText = point.isHit() ? "Попадание" : "Промах";
										%>
										<td class="<%= resultClass %>"><%= resultText %></td>
                                        <td><%= point.getRequestTime() %></td>
                                        <td><%= point.getExecutionTime() %>с</td>
                                    </tr>
                                <%
                                        }
                                    }
                                %>
                            </tbody>
                        </table>
                    </div>
                    <div class="results-controls">
                        <div class="control-left">
                            <img src="picture/mem_cat.gif" alt="Мем_2" class="clear_meme">
                        </div>
                        <div class="control-right">
                            <button id="clear-history" class="clear-button">Очистить историю</button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
        
        <footer id="footer">
            <div class="footer-info">2025 Веб-программирование. Все права защищены. ^_^</div>
        </footer>
    </div>
    
    <script src="js/form.js"></script>
	
	<audio id="shlepa1-sound" preload="auto">
	    <source src="music/pelmeni.mp3" type="audio/mpeg">
	</audio>

	<audio id="shlepa2-sound" preload="auto">
	    <source src="music/good-dumplings.mp3" type="audio/mpeg">
	</audio>
	
	<audio id="cat-sound" preload="auto">
		<source src="music/huh-cat.mp3" type="audio/mpeg">
	</audio>
</body>
</html>