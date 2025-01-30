import type { Character } from "@elizaos/core";

enum ModelProviderName {
    OPENAI = "openai",
    ETERNALAI = "eternalai",
    ANTHROPIC = "anthropic",
    GROK = "grok",
    GROQ = "groq",
    LLAMACLOUD = "llama_cloud",
    TOGETHER = "together",
    LLAMALOCAL = "llama_local",
    GOOGLE = "google",
    MISTRAL = "mistral",
    CLAUDE_VERTEX = "claude_vertex",
    REDPILL = "redpill",
    OPENROUTER = "openrouter",
    OLLAMA = "ollama",
    HEURIST = "heurist",
    GALADRIEL = "galadriel",
    FAL = "falai",
    GAIANET = "gaianet",
    ALI_BAILIAN = "ali_bailian",
    VOLENGINE = "volengine",
    NANOGPT = "nanogpt",
    HYPERBOLIC = "hyperbolic",
    VENICE = "venice",
    NINETEEN_AI = "nineteen_ai",
    AKASH_CHAT_API = "akash_chat_api",
    LIVEPEER = "livepeer",
    LETZAI = "letzai",
    DEEPSEEK = "deepseek",
    INFERA = "infera",
}

export const DEFAULT_CHARACTER_CONFIG: Partial<Character> = {
    name: "",
    modelProvider: ModelProviderName.OPENAI,
    clients: [],
    system: "",
    bio: [],
    lore: [],
    settings: {
        secrets: {},
    },
};

export const MODEL_PROVIDERS = [
    "openai",
    "anthropic",
    "claude-vertex",
    "llamacloud",
    "together",
    "ollama",
    "lmstudio",
    "bedrock",
    "galadriel",
    "groq",
];

export const DEFAULT_CLIENTS = [
    "direct",
    "discord",
    "telegram",
    "slack",
    "auto",
];
