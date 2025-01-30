import type { Character, UUID } from "@elizaos/core";

export interface CharacterResponse {
    id: UUID;
    character: Character;
}

export interface AgentResponse {
    agents: Array<{
        id: UUID;
        name: string;
    }>;
}

export interface CharacterManagerProps {
    agents: Array<{
        id: UUID;
        name: string;
    }>;
}
