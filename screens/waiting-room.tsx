import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Copy, Crown, Loader2, Users } from "lucide-react";
import { GameWithPlayers } from "@/server/api/routers/games";
import { authClient } from "@/lib/auth-client";
import { api } from "@/trpc/react";
import { useToast } from "@/hooks/use-toast";

function WaitingRoom(game: GameWithPlayers) {
  const { players } = game;
  const user = authClient.useSession().data?.user;
  const { toast } = useToast();

  const currentUserIsCreator = game.players.find(
    (player) => player.isCreator && player.userId === user?.id
  );

  const startGame = api.games.startGame.useMutation({
    onSuccess: () => {
      // Invalidate and refetch articles query
      // utils.games.getGame.invalidate().catch((error) => {
      //   console.error("Failed to invalidate cache:", error);
      // });
      console.log("Game started successfully!");
    },
    onError: (error) => {
      console.log(`Failed to start game: ${error.message}`);
    },
  });

  async function handleStartGame() {
    try {
      const result = await startGame.mutateAsync({ gameId: game.id });

      if (result.success) {
        // refetch game
      } else {
        console.error("Game started, but there is an error");
      }
    } catch (error) {
      console.error("Failed to start game:", error);
      if (error instanceof Error) {
        alert(`Failed to start game: ${error.message}`);
      } else {
        alert("Failed to start game. Please try again.");
      }
    }
  }

  const handleCopyGameCode = () => {
    navigator.clipboard.writeText(game.code).then(() => {
      toast({
        title: "Copied!",
        description: "Game code copied to clipboard",
      });
    });
  };

  const handleCopyGameUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Copied!",
        description: "Game URL copied to clipboard",
      });
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-slate-950 shadow-sm">
        <div className="text-center">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
            Game Lobby
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Waiting for players to join
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Game Code */}
        <Card className="border-0 shadow-lg dark:bg-slate-900 dark:shadow-slate-900/50">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Game Code
                </p>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-3xl font-bold text-red-600 dark:text-red-400 tracking-wider">
                    {game?.code}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyGameCode}
                    className="hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Share this code or the game URL with other players
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyGameUrl}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Game URL
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Players List */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Players ({players.length}/8)
            </h2>
          </div>

          <div className="space-y-3">
            {players.map((player) => (
              <Card
                key={player.id}
                className="border-0 shadow-sm dark:bg-slate-900 dark:shadow-slate-900/50"
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={player.user.image || "/placeholder.svg"}
                      />
                      <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                        {player.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {player.user.name}
                      </p>
                      {player.isCreator && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Crown className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-slate-600 dark:text-slate-400">
                            Game Creator
                          </span>
                        </div>
                      )}
                    </div>
                    <Badge variant="secondary" status="completed">
                      Ready
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Loading Animation */}
        <Card className="border-0 shadow-sm dark:bg-slate-900 dark:shadow-slate-900/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-red-600 dark:bg-red-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-red-600 dark:bg-red-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-red-600 dark:bg-red-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <span className="ml-3 text-slate-600 dark:text-slate-400">
                Waiting for more players...
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Start Game Button */}
        <Button
          className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold"
          disabled={
            players.length < 2 || !currentUserIsCreator || startGame.isPending
          }
          onClick={handleStartGame}
        >
          {startGame.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Starting...
            </>
          ) : (
            "Start Game"
          )}
        </Button>
      </div>
    </div>
  );
}

export default WaitingRoom;
