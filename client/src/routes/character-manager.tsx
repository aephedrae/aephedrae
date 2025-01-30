import { useQuery } from "@tanstack/react-query";
import CharacterManager from "@/components/character-manager";
import PageTitle from "@/components/page-title";
import { apiClient } from "@/lib/api";

export default function CharacterManagerRoute() {
    const query = useQuery({
        queryKey: ["agents"],
        queryFn: () => apiClient.getAgents(),
        refetchInterval: 5000,
    });

    return (
        <div className="flex flex-col gap-4 h-full p-4">
            <PageTitle
                title="Character Manager"
                subtitle="Create and manage agent characters"
            />
            <CharacterManager agents={query?.data?.agents || []} />
        </div>
    );
}
