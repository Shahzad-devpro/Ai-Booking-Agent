import { Bot, User } from "lucide-react";

const MessageBubble = ({ role, content }) => {
    const isUser = role === "user";

    return (
        <div
            className={`
                flex
                w-full
                min-w-0
                ${isUser ? "justify-end" : "justify-start"}
            `}
        >
            <div
                className={`
                    flex
                    min-w-0
                    max-w-[94%]
                    items-end
                    gap-2
                    sm:max-w-[75%]
                    ${isUser ? "flex-row-reverse" : "flex-row"}
                `}
            >
                <div
                    className={`
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${
                            isUser
                                ? "bg-slate-900 text-white"
                                : "bg-sky-100 text-sky-600"
                        }
                    `}
                >
                    {isUser ? (
                        <User size={15} />
                    ) : (
                        <Bot size={16} />
                    )}
                </div>

                <div
                    className={`
                        min-w-0
                        max-w-full
                        overflow-hidden
                        whitespace-pre-wrap
                        break-words
                        [overflow-wrap:anywhere]
                        rounded-2xl
                        px-3
                        py-2.5
                        text-xs
                        leading-5
                        shadow-sm
                        sm:px-4
                        sm:py-3
                        sm:text-sm
                        sm:leading-6
                        ${
                            isUser
                                ? "rounded-br-md bg-slate-900 text-white"
                                : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
                        }
                    `}
                >
                    {content}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;