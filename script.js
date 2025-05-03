let totalCalories = 0;
                
        function addFood() {
            const food = document.getElementById('food').value;
            const caloriesPer100g = parseFloat(document.getElementById('calories').value);
            const weight = parseFloat(document.getElementById('weight').value);
            
            if (!food || isNaN(caloriesPer100g) || isNaN(weight)) {
                alert('Пожалуйста, заполните все поля корректно!');
                return;
            }
            
            const calories = (caloriesPer100g * weight) / 100;
            totalCalories += calories;
            
            const historyItem = {
                food,
                calories: calories.toFixed(1),
                weight,
                date: new Date().toLocaleTimeString()
            };
            
            
            
            document.getElementById('result').style.display = 'block';
            document.getElementById('result').innerHTML = `
                Добавлено: ${weight}g ${food} (${calories.toFixed(1)} ккал)
            `;
            
            // Очищаем поля ввода
            document.getElementById('food').value = '';
            document.getElementById('calories').value = '';
            document.getElementById('weight').value = '100';
        }
        
        
        function updateTotal() {
            document.getElementById('total-calories').textContent = totalCalories.toFixed(1);
        }
