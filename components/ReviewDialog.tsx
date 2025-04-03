"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink, Send, Youtube } from "lucide-react";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: string;
  resources?: {
    video?: { title: string; url: string };
    ref_videos?: { title: string; url: string }[];
    ref_articles?: { title: string; url: string }[];
  };
}

export function ReviewDialog({
  open,
  onOpenChange,
  question,
  resources,
}: ReviewDialogProps) {
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    setChatMessages([...chatMessages, { role: "user", content: inputMessage }]);

    // Simulate AI response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I'll help you understand the concept related to "${question}". What specific aspect are you struggling with?`,
        },
      ]);
    }, 1000);

    setInputMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Review: {question}</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="resources"
          className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="resources">Learning Resources</TabsTrigger>
            <TabsTrigger value="chat">AI Assistant</TabsTrigger>
          </TabsList>

          <TabsContent value="resources" className="flex-1 overflow-auto">
            <div className="space-y-6">
              {resources?.video &&
                resources.ref_videos &&
                resources.ref_videos.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Video Tutorials</h3>

                    {/* Featured Video */}
                    {resources.video && (
                      <div className="aspect-video bg-muted rounded-md overflow-hidden">
                        <iframe
                          width="100%"
                          height="100%"
                          src={resources.video.url}
                          title={resources.video.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen></iframe>
                      </div>
                    )}

                    {/* Video List */}
                    <div className="space-y-2">
                      {resources.ref_videos.slice(1).map((video, index) => (
                        <a
                          key={index}
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-3 rounded-md border hover:bg-muted transition-colors">
                          <Youtube className="h-5 w-5 mr-2 text-red-500" />
                          <span className="flex-1">{video.title}</span>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              {resources?.ref_articles && resources.ref_articles.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Helpful Articles</h3>
                  <div className="space-y-2">
                    {resources.ref_articles.map((article, index) => (
                      <a
                        key={index}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 rounded-md border hover:bg-muted transition-colors">
                        <span className="flex-1">{article.title}</span>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent
            value="chat"
            className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 mb-4 border rounded-md">
              {chatMessages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p>Ask the AI assistant about this concept.</p>
                  <p className="text-sm">
                    {"Example: Can you explain this in simpler terms?"}
                  </p>
                </div>
              ) : (
                chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2">
              <Textarea
                placeholder="Ask a question about this concept..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="min-h-[60px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
