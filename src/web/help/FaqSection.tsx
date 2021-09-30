import { ComponentChild, RenderableProps } from "preact";
import { useCallback, useRef, useState } from "preact/hooks";
import "./FaqSection.css";

const NB_INSTANCES = 0;

export interface FaqSectionProps {
  question: ComponentChild;
  startExpanded?: boolean;
}

export function FaqSection({
  question,
  startExpanded,
  children,
}: RenderableProps<FaqSectionProps>) {
  const [id] = useState(() => `faq-${NB_INSTANCES}`);
  const [expanded, setExpanded] = useState(startExpanded);
  const contentRef = useRef<HTMLElement>(null);

  const toggle = useCallback(() => {
    setExpanded((previous) => {
      contentRef.current?.animate(
        [{ height: "0px" }, { height: `${contentRef.current.scrollHeight}px` }],
        {
          duration: 400,
          easing: "ease-in-out",
          direction: previous ? "reverse" : "normal",
        }
      );
      return !previous;
    });
  }, []);

  return (
    <>
      <dt class={`faq-question ${expanded ? "expanded" : ""}`}>
        <button
          class="button"
          aria-expanded={expanded}
          aria-controls={id}
          onClick={toggle}
        >
          {question}
        </button>
      </dt>
      <dd
        ref={contentRef}
        class={`faq-answer ${expanded ? "expanded" : ""}`}
        id={id}
      >
        {children}
      </dd>
    </>
  );
}
