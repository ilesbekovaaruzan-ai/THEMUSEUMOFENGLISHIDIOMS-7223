// Original, lightweight canvas illustrations; no image downloads or runtime services.
export function artwork(id: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 640;
  c.height = 800;
  const g = c.getContext("2d")!;
  let seed = id * 8721;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const grad = g.createLinearGradient(0, 0, 0, 800);
  grad.addColorStop(0, id === 4 ? "#201d24" : "#65717a");
  grad.addColorStop(0.55, id === 4 ? "#b77743" : "#c9b997");
  grad.addColorStop(1, "#413932");
  g.fillStyle = grad;
  g.fillRect(0, 0, 640, 800);
  g.fillStyle = "#ead6a8";
  g.globalAlpha = 0.55;
  g.beginPath();
  g.arc(470, 160, 62, 0, Math.PI * 2);
  g.fill();
  g.globalAlpha = 1;
  const poly = (p: number[][], color: string) => {
    g.fillStyle = color;
    g.beginPath();
    p.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
    g.closePath();
    g.fill();
  };
  const pillar = (x: number, y: number, w: number, h: number) => {
    g.fillStyle = "#cabc9c";
    g.fillRect(x, y, w, h);
    g.fillStyle = "#e4d9b8";
    g.fillRect(x - 5, y - 7, w + 10, 10);
    g.fillRect(x - 7, y + h - 7, w + 14, 12);
    g.strokeStyle = "#a49478";
    for (let k = 1; k < 4; k++) {
      g.beginPath();
      g.moveTo(x + (w * k) / 4, y + 8);
      g.lineTo(x + (w * k) / 4, y + h - 10);
      g.stroke();
    }
  };
  poly(
    [
      [0, 500],
      [110, 280],
      [240, 425],
      [405, 295],
      [640, 450],
      [640, 800],
      [0, 800],
    ],
    "#8b8875",
  );
  poly(
    [
      [0, 580],
      [160, 420],
      [320, 490],
      [520, 355],
      [640, 500],
      [640, 800],
      [0, 800],
    ],
    "#6b6c60",
  );
  if (id === 1) {
    poly(
      [
        [0, 640],
        [640, 535],
        [640, 800],
        [0, 800],
      ],
      "#a48a64",
    );
    for (let x = 50; x < 650; x += 95) pillar(x, 350, 30, 185);
    g.fillStyle = "#796042";
    g.fillRect(20, 331, 620, 24);
    for (const x of [200, 440]) {
      g.strokeStyle = "#352e27";
      g.lineWidth = 16;
      g.beginPath();
      g.arc(x, 650, 75, 0, Math.PI * 2);
      g.stroke();
      g.lineWidth = 5;
      for (let a = 0; a < 8; a++) {
        g.beginPath();
        g.moveTo(x, 650);
        g.lineTo(x + 70 * Math.cos((a * Math.PI) / 4), 650 + 70 * Math.sin((a * Math.PI) / 4));
        g.stroke();
      }
    }
    poly(
      [
        [120, 505],
        [490, 505],
        [460, 590],
        [155, 590],
      ],
      "#513b28",
    );
    g.fillStyle = "#9e7950";
    g.fillRect(120, 496, 370, 19);
    g.strokeStyle = "#d5ac56";
    g.lineWidth = 9;
    for (let i = 0; i < 7; i++) {
      g.beginPath();
      g.ellipse(310, 485, 35 + i * 3, 50 - i * 3, i * 0.7, 0, Math.PI * 2);
      g.stroke();
    }
    g.save();
    g.translate(370, 450);
    g.rotate(0.48);
    poly(
      [
        [-9, 20],
        [0, -265],
        [12, 20],
      ],
      "#d9d4bb",
    );
    g.fillStyle = "#c6a158";
    g.fillRect(-40, 20, 80, 12);
    g.fillStyle = "#3c2c23";
    g.fillRect(-8, 30, 16, 60);
    g.restore();
  } else if (id === 2) {
    poly(
      [
        [0, 800],
        [0, 740],
        [590, 350],
        [640, 365],
        [640, 800],
      ],
      "#615548",
    );
    poly(
      [
        [0, 800],
        [85, 780],
        [620, 402],
        [640, 800],
      ],
      "#93846b",
    );
    const rock = g.createRadialGradient(400, 390, 10, 420, 430, 110);
    rock.addColorStop(0, "#aaa38e");
    rock.addColorStop(1, "#403f39");
    g.fillStyle = rock;
    g.beginPath();
    g.arc(422, 427, 99, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "#332d26";
    g.lineWidth = 20;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(280, 566);
    g.lineTo(320, 527);
    g.lineTo(360, 503);
    g.moveTo(310, 538);
    g.lineTo(322, 576);
    g.lineTo(283, 623);
    g.moveTo(320, 578);
    g.lineTo(351, 605);
    g.lineTo(332, 640);
    g.stroke();
    g.fillStyle = "#342d25";
    g.beginPath();
    g.arc(319, 504, 19, 0, Math.PI * 2);
    g.fill();
  } else if (id === 3) {
    g.fillStyle = "#44372d";
    g.fillRect(0, 440, 640, 360);
    pillar(45, 90, 55, 470);
    pillar(530, 90, 55, 470);
    g.fillStyle = "#776b51";
    g.fillRect(35, 77, 570, 25);
    poly(
      [
        [115, 545],
        [300, 480],
        [325, 515],
        [515, 530],
        [500, 705],
        [325, 666],
        [135, 725],
      ],
      "#d9c9a0",
    );
    poly(
      [
        [115, 545],
        [300, 480],
        [325, 515],
        [325, 666],
        [135, 725],
      ],
      "#b9a77f",
    );
    g.strokeStyle = "#7c6d50";
    g.lineWidth = 2;
    for (let i = 0; i < 12; i++) {
      g.beginPath();
      g.moveTo(153, 560 + i * 11);
      g.lineTo(290, 520 + i * 10);
      g.stroke();
      g.beginPath();
      g.moveTo(351, 549 + i * 9);
      g.lineTo(477, 558 + i * 10);
      g.stroke();
    }
    g.fillStyle = "#a78a54";
    g.fillRect(467, 416, 24, 111);
    g.fillStyle = "#d4bb87";
    g.fillRect(470, 326, 18, 95);
    let glow = g.createRadialGradient(479, 315, 0, 479, 315, 115);
    glow.addColorStop(0, "#ffc978bb");
    glow.addColorStop(1, "#ffc97800");
    g.fillStyle = glow;
    g.fillRect(354, 190, 250, 250);
    poly(
      [
        [479, 289],
        [486, 318],
        [478, 329],
        [472, 318],
      ],
      "#ffe4a3",
    );
  } else {
    g.fillStyle = "#8f7b60";
    g.fillRect(0, 610, 640, 190);
    if (id === 4) {
      for (let i = 0; i < 7; i++) {
        let x = i * 100;
        g.fillStyle = i % 2 ? "#715a49" : "#938066";
        g.fillRect(x, 400 - (i % 3) * 32, 88, 220);
        for (let j = 0; j < 3; j++) {
          g.fillStyle = "#332f2a";
          g.fillRect(x + 16 + j * 22, 443 - (i % 3) * 32, 10, 24);
        }
      }
      g.fillStyle = "#584b3c";
      g.fillRect(153, 368, 352, 235);
      for (let i = 0; i < 6; i++) pillar(158 + i * 63, 357, 24, 253);
      g.fillStyle = "#c5b58e";
      g.fillRect(130, 335, 395, 25);
      poly(
        [
          [118, 335],
          [325, 230],
          [538, 335],
        ],
        "#d6c3a0",
      );
      poly(
        [
          [153, 323],
          [325, 254],
          [502, 323],
        ],
        "#9b886b",
      );
      for (let i = 0; i < 4; i++) {
        g.fillStyle = i % 2 ? "#baa786" : "#d0bd97";
        g.fillRect(120 - i * 12, 610 + i * 15, 410 + i * 24, 14);
      }
    } else {
      for (let row = 0; row < 3; row++) {
        for (let i = 0; i < 8; i++) {
          let x = 56 + i * 69,
            y = 345 + row * 83;
          g.fillStyle = row % 2 ? "#b9a785" : "#cbb998";
          g.fillRect(x, y, 69, 83);
          g.fillStyle = "#444039";
          g.beginPath();
          g.moveTo(x + 13, y + 73);
          g.lineTo(x + 13, y + 35);
          g.arc(x + 34, y + 35, 21, Math.PI, 0);
          g.lineTo(x + 55, y + 73);
          g.closePath();
          g.fill();
          g.fillStyle = "#e2d2af";
          g.fillRect(x, y + 73, 69, 9);
        }
      }
      g.fillStyle = "#c7b490";
      g.fillRect(44, 329, 568, 18);
      g.fillRect(44, 596, 568, 21);
      poly(
        [
          [44, 329],
          [140, 305],
          [537, 305],
          [612, 329],
        ],
        "#d6c3a0",
      );
    }
    if (id === 4) {
      for (let i = 0; i < 28; i++) {
        let x = rand() * 640,
          y = 420 + rand() * 290;
        poly(
          [
            [x - 20, y + 95],
            [x - 30, y + 35],
            [x, y - 60 - rand() * 90],
            [x + 10, y + 18],
            [x + 35, y + 95],
          ],
          i % 2 ? "#d89849aa" : "#d05b2aaa",
        );
      }
    } else {
      for (let i = 0; i < 40; i++) {
        g.fillStyle = "#c7b492";
        g.fillRect(rand() * 640, 640 + rand() * 120, 25 + rand() * 30, 10 + rand() * 15);
      }
    }
  }
  // Fine deterministic grain gives the illustrations a printed, archival character.
  for (let i = 0; i < 18000; i++) {
    g.fillStyle = rand() > 0.5 ? "#fff2cc0a" : "#16120c0d";
    g.fillRect(rand() * 640, rand() * 800, rand() * 3 + 1, rand() * 3 + 1);
  }
  const vignette = g.createRadialGradient(320, 370, 200, 320, 400, 530);
  vignette.addColorStop(0, "#00000000");
  vignette.addColorStop(1, "#171a20aa");
  g.fillStyle = vignette;
  g.fillRect(0, 0, 640, 800);
  return c;
}
const cache = new Map<number, string>();
export function artUrl(id: number) {
  if (!cache.has(id)) cache.set(id, artwork(id).toDataURL("image/jpeg", 0.85));
  return cache.get(id)!;
}
