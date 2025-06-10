import React, { useEffect, useRef } from 'react';
import { Brain, Library, Users, Lightbulb } from 'lucide-react';

const features = [
  {
    icon: <Brain size={36} />,
    title: "AI-Generated Perspectives",
    description: "Our intelligent system automatically generates a diverse range of analytical angles tailored to your specific query, moving beyond obvious interpretations."
  },
  {
    icon: <Library size={36} />,
    title: "Access 100+ Thinking Models",
    description: "Tap into a vast library of established thinking models and frameworks to dissect problems with proven methodologies, all suggested by AI."
  },
  {
    icon: <Users size={36} />,
    title: "Praised by 2,000+ Innovators",
    description: "Join a growing community of thinkers, creators, and problem-solvers who rely on InsightBlast AI for deeper understanding and creative breakthroughs."
  },
  {
    icon: <Lightbulb size={36} />,
    title: "Spark Unforeseen Insights",
    description: "Break free from conventional thought patterns and discover connections and solutions you might not have found otherwise."
  }
];

const Features: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
      sectionRef.current.classList.add('visible');
    }
    
    featureRefs.current.forEach(ref => {
      if (ref) {
        observer.observe(ref);
        ref.classList.add('visible');
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section id="features" ref={sectionRef} className="section bg-card">
      <div className="container-custom">
        <div className="text-center mb-16 visible">
          <h2 className="mb-4">The InsightBlast AI Advantage</h2>
          <p className="max-w-3xl mx-auto">
            Discover why thousands of innovators, researchers, and problem-solvers choose our platform for deeper, more comprehensive analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={el => { featureRefs.current[index] = el; }}
              className="card visible"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="text-accent mb-4">{feature.icon}</div>
              <h3 className="mb-3">{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 