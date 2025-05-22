import styled from "@emotion/styled";
import { useCallback, useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";

import { Row } from "./components/Components";
import ResizableTextarea from "./components/ResizableTextarea";
import Navigation from "./components/Navigation";
import Settings from "./components/Settings";
import { fetchGPT } from "./lib/api";
import { keyframes } from "@emotion/react";

const Wrapper = styled.div`
  width: calc(900px + 150px + 32px);
  margin: 32px auto;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const Content = styled.div`
  flex: 900px 0 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// content
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const contentKeyframes = keyframes`
  0% {
    opacity: 1.0;
  }
  50% {
    opacity: 0.2;
  }
  100% {
    opacity: 1.0;
  }
`;

const ContentColumn = styled.div`
  width: calc((100% - 12px) / 2);

  &[data-thinking="true"] {
    animation: ${contentKeyframes} 1s infinite;
  }
`;

const DeleteButton = styled.button`
  width: 1em;
  height: 1em;
  line-height: 1;
  color: #fff;
  font-size: 20px;
  padding: 4px;
  border: solid 1px #c00;
  box-sizing: content-box;
  border-radius: 12px;
  cursor: pointer;
  background: #c00;
  position: absolute;
  bottom: 0;
  right: calc(-1em - 8px - 12px);
`;

const ImplementRow = styled(Row)`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const ImplementButton = styled.button<{ primary: boolean }>`
  color: #fff;
  padding: 8px 32px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  background: ${({ primary }) => (primary ? "#09c" : "#999")};

  &:hover {
    background: ${({ primary }) => (primary ? "#069" : "#666")};
  }
`;

const App = () => {
  const [prompts, setPrompts] = useState<string[]>([""]);
  const [promptIndex, setPromptIndex] = useState<number>(0);
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gpt-4o-mini");
  const [contents, setContents] = useState<string[]>([""]);
  const [responses, setResponses] = useState<string[]>([""]);
  const [fetchedIndex, setFetchedIndex] = useState(100);

  const PROMPTS_KEY = "prompts";

  const prompt = prompts[promptIndex];

  // プロンプト
  const updatePropmt = (content: string) => {
    const newPrompts = prompts.map((item, i) =>
      i === promptIndex ? content : item
    );
    setPrompts(newPrompts);
    localStorage.setItem(PROMPTS_KEY, JSON.stringify(newPrompts));
  };

  const addPrompt = () => {
    const newPrompts = [...prompts, ""];
    setPrompts(newPrompts);
    localStorage.setItem(PROMPTS_KEY, JSON.stringify(newPrompts));
    updatePromptIndex(newPrompts.length - 1);
  };

  const deletePrompt = () => {
    const ok = window.confirm("プロンプトを削除しますか？");
    if (!ok) {
      return;
    }
    const newPrompts = prompts.filter((_, i) => i !== promptIndex);
    setPrompts(newPrompts);
    localStorage.setItem(PROMPTS_KEY, JSON.stringify(newPrompts));
    updatePromptIndex(0);
  };

  const updatePromptIndex = (index: number) => {
    setPromptIndex(index);
    const params = new URLSearchParams();
    params.set("prompt", index.toString());
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params}`
    );
  };

  // コンテンツ
  const updateContent = (content: string, index: number) => {
    setContents((prev) => {
      const array = prev.map((item, i) => (i === index ? content : item));
      const lastBefore = array[array.length - 2]?.trim();
      const last = array[array.length - 1]?.trim();
      if (last !== "") {
        array.push("");
      }
      if (lastBefore === "" && last === "") {
        array.pop();
      }
      return array;
    });
  };

  const deleteAllContents = () => {
    const ok = window.confirm("すべての内容を削除しますか？");
    if (!ok) {
      return;
    }
    setContents([""]);
  };

  const format = useCallback(() => {
    setContents(
      contents.map((content) => {
        let formatted = "";
        const lines = content.split("\n");
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.endsWith("-")) {
            formatted += trimmed.slice(0, -1);
          } else {
            formatted += line.trim() + " ";
          }
        }
        return formatted.trim();
      })
    );
  }, [contents]);

  const implement = useCallback(() => {
    setFetchedIndex(0);
    fetchGPT(
      prompt,
      contents.filter((content) => content.trim()),
      model,
      apiKey,
      (gptResponses: string[]) => {
        setFetchedIndex(gptResponses.length);
        setResponses(gptResponses);
      },
      () => {
        setFetchedIndex(100);
      }
    );
  }, [prompt, contents, model, apiKey]);

  useEffect(() => {
    // プロンプトを読み込み
    try {
      const prompts = JSON.parse(localStorage.getItem(PROMPTS_KEY) ?? "[]");
      if (prompts.length) {
        setPrompts(prompts);
      }
    } catch (e) {
      console.error(e);
    }

    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const tempPromptIndex = params.get("prompt");
    if (tempPromptIndex) {
      setPromptIndex(parseInt(tempPromptIndex));
    }
  }, []);

  return (
    <Wrapper>
      <Navigation
        prompts={prompts}
        promptIndex={promptIndex}
        updatePromptIndex={updatePromptIndex}
        addPrompt={addPrompt}
      />
      <Content>
        <Row>
          <ResizableTextarea
            content={prompt}
            placeholder="プロンプトを入力．一度入力したプロンプトは保存され，左のメニューから選択できます．"
            minLh={2}
            setContent={updatePropmt}
          />
          <DeleteButton onClick={deletePrompt}>
            <MdDeleteOutline />
          </DeleteButton>
        </Row>
        <ContentWrapper>
          {contents.map((content, i) => (
            <Row key={i}>
              <ContentColumn>
                <ResizableTextarea
                  content={content}
                  placeholder="内容を入力"
                  setContent={(content) => updateContent(content, i)}
                />
              </ContentColumn>
              <ContentColumn
                data-thinking={i >= fetchedIndex ? "true" : "false"}
              >
                <ResizableTextarea content={responses[i] ?? ""} />
              </ContentColumn>
              {i === 0 && (
                <DeleteButton onClick={deleteAllContents}>
                  <MdDeleteOutline />
                </DeleteButton>
              )}
            </Row>
          ))}
          <ImplementRow>
            <ImplementButton primary={false} onClick={format}>
              整形
            </ImplementButton>
            <ImplementButton primary={true} onClick={implement}>
              実行
            </ImplementButton>
          </ImplementRow>
        </ContentWrapper>
        <Settings
          model={model}
          apiKey={apiKey}
          setModel={setModel}
          setApiKey={setApiKey}
        />
      </Content>
    </Wrapper>
  );
};

export default App;
