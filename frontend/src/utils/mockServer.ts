// src/utils/mockServer.ts

export const startMockServer = (callback: (data: any) => void) => {
  let timeTick = 491568.94;
  
  const interval = setInterval(() => {
    timeTick += 1.0;
    
    // Simulate an attack cycle: 15s normal, 5s spoofed
    const seconds = Math.floor(Date.now() / 1000) % 20;
    const isAttack = seconds > 15;

    const mockPacket = {
      'PRN': 6.0,
      'DO': 1122.45 + (Math.random() * 2),
      'PD': -238563.76,
      'RX': 491568.94,
      'TOW': timeTick,
      'CP': -25735.91,
      'EC': 166873.05,
      'LC': 172436.52,
      'PC': 190730.17,
      'PIP': -189653.69,
      'PQP': -20235.525,
      'TCD': 1120.2404,
      // Drop signal strength during "attack"
      'CN0': isAttack ? 32 + (Math.random() * 8) : 48 + (Math.random() * 2),
      'Output': isAttack ? 1.0 : 0.0
    };

    callback(mockPacket);
  }, 1000); // 1Hz update rate

  return () => clearInterval(interval);
};