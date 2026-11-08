import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { artwork } from "../lib/artwork";
import { exhibits } from "../lib/exhibits";

const spots = [
  new THREE.Vector3(-9.22, 2.8, -2.47),
  new THREE.Vector3(-6.75, 2.8, -6.75),
  new THREE.Vector3(6.75, 2.8, -6.75),
  new THREE.Vector3(-2.85, 2.8, -14),
  new THREE.Vector3(2.85, 2.8, -19),
];
export default function MuseumScene({
  exploring,
  paused,
  onOpen,
  onNearest,
  onRegion,
}: {
  exploring: boolean;
  paused: boolean;
  onOpen: (id: number) => void;
  onNearest: (id: number | null) => void;
  onRegion: (inRomanWing: boolean) => void;
}) {
  const mount = useRef<HTMLDivElement>(null),
    state = useRef({ paused, onOpen, onNearest, onRegion });
  state.current = { paused, onOpen, onNearest, onRegion };
  const joystick = useRef({ x: 0, y: 0 });
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const [error, setError] = useState(false);
  useEffect(() => {
    const el = mount.current!;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: window.devicePixelRatio < 2,
        alpha: false,
        powerPreference: "low-power",
      });
    } catch {
      setError(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor("#101c2a");
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog("#101c2a", 22, 48);
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 70);
    camera.position.set(exploring ? 0 : 2, exploring ? 1.7 : 2.6, exploring ? 5 : 8);
    camera.rotation.order = "YXZ";
    camera.lookAt(-0.4, 2.6, -7);
    const gold = new THREE.MeshStandardMaterial({
      color: "#ae8f51",
      metalness: 0.65,
      roughness: 0.4,
    });
    const navy = new THREE.MeshStandardMaterial({ color: "#182b41", roughness: 0.9 });
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#d5d0bd";
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 30; i++) {
      ctx.strokeStyle = i % 2 ? "#8a8e8b25" : "#ffffff65";
      ctx.lineWidth = (i % 4) + 1;
      ctx.beginPath();
      for (let y = 0; y < 560; y += 10) {
        let x = i * 23 + Math.sin(y / 95 + i) * 38 - y * 0.3;
        if (y) {
          ctx.lineTo(x, y);
        } else {
          ctx.moveTo(x, y);
        }
      }
      ctx.stroke();
    }
    const marbleTexture = new THREE.CanvasTexture(canvas);
    marbleTexture.colorSpace = THREE.SRGBColorSpace;
    marbleTexture.wrapS = marbleTexture.wrapT = THREE.RepeatWrapping;
    marbleTexture.repeat.set(5, 5);
    const marble = new THREE.MeshStandardMaterial({
      map: marbleTexture,
      color: "#d4d1c5",
      roughness: 0.32,
      metalness: 0.1,
    });
    const cream = new THREE.MeshStandardMaterial({ color: "#c9c3ac", roughness: 0.45 });
    const box = (
      w: number,
      h: number,
      d: number,
      x: number,
      y: number,
      z: number,
      mat: THREE.Material,
      parent: THREE.Object3D = scene,
    ) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z);
      parent.add(m);
      return m;
    };
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 0.12, 64), marble);
    floor.position.y = -0.06;
    scene.add(floor);
    box(6, 0.12, 15, 0, -0.06, -16, marble);
    // Segmented circular walls leave a real opening to the Roman Wing.
    for (let i = 0; i < 64; i++) {
      let a = ((i + 0.5) / 64) * Math.PI * 2;
      let x = Math.sin(a) * 10,
        z = Math.cos(a) * 10;
      if (z < -9.4 && Math.abs(x) < 3.05) continue;
      const wall = box(1.04, 6, 0.3, x, 3, z, navy);
      wall.rotation.y = a;
      for (const y of [0.18, 5.65]) {
        let trim = box(1.04, 0.07, 0.36, x, y, z, gold);
        trim.rotation.y = a;
      }
    }
    box(0.2, 6, 14, -3, 3, -16, navy);
    box(0.2, 6, 14, 3, 3, -16, navy);
    box(6, 6, 0.2, 0, 3, -23, navy);
    for (const x of [-3, 3]) for (const y of [0.2, 5.65]) box(0.25, 0.07, 14, x, y, -16, gold);
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(10.05, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: "#101d32", side: THREE.BackSide }),
    );
    dome.position.y = 5.85;
    dome.scale.y = 0.48;
    scene.add(dome);
    let starSeed = 431;
    const rnd = () => {
      starSeed = (starSeed * 16807) % 2147483647;
      return starSeed / 2147483647;
    };
    let starPositions = [];
    for (let i = 0; i < 320; i++) {
      let a = rnd() * Math.PI * 2,
        t = rnd() * Math.PI * 0.48;
      starPositions.push(
        Math.cos(a) * Math.sin(t) * 9.9,
        5.85 + Math.cos(t) * 4.7,
        Math.sin(a) * Math.sin(t) * 9.9,
      );
    }
    let starGeom = new THREE.BufferGeometry();
    starGeom.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
    scene.add(
      new THREE.Points(
        starGeom,
        new THREE.PointsMaterial({ color: "#efdab1", size: 0.045, sizeAttenuation: true }),
      ),
    );
    const columns: THREE.Vector3[] = [];
    for (let i = 0; i < 12; i++) {
      let a = (i * Math.PI) / 6,
        x = Math.sin(a) * 9,
        z = Math.cos(a) * 9;
      if (z < -8 && Math.abs(x) < 3) continue;
      columns.push(new THREE.Vector3(x, 0, z));
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.36, 5.5, 12), cream);
      shaft.position.set(x, 2.8, z);
      scene.add(shaft);
      for (const y of [0.16, 5.52]) {
        box(0.9, 0.28, 0.9, x, y, z, marble);
        box(0.96, 0.065, 0.96, x, y + 0.15, z, gold);
      }
    }
    // Inlaid concentric rings and a restrained compass rose in the marble.
    for (const r of [2.5, 2.55, 7.65, 7.72, 9.6]) {
      const ring = new THREE.Mesh(new THREE.RingGeometry(r, r + 0.025, 80), gold);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.009;
      scene.add(ring);
    }
    for (let i = 0; i < 8; i++) {
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.lineTo(-0.18, 0.65);
      shape.lineTo(0, 2.1);
      shape.lineTo(0.18, 0.65);
      shape.closePath();
      let mesh = new THREE.Mesh(new THREE.ShapeGeometry(shape), gold);
      mesh.rotation.x = -Math.PI / 2;
      mesh.rotation.z = (i * Math.PI) / 4;
      mesh.position.y = 0.015;
      scene.add(mesh);
    }
    const textPlane = (
      text: string,
      w: number,
      h: number,
      x: number,
      y: number,
      z: number,
      size = 45,
    ) => {
      let c = document.createElement("canvas");
      c.width = 1024;
      c.height = 256;
      let g = c.getContext("2d")!;
      g.fillStyle = "#e0c68d";
      g.textAlign = "center";
      g.font = `${size}px Georgia`;
      g.fillText(text, 512, 135);
      let m = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true }),
      );
      m.position.set(x, y, z);
      scene.add(m);
      return m;
    };
    textPlane("T H E   R O M A N   W I N G", 4.6, 1.1, 0, 5.12, -9.8, 45);
    textPlane("NAMES THAT BECAME WORDS", 5, 1.1, 0, 3.8, -22.8, 45);
    const clickables: THREE.Object3D[] = [];
    spots.forEach((p, i) => {
      let group = new THREE.Group();
      group.position.copy(p);
      const inward = i < 3 ? new THREE.Vector3(0, p.y, 0) : new THREE.Vector3(0, p.y, p.z);
      group.lookAt(inward);
      scene.add(group);
      box(2.45, 3.05, 0.12, 0, 0, 0, gold, group);
      box(
        2.25,
        2.85,
        0.14,
        0,
        0,
        0.03,
        new THREE.MeshStandardMaterial({ color: "#604b2c", metalness: 0.4, roughness: 0.5 }),
        group,
      );
      const artTexture = new THREE.CanvasTexture(artwork(i + 1));
      artTexture.colorSpace = THREE.SRGBColorSpace;
      let picture = new THREE.Mesh(
        new THREE.PlaneGeometry(2.05, 2.62),
        new THREE.MeshBasicMaterial({ map: artTexture, toneMapped: false }),
      );
      picture.position.z = 0.115;
      picture.userData.id = i + 1;
      group.add(picture);
      clickables.push(picture);
      for (const x of [-1.18, 1.18]) box(0.045, 3.05, 0.04, x, 0, 0.1, cream, group);
      for (const y of [-1.47, 1.47]) box(2.4, 0.045, 0.04, 0, y, 0.1, cream, group);
      const plaque = document.createElement("canvas");
      plaque.width = 512;
      plaque.height = 100;
      let g = plaque.getContext("2d")!;
      g.fillStyle = "#0c1927";
      g.fillRect(0, 0, 512, 100);
      g.fillStyle = "#dbc18a";
      g.textAlign = "center";
      g.font = "20px Georgia";
      g.fillText(`0${i + 1}  /  ${exhibits[i].short.toUpperCase()}`, 256, 55);
      let pm = new THREE.Mesh(
        new THREE.PlaneGeometry(2.7, 0.52),
        new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(plaque) }),
      );
      pm.position.set(0, -1.95, 0.15);
      group.add(pm);
      let light = new THREE.PointLight("#ffd99c", 8, 5, 2);
      light.position.set(0, 1.7, 1.5);
      group.add(light);
    });
    scene.add(new THREE.HemisphereLight("#c4d0e3", "#8d795c", 2));
    let overhead = new THREE.PointLight("#fff3d0", 100, 25, 2);
    overhead.position.set(0, 5.5, 0);
    scene.add(overhead);
    const winglight = new THREE.PointLight("#f5d5a1", 45, 16, 2);
    winglight.position.set(0, 4.8, -16);
    scene.add(winglight);
    let resize = new ResizeObserver(() => {
      const w = el.clientWidth,
        h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    });
    resize.observe(el);
    const keys = new Set<string>();
    let inRomanWing = false;
    let nearest: number | null = null,
      drag = false,
      lastX = 0,
      lastY = 0,
      moved = 0;
    const down = (e: KeyboardEvent) => {
      if (
        state.current.paused ||
        !exploring ||
        /INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement)?.tagName)
      )
        return;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key))
        e.preventDefault();
      keys.add(e.key.toLowerCase());
      if (e.key.toLowerCase() === "e" && nearest) state.current.onOpen(nearest);
    };
    const up = (e: KeyboardEvent) => keys.delete(e.key.toLowerCase());
    const blur = () => {
      keys.clear();
      joystick.current = { x: 0, y: 0 };
    };
    const pointerDown = (e: PointerEvent) => {
      if (!exploring || state.current.paused) return;
      drag = true;
      moved = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      renderer.domElement.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!exploring || state.current.paused) return;
      if (document.pointerLockElement === renderer.domElement || drag) {
        let dx = document.pointerLockElement ? e.movementX : e.clientX - lastX,
          dy = document.pointerLockElement ? e.movementY : e.clientY - lastY;
        camera.rotation.y -= dx * 0.003;
        camera.rotation.x = THREE.MathUtils.clamp(camera.rotation.x - dy * 0.003, -1.1, 1.1);
        moved += Math.abs(dx) + Math.abs(dy);
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };
    const pointerUp = (e: PointerEvent) => {
      drag = false;
      if (!exploring || state.current.paused || moved > 8) return;
      const rect = renderer.domElement.getBoundingClientRect();
      const ray = new THREE.Raycaster();
      ray.setFromCamera(
        new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          (-(e.clientY - rect.top) / rect.height) * 2 + 1,
        ),
        camera,
      );
      let hit = ray.intersectObjects(clickables)[0];
      if (hit && hit.distance < 5) state.current.onOpen(hit.object.userData.id);
      else if (e.pointerType === "mouse" && !document.pointerLockElement) {
        try {
          renderer.domElement.requestPointerLock()?.catch(() => {});
        } catch {
          /* Drag look remains available. */
        }
      }
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    renderer.domElement.addEventListener("pointerdown", pointerDown);
    window.addEventListener("pointermove", move);
    renderer.domElement.addEventListener("pointerup", pointerUp);
    const valid = (x: number, z: number) => {
      const main = x * x + z * z < 9.25 * 9.25;
      const wing = Math.abs(x) < 2.5 && z < -8 && z > -22.4;
      if (!main && !wing) return false;
      return columns.every((c) => Math.hypot(x - c.x, z - c.z) > 0.68);
    };
    let previous = 0,
      frame = 0,
      lastRender = -1000;
    const animate = (time: number) => {
      frame = requestAnimationFrame(animate);
      const dt = Math.min((time - previous) / 1000, 0.1);
      previous = time;
      if (exploring && !state.current.paused) {
        const forward =
          Number(keys.has("w") || keys.has("arrowup")) -
          Number(keys.has("s") || keys.has("arrowdown")) -
          joystick.current.y;
        const side =
          Number(keys.has("d") || keys.has("arrowright")) -
          Number(keys.has("a") || keys.has("arrowleft")) +
          joystick.current.x;
        const norm = Math.max(1, Math.hypot(forward, side));
        let yaw = camera.rotation.y;
        let dx = ((side * Math.cos(yaw) - forward * Math.sin(yaw)) * dt * 3.2) / norm,
          dz = ((-forward * Math.cos(yaw) - side * Math.sin(yaw)) * dt * 3.2) / norm;
        if (valid(camera.position.x + dx, camera.position.z)) camera.position.x += dx;
        if (valid(camera.position.x, camera.position.z + dz)) camera.position.z += dz;
        const wing = camera.position.z < -9;
        if (wing !== inRomanWing) {
          inRomanWing = wing;
          state.current.onRegion(wing);
        }
        let close: number | null = null,
          best = 4;
        spots.forEach((p, i) => {
          const distance = Math.hypot(p.x - camera.position.x, p.z - camera.position.z);
          if (distance < best) {
            best = distance;
            close = i + 1;
          }
        });
        if (close !== nearest) {
          nearest = close;
          state.current.onNearest(close);
        }
      }
      if (state.current.paused && document.pointerLockElement) document.exitPointerLock();
      if (lastRender === -1000 || (exploring && !state.current.paused && time - lastRender >= 33)) {
        renderer.render(scene, camera);
        lastRender = time;
      }
    };
    frame = requestAnimationFrame(animate);
    const jump = (e: Event) => {
      let id = (e as CustomEvent<number>).detail;
      const p = spots[id - 1];
      if (!p) return;
      const inward =
        id <= 3
          ? new THREE.Vector3(-p.x, 0, -p.z).normalize()
          : new THREE.Vector3(id === 4 ? 1 : -1, 0, 0);
      camera.position.copy(p).addScaledVector(inward, 2.7);
      camera.position.y = 1.7;
      camera.lookAt(p.x, 2.6, p.z);
    };
    window.addEventListener("museum-jump", jump);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("museum-jump", jump);
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
      window.removeEventListener("pointermove", move);
      renderer.domElement.removeEventListener("pointerdown", pointerDown);
      renderer.domElement.removeEventListener("pointerup", pointerUp);
      if (document.pointerLockElement === renderer.domElement) document.exitPointerLock();
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.Points) {
          o.geometry.dispose();
          const ms = Array.isArray(o.material) ? o.material : [o.material];
          ms.forEach((m: THREE.Material & { map?: THREE.Texture }) => {
            m.map?.dispose();
            m.dispose();
          });
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [exploring]);
  return (
    <>
      <div className="scene-canvas" ref={mount} aria-label="Interactive 3D marble museum" />
      {error && (
        <div className="scene-fallback">
          <h2>Your collection awaits.</h2>
          <p>
            3D graphics are unavailable in this browser. Every exhibit and activity is still
            accessible through the collection menu.
          </p>
        </div>
      )}
      {exploring && !paused && (
        <div
          className="joystick"
          aria-label="Movement joystick"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            const r = e.currentTarget.getBoundingClientRect();
            const x = Math.max(-1, Math.min(1, (e.clientX - r.left - r.width / 2) / 35)),
              y = Math.max(-1, Math.min(1, (e.clientY - r.top - r.height / 2) / 35));
            joystick.current = { x, y };
            setKnob({ x: x * 30, y: y * 30 });
          }}
          onPointerMove={(e) => {
            if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
            const r = e.currentTarget.getBoundingClientRect();
            const x = Math.max(-1, Math.min(1, (e.clientX - r.left - r.width / 2) / 35)),
              y = Math.max(-1, Math.min(1, (e.clientY - r.top - r.height / 2) / 35));
            joystick.current = { x, y };
            setKnob({ x: x * 30, y: y * 30 });
          }}
          onPointerUp={() => {
            joystick.current = { x: 0, y: 0 };
            setKnob({ x: 0, y: 0 });
          }}
          onPointerCancel={() => {
            joystick.current = { x: 0, y: 0 };
            setKnob({ x: 0, y: 0 });
          }}
        >
          <span style={{ transform: `translate(${knob.x}px,${knob.y}px)` }} />
        </div>
      )}
    </>
  );
}
