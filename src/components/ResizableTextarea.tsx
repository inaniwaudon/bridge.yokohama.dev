import styled from "@emotion/styled";
import { useCallback, useRef } from "react";

const Wrapper = styled.div`
  max-width: 100%;
  position: relative;
  width: 100%;
  height: 100%;
  line-height: 1.5;

  * {
    font-size: 15px;
  }
`;

const Dummy = styled.div<{ minLh?: number }>`
  min-height: ${({ minLh }) => minLh ?? 1}lh;
  padding: 16px 20px;
  overflow: hidden;
  visibility: hidden;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
`;

const Textarea = styled.textarea<{ hidden?: boolean }>`
  width: calc(100% - 20px * 2);
  height: calc(100% - 16px * 2);
  color: ${({ hidden }) => (hidden ? "transparent" : "inherit")};
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
  padding: 16px 20px;
  border: none;
  border-radius: 16px;
  display: block;
  overflow: hidden;
  background: #f3f3f3;
  position: absolute;
  top: 0;
  left: 0;
  resize: none;
`;

interface ResizableTextareaProps {
  content: string;
  placeholder?: string;
  minLh?: number;
  hidden?: boolean;
  setContent?: (content: string) => void;
}

const ResizableTextarea = ({
  content,
  placeholder,
  minLh,
  hidden,
  setContent,
}: ResizableTextareaProps) => {
  const dummyRef = useRef<HTMLDivElement>(null);

  const onInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (dummyRef.current && setContent) {
        setContent(e.target.value);
      }
    },
    [setContent]
  );

  return (
    <Wrapper>
      <Dummy aria-hidden="true" minLh={minLh} ref={dummyRef}>
        {content + "\u200b"}
      </Dummy>
      <Textarea
        value={content}
        placeholder={placeholder}
        hidden={hidden}
        onInput={onInput}
      />
    </Wrapper>
  );
};

export default ResizableTextarea;
