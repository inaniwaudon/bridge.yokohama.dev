export interface Prompt {
  content: string;
  combined: boolean;
}

export const PROMPTS_KEY = "prompts";

export const getInitialPrompt = (): Prompt => {
  return { content: "", combined: false };
};

export const loadPrompts = (): Prompt[] => {
  try {
    const prompts = JSON.parse(localStorage.getItem(PROMPTS_KEY) ?? "[]");
    return prompts.length > 0 ? prompts : [getInitialPrompt()];
  } catch (e) {
    console.error(e);
    return [getInitialPrompt()];
  }
};
