import styled from "@emotion/styled";
import { Prompt } from "../lib/prompt";

const Wrapper = styled.nav`
  height: calc(100vh - 64px);
  padding-bottom: 32px;
  display: flex;
  flex: 150px 0 0;
  flex-direction: column;
  gap: 12px;
  overflow-y: scroll;
`;

const PromptItem = styled.div<{ center?: boolean }>`
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
  prompts: Prompt[];
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
        <PromptItem
          data-selected={promptIndex === i}
          key={i}
          onClick={() => updatePromptIndex(i)}
        >
          {prompt.content.split("\n")[0]}
        </PromptItem>
      ))}
      <PromptItem center={true} onClick={addPrompt}>
        ＋
      </PromptItem>
    </Wrapper>
  );
};

export default Navigation;
