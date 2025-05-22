import styled from "@emotion/styled";

import { Row } from "./Components";
import ResizableTextarea from "./ResizableTextarea";
import { useEffect } from "react";

const SettingsRow = styled(Row)`
  gap: 16px;
  align-items: center;

  label {
    flex: 5em 0 0;
  }

  a {
    color: #09c;
    text-decoration-color: #9cf;
    text-underline-offset: 8px;
  }
`;

const Value = styled.div`
  flex-grow: 1;
`;

interface SettingsProps {
  model: string;
  apiKey: string;
  setModel: (model: string) => void;
  setApiKey: (apiKey: string) => void;
}

const Settings = ({ model, apiKey, setModel, setApiKey }: SettingsProps) => {
  const OPENAI_API_KEY = "OPENAI_API_KEY";
  const MODEL_KEY = "model";

  const updateApiKey = (content: string) => {
    setApiKey(content);
    localStorage.setItem(OPENAI_API_KEY, content);
  };

  const updateModel = (content: string) => {
    setModel(content);
    localStorage.setItem(MODEL_KEY, content);
  };

  useEffect(() => {
    // API キーを読み込み
    const apiKey = localStorage.getItem(OPENAI_API_KEY);
    if (apiKey) {
      setApiKey(apiKey);
    }

    // モデルを読み込み
    const model = localStorage.getItem(MODEL_KEY);
    if (model) {
      setModel(model);
    }
  }, [setApiKey, setModel]);

  return (
    <>
      <SettingsRow>
        <label>
          <a href="https://openai.com/ja-JP/api/pricing/" target="_blank">
            モデル
          </a>
        </label>
        <Value>
          <ResizableTextarea
            content={model}
            placeholder="e.g. gpt-4o / gpt-4o-mini / o1 / o1-mini"
            setContent={updateModel}
          />
        </Value>
      </SettingsRow>
      <SettingsRow>
        <label>
          <a href="https://platform.openai.com/">API キー</a>
        </label>
        <Value>
          <ResizableTextarea
            content={apiKey}
            placeholder="OpenAI の API キーを入力"
            setContent={updateApiKey}
          />
        </Value>
      </SettingsRow>
    </>
  );
};

export default Settings;
