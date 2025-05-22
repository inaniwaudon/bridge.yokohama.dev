import styled from "@emotion/styled";

const Wrapper = styled.nav`
  height: calc(100vh - 64px);
  padding-bottom: 32px;
  display: flex;
  flex: 150px 0 0;
  flex-direction: column;
  gap: 12px;
  overflow-y: scroll;
`;

const Prompt = styled.div<{ center?: boolean }>`
  min-height: 1lh;
  line-height: 1.2;
  text-align: ${({ center }) => (center ? "center" : "left")};
  font-size: 11px;
  padding: 8px 10px;
  cursor: pointer;
  flex-shrink: 0;
  border-radius: 8px;
  background: #f0f0f0;

  &:hover {
    background: #e0e0e0;
  }

  &[data-selected="true"] {
    background: #09c;
    color: #fff;
  }
`;

interface NavigationProps {
  prompts: string[];
  promptIndex: number;
  updatePromptIndex: (index: number) => void;
  addPrompt: () => void;
}

const Navigation = ({
  prompts,
  promptIndex,
  updatePromptIndex,
  addPrompt,
}: NavigationProps) => {
  return (
    <Wrapper>
      {prompts.map((prompt, i) => (
        <Prompt
          data-selected={promptIndex === i}
          key={prompt}
          onClick={() => updatePromptIndex(i)}
        >
          {prompt.split("\n")[0]}
        </Prompt>
      ))}
      <Prompt center={true} onClick={addPrompt}>
        ＋
      </Prompt>
    </Wrapper>
  );
};

export default Navigation;
