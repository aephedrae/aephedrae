import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Save, Plus } from "lucide-react";
import type { Character, UUID } from "@elizaos/core";
import { DEFAULT_CHARACTER_CONFIG } from "@/constants/character";
import type { CharacterManagerProps } from "@/types/character-manager";

interface SelectedCharacter {
    id: UUID;
    name: string;
}

export default function CharacterManager({ agents }: CharacterManagerProps) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [_, setSelectedCharacter] = useState<SelectedCharacter | null>(null);
    const [jsonContent, setJsonContent] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [activeTab, setActiveTab] = useState("editor");

    const mutation = useMutation({
        mutationKey: ["saveCharacter"],
        mutationFn: async (config: Character) => {
            await apiClient.saveCharacter(config);
            return apiClient.restartAgent(config.id || "", config);
        },
        onSuccess: () => {
            toast({
                title: "Success",
                description:
                    "Character configuration saved and agent restarted",
            });
            queryClient.invalidateQueries({ queryKey: ["agents"] });
        },
        onError: (err: Error) => {
            toast({
                variant: "destructive",
                title: "Error",
                description: err.message,
            });
        },
    });

    const validateConfig = (config: Partial<Character>): void => {
        const requiredFields = ["name", "modelProvider", "clients"];
        const missing = requiredFields.filter(
            (field) => !config[field as keyof Character]
        );

        if (missing.length > 0) {
            throw new Error(`Missing required fields: ${missing.join(", ")}`);
        }
    };

    const handleSave = async (): Promise<void> => {
        try {
            setError("");
            const config = JSON.parse(jsonContent) as Character;
            validateConfig(config);
            mutation.mutate(config);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Invalid JSON");
        }
    };

    const loadCharacter = async (agent: SelectedCharacter): Promise<void> => {
        try {
            const data = await apiClient.getAgent(agent.id);
            setSelectedCharacter(agent);
            setJsonContent(JSON.stringify(data.character, null, 2));
            setError("");
            setActiveTab("editor");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to load character"
            );
        }
    };

    const createNewCharacter = (): void => {
        setSelectedCharacter(null);
        setJsonContent(JSON.stringify(DEFAULT_CHARACTER_CONFIG, null, 2));
        setError("");
        setActiveTab("editor");
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-between">
                        <CardTitle>Character Configuration</CardTitle>
                        <div className="flex gap-2">
                            <Button
                                onClick={createNewCharacter}
                                variant="outline"
                                size="sm"
                            >
                                <Plus className="mr-2 size-4" />
                                New Character
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={!jsonContent || mutation.isPending}
                                size="sm"
                            >
                                <Save className="mr-2 size-4" />
                                Save & Restart
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                    >
                        <TabsList>
                            <TabsTrigger value="editor">Editor</TabsTrigger>
                            <TabsTrigger value="existing">
                                Existing Characters
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="editor">
                            <div className="space-y-4">
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertTitle>{error}</AlertTitle>
                                    </Alert>
                                )}
                                <Textarea
                                    value={jsonContent}
                                    onChange={(e) =>
                                        setJsonContent(e.target.value)
                                    }
                                    placeholder="Paste your character configuration JSON here..."
                                    className="font-mono min-h-[500px]"
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="existing">
                            <div className="space-y-4">
                                {agents?.map((agent) => (
                                    <Card key={agent.id}>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div>
                                                        <p className="text-sm font-medium leading-none">
                                                            {agent.name}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {agent.id}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        onClick={() =>
                                                            loadCharacter(agent)
                                                        }
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        Edit
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
