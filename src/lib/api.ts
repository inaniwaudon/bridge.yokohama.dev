export const fetchGPT = async (
  prompt: string,
  contents: string[],
  model: string,
  apiKey: string,
  callback: (response: string[]) => void,
  finishedCallback: () => void
) => {
  const URL = "https://api.openai.com/v1/chat/completions";
  const systemPrompt = `上記の指示を実行する対象の内容は，以下の JSON 形式の配列で与えられます．
[
  {
    "no": 1, // 通し番号
    "content": "指示を実行する対象の内容"
  }, ...
]

これに対して，以下の JSON 形式の配列で回答を返してください．
コメント等が存在する場合，それを含めたすべての内容を answer に含めてください．
[
  {
    "no": 1, // 通し番号
    "answer": "全ての回答"
  }, ...
]
`;

  const userPrompts = contents.map((content, i) => ({
    role: "user",
    content: JSON.stringify({ no: i + 1, content }, undefined, "  "),
  }));
  const systemRole = model.includes("o1") ? "user" : "system";

  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: systemRole, content: prompt },
        { role: systemRole, content: systemPrompt },
        ...userPrompts,
      ],
      stream: true,
    }),
  });
  if (!response.body) {
    return;
  }
  if (!response.ok) {
    const message = ((await response.json()) as { error: { message: string } })
      .error.message;
    alert(message);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let responseText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    const text = decoder.decode(value);
    const lines = text.split(/\n+/);

    for (const line of lines) {
      const lineText = line.replace(/^data:\s*/, "");
      if (lineText === "[DONE]") {
        finishedCallback();
        break;
      }
      if (!lineText) {
        continue;
      }
      try {
        const data = JSON.parse(lineText);
        const content = data.choices[0].delta.content;
        if (content) {
          responseText += content;
          const parsed = parsePartialResponses(responseText);
          callback(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
};

const parsePartialResponses = (responseText: string) => {
  const blocks = responseText.match(/\{\s*".+?"\s*\}/gs) || [];
  const responses: string[] = [];

  for (const block of blocks) {
    console.log(block);
    try {
      const parsed = JSON.parse(block);
      if (parsed.no && "answer" in parsed) {
        responses.push(parsed.answer);
      }
    } catch {
      // pass
    }
  }
  return responses;
};
