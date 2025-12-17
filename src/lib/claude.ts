export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type ClaudeMode = 'developer' | 'modular';

const DEVELOPER_SYSTEM_PROMPT = `You are Claude in Developer Mode - a concise, technical AI assistant for experienced developers.

Your communication style:
- Direct and to-the-point
- Use technical terminology
- Show code examples when relevant
- Focus on implementation details
- Provide structured, numbered responses
- Skip pleasantries, get straight to solutions

You help developers work faster by being efficient and precise.`;

const MODULAR_SYSTEM_PROMPT = `You are Claude in Modular Mode - a warm, encouraging AI guide for creative builders of all skill levels.

Your communication style:
- Friendly and supportive
- Use emojis occasionally (but not excessively)
- Ask clarifying questions
- Break down complex concepts
- Celebrate progress and ideas
- Provide context and reasoning
- Be patient and thorough

You help people bring their ideas to life, regardless of their technical background. Every creation starts with permission and possibility.`;

class ClaudeClient {
  private messageCount: number = 0;

  async sendMessage(
    messages: ClaudeMessage[],
    mode: ClaudeMode = 'developer'
  ): Promise<string> {
    // Simulate API latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const systemPrompt =
      mode === 'developer' ? DEVELOPER_SYSTEM_PROMPT : MODULAR_SYSTEM_PROMPT;

    return this.generateMockResponse(messages, systemPrompt);
  }

  private generateMockResponse(
    messages: ClaudeMessage[],
    systemPrompt: string
  ): string {
    if (messages.length === 0) {
      return 'Hello! How can I help you today?';
    }

    const lastMessage = messages[messages.length - 1];
    this.messageCount++;

    // Developer mode responses (concise, technical)
    if (systemPrompt.includes('Developer Mode')) {
      const responses = [
        `I understand you want to work on: "${lastMessage.content}"

Let me help you with that. Here's my technical take:

1. First, we should analyze the requirements
2. Then identify the key components
3. Finally, implement and test

What specific aspect would you like to focus on first?`,
        `Got it. That's a solid approach. Let me break down the implementation strategy:

\`\`\`typescript
// Pseudo-code structure
interface Solution {
  execute(): Promise<void>;
}

class Implementation implements Solution {
  async execute() {
    // implementation details
  }
}
\`\`\`

Shall we proceed with this architecture?`,
        `Excellent. I'll help you optimize that. Here are the key considerations:

• Performance: O(n) complexity
• Memory: Minimal allocation
• Edge cases: Handle null, empty inputs

Ready to implement?`,
        `Here's the breakdown:

**Approach 1: Direct implementation**
- Pros: Simpler, faster to build
- Cons: Less flexible

**Approach 2: Modular design**
- Pros: Reusable, testable
- Cons: More upfront work

Which direction makes sense for your use case?`,
      ];

      return responses[this.messageCount % responses.length];
    }

    // Modular mode responses (guided, encouraging)
    const responses = [
      `That's a wonderful idea! You want to work on: "${lastMessage.content}"

Let's break this down together. To help you build this, I have a few questions:

1. Who is this for? (yourself, family member, community?)
2. What's the main problem it solves?
3. Do you have any technical constraints? (budget, timeline, etc.)

Take your time - there are no wrong answers! ✨`,
      `Great! I love where this is going. Let me help you think through the next steps:

💡 **Idea Refinement:**
Based on what you've told me, here's what I'm hearing...

🎯 **Action Plan:**
1. Define the core features
2. Sketch out the user experience
3. Identify resources we might need

What feels like the right next step for you?`,
      `This is really taking shape! You're doing great. 🌟

Let's talk about making this real:

📦 **What you'll need:**
- Design inspiration (we can look at examples together)
- Basic structure (I'll help you build this)
- Interactivity (we'll add this step-by-step)

Should we dive deeper into any of these aspects?`,
      `Wonderful progress! I can see your vision coming together.

Let me suggest a gentle path forward:

**Stage 1:** Create the foundation
- Start simple, add complexity gradually
- Test as we go

**Stage 2:** Add your unique touches
- This is where your creativity shines
- I'll guide you through the options

**Stage 3:** Polish and refine
- Make it feel just right
- Celebrate what you've built!

Which stage excites you most?`,
    ];

    return responses[this.messageCount % responses.length];
  }

  reset() {
    this.messageCount = 0;
  }
}

// Singleton instance
export const claudeClient = new ClaudeClient();
