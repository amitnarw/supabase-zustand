import { Send, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState, type FormEvent } from "react";
import useStore, {
  type ChatData,
  type MessageData,
} from "@/utils/zustand_store";
import LoadingSmall from "./LoadingSmall";
import { TypingAnimation } from "./TypingAnimation";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export function CardsChat({
  setOpenChat,
}: {
  setOpenChat: (value: boolean) => void;
}) {
  const {
    showToast,
    user,
    chatLoading,
    getChat,
    onlineUsers,
    userTyping,
    sendTyping,
    createGlobalChannel,
    subscribeToChat,
    isLoadingSendMessage,
    sendMessage,
    newMessage,
  } = useStore();

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [input, setInput] = useState("");
  const inputLength = input.trim().length;

  const [chat, setChat] = useState<ChatData[] | null>(null);
  const [message, setMessage] = useState<MessageData[] | null>(null);

  useEffect(() => {
    createGlobalChannel();
    getCustomerCareChat();
  }, []);

  useEffect(() => {
    if (newMessage) {
      setMessage((preVal) => [...(preVal || []), newMessage]);
      scrollToBottom();
    }
  }, [newMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [message]);

  const getCustomerCareChat = async () => {
    let { data, error } = await getChat();
    if (error) {
      showToast("Error: " + error, "error");
    } else {
      setChat(data);
      setMessage(data ? data?.[0]?.messages : null);
      subscribeToChat();
      scrollToBottom();
    }
  };

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(Number(chat?.[0]?.id), input);
    setInput("");
  };

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      <Card className="py-4 min-w-[300px] max-w-[500px] w-full ">
        <CardHeader className="flex flex-row items-center pr-2 pl-4">
          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src="/avatars/01.png" alt="Image" />
                <AvatarFallback>E</AvatarFallback>
              </Avatar>
              <div className="text-start">
                <div className="flex flex-row items-center gap-2">
                  <p className="text-sm font-medium leading-none">Expert</p>
                  <p
                    className={`text-xs px-1.5 text-black rounded-md ${
                      chat &&
                      onlineUsers &&
                      onlineUsers?.[chat?.[0]?.receiver_user_id]?.length > 0
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {chat &&
                    onlineUsers &&
                    onlineUsers?.[chat?.[0]?.receiver_user_id]?.length > 0
                      ? "Online"
                      : "Offline"}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Customer Care Representative
                </p>
              </div>
            </div>
            <button
              className="rounded-full p-1 bg-gray-200 dark:bg-gray-800 cursor-pointer hover:bg-red-400 dark:hover:bg-red-400 hover:text-white duration-300"
              onClick={() => setOpenChat(false)}
            >
              <X size={20} />
            </button>
          </div>
        </CardHeader>

        <CardContent className="px-0">
          <ScrollArea>
            <div className="space-y-4 max-h-[350px] min-h-20 px-6">
              {chatLoading ? (
                <div className="w-full flex items-center justify-center">
                  <LoadingSmall />
                </div>
              ) : !message || message.length < 1 ? (
                <p className="text-gray-500 text-sm">No messages found</p>
              ) : (
                message.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                      message.user_id === user?.id
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {message.message}
                  </div>
                ))
              )}
              {userTyping?.isTyping && (
                <div
                  className={cn(
                    "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                    userTyping.user_id === user?.id
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <TypingAnimation />
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </CardContent>

        <CardFooter>
          <form className="flex w-full items-center space-x-2">
            <Input
              id="message"
              placeholder="Type your message..."
              className="flex-1"
              autoComplete="off"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onFocus={() => sendTyping(true)}
              onBlur={() => sendTyping(false)}
            />
            {isLoadingSendMessage ? (
              <LoadingSmall w={20} h={20} />
            ) : (
              <Button
                type="submit"
                size="icon"
                disabled={inputLength === 0}
                onClick={handleSendMessage}
              >
                <Send />
                <span className="sr-only">Send</span>
              </Button>
            )}
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
