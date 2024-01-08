document.addEventListener("DOMContentLoaded", function() {
    // Hier können Sie JavaScript-Logik für Ihr VR-Spiel einfügen
    
    // Beispiel: Spielerbewegung beim Drücken der Pfeiltasten
    document.addEventListener('keydown', function(event) {
      const player = document.getElementById('player');
      const playerPosition = player.getAttribute('position');
      const step = 0.2;
  
      if (event.key === 'ArrowUp') {
        player.setAttribute('position', {
          x: playerPosition.x,
          y: playerPosition.y,
          z: playerPosition.z - step
        });
      } else if (event.key === 'ArrowDown') {
        player.setAttribute('position', {
          x: playerPosition.x,
          y: playerPosition.y,
          z: playerPosition.z + step
        });
      } else if (event.key === 'ArrowLeft') {
        player.setAttribute('position', {
          x: playerPosition.x - step,
          y: playerPosition.y,
          z: playerPosition.z
        });
      } else if (event.key === 'ArrowRight') {
        player.setAttribute('position', {
          x: playerPosition.x + step,
          y: playerPosition.y,
          z: playerPosition.z
        });
      }
      
      // Beispiel: Überprüfung, ob Spieler das Ziel erreicht hat
      const goal = document.getElementById('goal');
      const goalPosition = goal.getAttribute('position');
      const playerX = playerPosition.x;
      const playerZ = playerPosition.z;
      if (playerX === goalPosition.x && playerZ === goalPosition.z) {
        alert('Du hast das Ziel erreicht!');
        // Hier können weitere Aktionen nach dem Erreichen des Ziels ausgeführt werden
      }
    });
  });
  