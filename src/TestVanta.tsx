import React, { useEffect, useRef, useState } from 'react';
import VantaClouds from 'vanta/dist/vanta.clouds.min';
import * as THREE from 'three';

// Ensure THREE is available globally for Vanta.js
window.THREE = THREE;

const TestVanta: React.FC = () => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<ReturnType<typeof VantaClouds> | null>(null);

  useEffect(() => {
    if (!vantaRef.current) {
      console.warn('Vanta ref is not available yet');
      return;
    }

    if (!vantaEffect) {
      try {
        console.log('Initializing Vanta CLOUDS effect');
        const effect = VantaClouds({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          backgroundColor: 0xffffff, // White background
          skyColor: 0x81b5c9,       // Light blue sky
          cloudColor: 0xadc1de,     // Light gray clouds
          cloudShadowColor: 0x183550,// Darker shadow
          sunColor: 0xff9919,       // Orange sun
          sunGlareColor: 0xff6633,  // Orange glare
          sunlightColor: 0xff9933,   // Orange sunlight
          speed: 1.0,               // Default speed
        });
        setVantaEffect(effect);
        console.log('Vanta CLOUDS effect initialized successfully');

        // Debug animation loop
        effect.renderer.setAnimationLoop(() => {
          console.log('Vanta animation loop running');
          effect.renderer.render(effect.scene, effect.camera);
        });
      } catch (error) {
        console.error('Vanta error:', error);
      }
    }

    return () => {
      if (vantaEffect) {
        try {
          vantaEffect.renderer.setAnimationLoop(null);
          vantaEffect.destroy();
          console.log('Vanta CLOUDS effect destroyed');
          setVantaEffect(null);
        } catch (error) {
          console.error('Error destroying Vanta effect:', error);
        }
      }
    };
  }, [vantaRef.current, vantaEffect]);

  return (
    <div
      ref={vantaRef}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0,
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <h1 style={{ color: 'white', textAlign: 'center', zIndex: 10, position: 'relative' }}>
        Vanta CLOUDS Test
      </h1>
    </div>
  );
};

export default TestVanta;