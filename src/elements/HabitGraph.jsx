import { useEffect, useRef } from "react";
import Chart from "chart.js";

function HabitGraph() {
  const chartRef = useRef(null);
  const habitData = {
    "kIb0fk0ZcTO1OAbnlBbK": {
      name: "Привычка 1",
      days: {
        "1": 100,
        "2": 5000,
        "3": 300,
        "4": 700,
        "5": 2000
      }
    },
    "gHEJrquGUwi2D0uSDrVZ": {
      name: "Привычка 2",
      days: {
        "1": 1000,
        "2": 300,
        "3": 5000,
        "4": 100,
        "5": 450
      }
    }
  };

  useEffect(() => {
    const habitIds = Object.keys(habitData);

    if (habitIds.length > 0) {
      const dayLabels = Object.keys(habitData[habitIds[0]].days);
      const datasets = habitIds.map((habitId) => {
        const habit = habitData[habitId];
        const habitName = habit.name;
        const habitScores = Object.values(habit.days);

        return {
          label: habitName,
          data: habitScores,
          borderColor: getRandomColor(),
          backgroundColor: getRandomColor(0.2),
          borderWidth: 2
        };
      });

      new Chart(chartRef.current, {
        type: "radar",
        data: {
          labels: dayLabels,
          datasets: datasets
        },
        options: {
          scale: {
            ticks: {
              beginAtZero: true,
            }
          }
        }
      });
    }
  }, []);

  const getRandomColor = (alpha = 1) => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return <canvas ref={chartRef} />;
}

export default HabitGraph;