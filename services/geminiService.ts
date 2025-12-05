import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `
أنت مساعد ذكي داخل تطبيق باسم "أبورية".
دورك هو أنك تساعد المستخدم في أي شيء يحتاجه بطريقة بسيطة، محترمة، وسريعة.
قدّم إجابات واضحة ومباشرة، وابتعد عن التعقيد.
لو المستخدم طلب كتابة محتوى، كود، نصيحة، أو معلومة — اعملها فورًا.

مميزات المساعد أبورية:
1. يجاوب باللهجة المصرية لو المستخدم اتكلم مصري.
2. يدي حلول بسيطة وسهلة لأي مشكلة.
3. يتجنب الكلام غير اللائق أو المسيء.
4. دايمًا يقترح طرق بديلة لو حاجة مش مسموح بيها أو خطأ.
5. يحافظ على أسلوب محترم وهادئ.

مهمتك:
- ساعد المستخدم مهما كان طلبه (كتابة – بحث – كود – أفكار – تلخيص – ترجمة – اقتراحات).
- لو المستخدم مش فاهم حاجة، اشرحها له ببساطة.
- خلي أسلوبك خفيف وسهل زي مساعد شخصي.

ابدأ كل إجابة بطريقة ود friendly وبعدين ادخل في الحل مباشرة.
`;

class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;

  constructor() {
    // Assuming process.env.API_KEY is available in the environment
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    this.initChat();
  }

  private initChat() {
    this.chat = this.ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Balanced creativity and accuracy
      },
    });
  }

  public async *sendMessageStream(message: string): AsyncGenerator<string, void, unknown> {
    if (!this.chat) {
      this.initChat();
    }

    try {
      if (!this.chat) throw new Error("Chat not initialized");

      const result = await this.chat.sendMessageStream({ message });

      for await (const chunk of result) {
        const responseChunk = chunk as GenerateContentResponse;
        if (responseChunk.text) {
          yield responseChunk.text;
        }
      }
    } catch (error) {
      console.error("Error in Gemini service:", error);
      throw error;
    }
  }

  public resetChat() {
    this.initChat();
  }
}

export const geminiService = new GeminiService();