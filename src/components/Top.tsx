import styled from "@emotion/styled";
import { MdDeleteOutline } from "react-icons/md";

import { DeleteButton, Row } from "./Components";
import ResizableTextarea from "./ResizableTextarea";
import { Prompt } from "../lib/prompt";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

interface TopProps {
  prompt: Prompt;
  updatePropmt: (prompt: Partial<Prompt>) => void;
  deletePrompt: () => void;
}

const Top = ({ prompt, updatePropmt, deletePrompt }: TopProps) => {
  return (
    <Wrapper>
      <Row>
        <ResizableTextarea
          content={prompt.content}
          placeholder="プロンプトを入力．一度入力したプロンプトは保存され，左のメニューから選択できます．"
          minLh={2}
          setContent={(content) => updatePropmt({ content })}
        />
        <DeleteButton onClick={deletePrompt}>
          <MdDeleteOutline />
        </DeleteButton>
      </Row>
      <Row>
        <label>
          <input
            type="checkbox"
            checked={prompt.combined}
            onChange={(e) =>
              updatePropmt({ combined: e.currentTarget.checked })
            }
          />
          すべてのプロンプトを統合
        </label>
      </Row>
    </Wrapper>
  );
};

export default Top;
