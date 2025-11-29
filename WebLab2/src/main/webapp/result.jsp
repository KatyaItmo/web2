<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.List" %>
<%@ page import="com.example.model.Point" %>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Результаты проверки - Лабораторная работа №2</title>
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
            <section class="content-block">
                <h2>Результаты последней проверки</h2>
                
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
                                List<Point> results = (List<Point>) request.getAttribute("results");
                                if (results != null && !results.isEmpty()) {
                                    for (Point point : results) {
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
                                } else {
                            %>
                                <tr>
                                    <td colspan="6" style="text-align: center;">Нет данных для отображения</td>
                                </tr>
                            <%
                                }
                            %>
                        </tbody>
                    </table>
                </div>
                
                <div class="navigation-links">
                    <a href="controller" class="back-link">Вернуться к форме ввода</a>
                </div>
            </section>
        </main>
        
        <footer id="footer">
            <div class="footer-info">2025 Веб-программирование. Все права защищены. ^_^</div>
        </footer>
    </div>
	
	<audio id="shlepa1-sound" preload="auto">
	    <source src="music/pelmeni.mp3" type="audio/mpeg">
	</audio>

	<audio id="shlepa2-sound" preload="auto">
	    <source src="music/good-dumplings.mp3" type="audio/mpeg">
	</audio>
	
	<script>
	document.addEventListener('DOMContentLoaded', function() {
	    const shlepa1Sound = document.getElementById('shlepa1-sound');
	    const shlepa2Sound = document.getElementById('shlepa2-sound');
	    
	    function playSound(audioElement) {
	        if (audioElement) {
	            audioElement.currentTime = 0;
	            audioElement.play().catch(e => {
	                console.log('Воспроизведение звука заблокировано:', e);
	            });
	        }
	    }
	    
	    const shlepa1Images = document.querySelectorAll('#meme-column1 img.meme');
	    const shlepa2Images = document.querySelectorAll('#meme-column2 img.meme');
	    
	    shlepa1Images.forEach(img => {
	        img.style.cursor = 'pointer';
	        img.addEventListener('click', () => playSound(shlepa1Sound));
	    });
	    
	    shlepa2Images.forEach(img => {
	        img.style.cursor = 'pointer';
	        img.addEventListener('click', () => playSound(shlepa2Sound));
	    });
	});
	</script>
</body>
</html>