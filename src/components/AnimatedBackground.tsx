import { useEffect, useRef } from "react";
import * as THREE from "three";

const AnimatedBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x9333ea, 2, 100);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x3b82f6, 2, 100);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xec4899, 1.5, 100);
    pointLight3.position.set(0, 15, 5);
    scene.add(pointLight3);

    // Floating objects array
    const floatingObjects: {
      mesh: THREE.Mesh;
      velocity: THREE.Vector3;
      rotationSpeed: THREE.Vector3;
      originalY: number;
      floatOffset: number;
    }[] = [];

    // Create various geometric shapes
    const geometries = [
      new THREE.IcosahedronGeometry(0.8, 0),
      new THREE.OctahedronGeometry(0.7, 0),
      new THREE.TetrahedronGeometry(0.9, 0),
      new THREE.DodecahedronGeometry(0.6, 0),
      new THREE.TorusGeometry(0.5, 0.2, 8, 16),
      new THREE.TorusKnotGeometry(0.4, 0.15, 64, 8),
      new THREE.SphereGeometry(0.5, 16, 16),
      new THREE.BoxGeometry(0.7, 0.7, 0.7),
    ];

    // Gradient materials with transparency
    const materials = [
      new THREE.MeshPhongMaterial({
        color: 0x9333ea,
        transparent: true,
        opacity: 0.7,
        shininess: 100,
        wireframe: false,
      }),
      new THREE.MeshPhongMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.6,
        shininess: 100,
        wireframe: false,
      }),
      new THREE.MeshPhongMaterial({
        color: 0xec4899,
        transparent: true,
        opacity: 0.7,
        shininess: 100,
        wireframe: false,
      }),
      new THREE.MeshPhongMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.6,
        shininess: 100,
        wireframe: false,
      }),
      new THREE.MeshPhongMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.5,
        shininess: 100,
        wireframe: true,
      }),
      new THREE.MeshPhongMaterial({
        color: 0x6366f1,
        transparent: true,
        opacity: 0.8,
        shininess: 100,
        wireframe: true,
      }),
    ];

    // Create floating objects
    for (let i = 0; i < 40; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = materials[Math.floor(Math.random() * materials.length)].clone();
      const mesh = new THREE.Mesh(geometry, material);

      // Random position spread across the scene
      mesh.position.x = (Math.random() - 0.5) * 30;
      mesh.position.y = (Math.random() - 0.5) * 30;
      mesh.position.z = (Math.random() - 0.5) * 20 - 5;

      // Random scale
      const scale = Math.random() * 1.5 + 0.5;
      mesh.scale.set(scale, scale, scale);

      // Random initial rotation
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      mesh.rotation.z = Math.random() * Math.PI;

      scene.add(mesh);

      floatingObjects.push({
        mesh,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          Math.random() * 0.008 + 0.002, // Upward drift (antigravity)
          (Math.random() - 0.5) * 0.005
        ),
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        ),
        originalY: mesh.position.y,
        floatOffset: Math.random() * Math.PI * 2,
      });
    }

    // Create particle system for stars/dust
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 500;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 50;
      positions[i + 1] = (Math.random() - 0.5) * 50;
      positions[i + 2] = (Math.random() - 0.5) * 30 - 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x9333ea,
      size: 0.08,
      transparent: true,
      opacity: 0.3,
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    camera.position.z = 10;

    // Mouse tracking for subtle interaction
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Animate floating objects
      floatingObjects.forEach((obj, index) => {
        // Antigravity float effect
        obj.mesh.position.y += obj.velocity.y;
        obj.mesh.position.x += obj.velocity.x + Math.sin(time + obj.floatOffset) * 0.002;
        obj.mesh.position.z += obj.velocity.z;

        // Gentle bobbing motion
        obj.mesh.position.y += Math.sin(time * 0.5 + obj.floatOffset) * 0.005;

        // Reset position if too far
        if (obj.mesh.position.y > 20) {
          obj.mesh.position.y = -20;
        }
        if (obj.mesh.position.y < -20) {
          obj.mesh.position.y = 20;
        }
        if (Math.abs(obj.mesh.position.x) > 20) {
          obj.mesh.position.x *= -0.9;
        }

        // Smooth rotation
        obj.mesh.rotation.x += obj.rotationSpeed.x;
        obj.mesh.rotation.y += obj.rotationSpeed.y;
        obj.mesh.rotation.z += obj.rotationSpeed.z;

        // Pulse opacity
        const material = obj.mesh.material as THREE.MeshPhongMaterial;
        material.opacity = 0.4 + Math.sin(time + index) * 0.2;
      });

      // Animate particles slowly upward
      const particlePositions = particlesGeometry.attributes.position.array as Float32Array;
      for (let i = 1; i < particlePositions.length; i += 3) {
        particlePositions[i] += 0.01;
        if (particlePositions[i] > 25) {
          particlePositions[i] = -25;
        }
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      // Subtle camera movement based on mouse
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
      camera.position.y += (mouseY * 1.5 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      // Animate lights
      pointLight1.position.x = Math.sin(time * 0.3) * 15;
      pointLight1.position.y = Math.cos(time * 0.2) * 15;
      pointLight2.position.x = Math.cos(time * 0.4) * 15;
      pointLight2.position.z = Math.sin(time * 0.3) * 10;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
      geometries.forEach(g => g.dispose());
      materials.forEach(m => m.dispose());
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 bg-background"
    />
  );
};

export default AnimatedBackground;
