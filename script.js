const App = {
    currentFood: null,
    foodHistory: [],
    foodDatabase: JSON.parse(localStorage.getItem('foodDatabase')) || [],
    
    init: function() {
        this.setupNavigation();
        this.setupEventListeners();
        this.loadFoodDatabase();
    },
    
    setupNavigation: function() {
        // ������� �� �������� ������������
        if (document.getElementById('startButton')) {
            document.getElementById('startButton').addEventListener('click', () => {
                window.location.href = 'calculator.html';
            });
        }
        
        // ������� �� �������
        if (document.getElementById('backButton')) {
            document.getElementById('backButton').addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
    },
    
    setupEventListeners: function() {
        // �����������
        if (document.getElementById('calculateButton')) {
            document.getElementById('calculateButton').addEventListener('click', () => this.calculateNutrition());
        }
        
        // �������� ����� ������
        if (document.getElementById('addMoreButton')) {
            document.getElementById('addMoreButton').addEventListener('click', () => this.resetForm());
        }
        
        // ��������� �����
        if (document.getElementById('saveFoodBtn')) {
            document.getElementById('saveFoodBtn').addEventListener('click', () => this.saveFood());
        }
        
        // �������������� ��� ������ �����
        if (document.getElementById('food')) {
            document.getElementById('food').addEventListener('change', (e) => this.autofillFoodData(e.target.value));
        }
    },
    
    loadFoodDatabase: function() {
        const datalist = document.getElementById('foodList');
        if (!datalist) return;
        
        datalist.innerHTML = '';
        this.foodDatabase.forEach(food => {
            const option = document.createElement('option');
            option.value = food.name;
            datalist.appendChild(option);
        });
    },
    
    autofillFoodData: function(foodName) {
        const food = this.foodDatabase.find(item => item.name === foodName);
        if (food) {
            document.getElementById('calories').value = food.caloriesPer100g;
            document.getElementById('protein').value = food.proteinPer100g;
            document.getElementById('fats').value = food.fatsPer100g;
            this.currentFood = food;
        }
    },
    
    saveFood: function() {
        const foodName = document.getElementById('food').value.trim();
        const calories = document.getElementById('calories').value;
        const protein = document.getElementById('protein').value;
        const fats = document.getElementById('fats').value;
        
        if (!foodName || !calories || !protein || !fats) {
            alert('��������� ��� ���� ��� ���������� �����');
            return;
        }
        
        const foodData = {
            name: foodName,
            caloriesPer100g: parseFloat(calories),
            proteinPer100g: parseFloat(protein),
            fatsPer100g: parseFloat(fats)
        };
        
        // ���������, ���� �� ��� ����� �����
        const existingIndex = this.foodDatabase.findIndex(food => food.name === foodName);
        if (existingIndex >= 0) {
            // ��������� ������������
            this.foodDatabase[existingIndex] = foodData;
        } else {
            // ��������� �����
            this.foodDatabase.push(foodData);
        }
        
        // ��������� � localStorage
        localStorage.setItem('foodDatabase', JSON.stringify(this.foodDatabase));
        this.loadFoodDatabase();
        alert(`����� "${foodName}" ���������!`);
    },
    
    calculateNutrition: function() {
        // �������� ������ �� �����
        const foodName = document.getElementById('food').value.trim();
        const weight = parseFloat(document.getElementById('weight').value);
        const caloriesPer100g = parseFloat(document.getElementById('calories').value);
        const proteinPer100g = parseFloat(document.getElementById('protein').value);
        const fatsPer100g = parseFloat(document.getElementById('fats').value);
        
        // ��������� ���������� �����
        if (!foodName || !weight || !caloriesPer100g || isNaN(proteinPer100g) || isNaN(fatsPer100g)) {
            alert('����������, ��������� ��� ����');
            return;
        }
        
        // ������������ ������� ��������
        const ratio = weight / 100;
        const totalCalories = Math.round(caloriesPer100g * ratio);
        const totalProtein = (proteinPer100g * ratio).toFixed(1);
        const totalFats = (fatsPer100g * ratio).toFixed(1);
        
        // ��������� � �������
        this.foodHistory.push({
            name: foodName,
            weight: weight,
            calories: totalCalories,
            protein: totalProtein,
            fats: totalFats,
            timestamp: new Date().toLocaleString()
        });
        
        // ���������� ����������
        this.displayResults(foodName, totalCalories, totalProtein, totalFats);
    },
    
    displayResults: function(foodName, calories, protein, fats) {
        // ������������� ��������
        document.getElementById('foodName').textContent = foodName;
        document.getElementById('totalCalories').textContent = calories;
        document.getElementById('totalProtein').textContent = protein;
        document.getElementById('totalFats').textContent = fats;
        
        // �������� ������
        this.animateCircles();
        
        // ��������� �������
        this.updateHistory();
        
        // ���������� ������ � ������������
        document.getElementById('resultSection').style.display = 'block';
    },
    
    animateCircles: function() {
        const circles = [
            document.getElementById('caloriesCircle'),
            document.getElementById('proteinCircle'),
            document.getElementById('fatsCircle')
        ];
        
        circles.forEach((circle, index) => {
            circle.style.transform = 'scale(0)';
            setTimeout(() => {
                circle.style.transition = `transform 0.5s ease-out ${index * 0.2}s`;
                circle.style.transform = 'scale(1)';
            }, 100);
        });
    },
    
    updateHistory: function() {
        const foodListElement = document.getElementById('foodList');
        foodListElement.innerHTML = '';
        
        let totalCalories = 0;
        let totalProtein = 0;
        let totalFats = 0;
        
        this.foodHistory.forEach(item => {
            const foodItem = document.createElement('div');
            foodItem.className = 'food-item';
            foodItem.innerHTML = `
                <span>${item.name} (${item.weight}�)</span>
                <span>${item.calories} ����</span>
            `;
            foodListElement.appendChild(foodItem);
            
            totalCalories += item.calories;
            totalProtein += parseFloat(item.protein);
            totalFats += parseFloat(item.fats);
        });
        
        // ��������� �������� ������
        if (this.foodHistory.length > 1) {
            const totalsItem = document.createElement('div');
            totalsItem.className = 'food-item';
            totalsItem.innerHTML = `
                <span>�����:</span>
                <span>${totalCalories} ���� (�: ${totalProtein.toFixed(1)}�, �: ${totalFats.toFixed(1)}�)</span>
            `;
            foodListElement.appendChild(totalsItem);
        }
    },
    
    resetForm: function() {
        document.getElementById('food').value = '';
        document.getElementById('weight').value = '';
        document.getElementById('resultSection').style.display = 'none';
        document.getElementById('food').focus();
    }
};

// ������������� ����������
document.addEventListener('DOMContentLoaded', () => App.init());
