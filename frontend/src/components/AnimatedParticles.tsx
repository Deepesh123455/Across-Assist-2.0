import { motion } from 'framer-motion';

interface Particle {
  id: number;
  size: number;
  duration: number;
  delay: number;
  x: number;
  y: number;
  color: string;
}

const particles: Particle[] = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 8 + 12,
  delay: Math.random() * 2,
  x: Math.random() * 100,
  y: Math.random() * 100,
  color: i % 2 === 0 ? '#1A56DB' : '#F97316',
}));

export default function AnimatedParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full mix-blend-screen"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: particle.color,
            opacity: 0.15,
            filter: 'blur(1px)',
          }}
          animate={{
            y: [0, -window.innerHeight * 1.2],
            opacity: [0.15, 0.3, 0.15],
            x: [0, Math.random() * 100 - 50],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Floating orbs for extra visual depth */}
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          left: '10%',
          top: '20%',
          background: 'radial-gradient(circle, rgba(26,86,219,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute w-80 h-80 rounded-full"
        style={{
          right: '15%',
          bottom: '10%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
