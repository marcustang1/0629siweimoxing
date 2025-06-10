import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "What kind of questions can I use with InsightBlast AI?",
    answer: "InsightBlast AI is designed for a wide range of queries, from complex business challenges and academic research questions to creative brainstorming and personal development ideas. Our system adapts to provide relevant perspectives no matter what domain you're exploring."
  },
  {
    question: "How many analysis angles will I get?",
    answer: "The number of angles varies depending on your query's complexity. Our AI aims to provide a comprehensive yet manageable set of relevant perspectives for you to explore, typically between 5-12 distinct angles to ensure both breadth and depth."
  },
  {
    question: "Is there a limit to how many times I can 're-blast' or explore different angles?",
    answer: "Our goal is to encourage deep exploration! While specific usage may depend on your plan, we aim to provide ample opportunity to delve into multiple facets of your query and continuously refine your understanding."
  },
  {
    question: "How does InsightBlast AI differ from standard search engines?",
    answer: "While search engines provide links to information, InsightBlast AI actively analyzes your query and structures responses around diverse thinking models and perspectives, fostering deeper understanding rather than just information retrieval. We're focused on helping you think about your questions in new ways."
  },
  {
    question: "Can I save and organize my insights for later reference?",
    answer: "Absolutely! InsightBlast AI allows you to save, organize, and export your insights. You can create collections of related queries, add notes to specific perspectives, and return to them anytime as your understanding evolves."
  }
];

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  toggleOpen: () => void;
  itemRef: React.RefObject<HTMLDivElement>;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, toggleOpen, itemRef }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={itemRef} className="border-b border-separator py-6 visible">
      <button
        className="flex w-full justify-between items-center text-left focus:outline-none"
        onClick={toggleOpen}
        aria-expanded={isOpen}
      >
        <h3 className="text-xl font-medium">{question}</h3>
        <span className="text-accent ml-4">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight || 1000}px` : '0',
          opacity: isOpen ? 1 : 0
        }}
      >
        <div ref={contentRef} className="pt-4">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
    
    itemRefs.current.forEach(ref => {
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
    <section id="faq" ref={sectionRef} className="section bg-background">
      <div className="container-custom">
        <div className="text-center mb-12 visible">
          <h2 className="mb-4">Frequently Asked Questions</h2>
          <p className="max-w-3xl mx-auto">
            Everything you need to know about InsightBlast AI and how it can transform your thinking process.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              toggleOpen={() => toggleFAQ(index)}
              itemRef={el => {
                itemRefs.current[index] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;