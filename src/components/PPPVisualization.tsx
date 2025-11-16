'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export default function PPPVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Scene, camera, renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050911);

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(6, 6, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Label renderer (for text labels in 3D)
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(container.clientWidth, container.clientHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    container.appendChild(labelRenderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, labelRenderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 5;
    controls.maxDistance = 30;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Helper: create node (sphere) + label
    function createNode(position: THREE.Vector3, radius: number, color: number, labelText: string, isCenter = false) {
      const geometry = new THREE.SphereGeometry(radius, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color,
        emissive: isCenter ? 0x004477 : 0x000000,
        shininess: 60
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(position);
      scene.add(mesh);

      // Label
      const div = document.createElement('div');
      div.className = 'label' + (isCenter ? ' center' : '');
      div.textContent = labelText;
      div.style.color = 'white';
      div.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      div.style.fontSize = '14px';
      div.style.padding = '4px 8px';
      div.style.borderRadius = '4px';
      div.style.background = isCenter ? 'rgba(0, 128, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)';
      div.style.whiteSpace = 'nowrap';
      if (isCenter) {
        div.style.fontWeight = '600';
      }

      const label = new CSS2DObject(div);
      label.position.set(0, radius + 0.2, 0);
      mesh.add(label);

      return mesh;
    }

    // Central node: Cổng thông tin
    const centerNode = createNode(
      new THREE.Vector3(0, 0, 0),
      0.8,
      0x0080ff,
      'Cổng thông tin VCCI-HCM',
      true
    );

    // Surrounding PPP nodes
    const radius = 4.0;
    const nodes: THREE.Mesh[] = [];

    // Nhà nước
    nodes.push(
      createNode(
        new THREE.Vector3(radius, 0, 0),
        0.5,
        0x00c853,
        'Nhà nước\nKhung pháp lý, Chính sách, Chiến lược'
      )
    );

    // Doanh nghiệp
    nodes.push(
      createNode(
        new THREE.Vector3(-radius * 0.5, 0, radius * 0.866),
        0.5,
        0xffc400,
        'Doanh nghiệp\nĐổi mới, Quản trị bền vững, Chuỗi giá trị'
      )
    );

    // Xã hội dân sự
    nodes.push(
      createNode(
        new THREE.Vector3(-radius * 0.5, 0, -radius * 0.866),
        0.5,
        0xe91e63,
        'Xã hội dân sự\nGiám sát, Minh bạch, Lan tỏa giá trị'
      )
    );

    // Lines: center to each node + triangle between PPP actors
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xaaaaaa });

    // Center connections
    nodes.forEach(node => {
      const points = [];
      points.push(centerNode.position.clone());
      points.push(node.position.clone());
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, lineMaterial);
      scene.add(line);
    });

    // PPP triangle connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const p1 = nodes[i].position;
        const p2 = nodes[j].position;
        const points = [p1.clone(), p2.clone()];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, lineMaterial);
        scene.add(line);
      }
    }

    // Subtle rotation animation
    let animationFrameId: number;
    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      centerNode.rotation.y += 0.002;
      nodes.forEach(n => (n.rotation.y += 0.002));
      controls.update();
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    }
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      labelRenderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      container.removeChild(renderer.domElement);
      container.removeChild(labelRenderer.domElement);
      scene.clear();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-[600px] relative"
      style={{ background: '#0b1020' }}
    />
  );
}
