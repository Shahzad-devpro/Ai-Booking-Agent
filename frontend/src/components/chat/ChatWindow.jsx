import { useEffect, useRef, useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Bot,
    CalendarCheck,
    Clock3,
    Flame,
    MessageCircle,
    Send,
    ShieldCheck,
    Snowflake,
    Sparkles,
} from "lucide-react";

import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import useChat from "../../hooks/useChat";
import AvailabilityCard from "./AvailabilityCard";
import BookingConfirmation from "./BookingConfirmation";

const quickActions = [
    {
        label: "AC problem",
        message: "I have a problem with my AC.",
        icon: Snowflake,
    },
    {
        label: "Heating problem",
        message: "I have a problem with my heating system.",
        icon: Flame,
    },
    {
        label: "Book a service",
        message: "I'd like to book an HVAC service appointment.",
        icon: CalendarCheck,
    },
    {
        label: "Emergency",
        message: "I have an urgent HVAC problem and need help.",
        icon: ShieldCheck,
    },
];

const formatSlotDate = (isoString) => {
    if (!isoString) return "";

    return new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "America/New_York",
    }).format(new Date(isoString));
};

const formatSlotTime = (isoString) => {
    if (!isoString) return "";

    return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/New_York",
    }).format(new Date(isoString));
};

const ChatWindow = () => {
    const {
        messages,
        conversationId,
        isTyping,
        sendMessage,
    } = useChat();

    const [input, setInput] = useState("");
    const [showQuickActions, setShowQuickActions] = useState(true);

    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
        });
    }, [messages, isTyping]);

    useEffect(() => {
        const textarea = textareaRef.current;

        if (!textarea) return;

        textarea.style.height = "auto";

        const height = Math.min(
            Math.max(textarea.scrollHeight, 44),
            140
        );

        textarea.style.height = `${height}px`;
    }, [input]);

    const handleSendMessage = async (message) => {
        const trimmedMessage = message?.trim();

        if (!trimmedMessage || isTyping) {
            return;
        }

        setInput("");
        setShowQuickActions(false);

        try {
            await sendMessage(trimmedMessage);
        } catch {
            // useChat already adds the user-friendly error message.
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        handleSendMessage(input);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();

            handleSendMessage(input);
        }
    };

    return (
        <div className="flex h-[100dvh] min-h-0 w-full min-w-0 flex-col overflow-hidden bg-slate-50">
            {/* HEADER */}
            <header className="w-full shrink-0 border-b border-slate-200 bg-white">
                <div className="mx-auto flex h-14 w-full min-w-0 items-center justify-between px-2 sm:h-16 sm:px-6">
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            aria-label="Go back"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                        >
                            <ArrowLeft size={18} />
                        </button>

                        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                            <Bot size={19} />

                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h1 className="truncate text-xs font-bold text-slate-900 sm:text-base">
                                CoolAir AI Receptionist
                            </h1>

                            <p className="truncate text-[10px] text-slate-400 sm:text-xs">
                                Your HVAC service assistant
                            </p>
                        </div>
                    </div>

                    <div className="hidden shrink-0 items-center gap-4 sm:flex">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Clock3 size={14} />
                            9 AM – 5 PM
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <ShieldCheck
                                size={14}
                                className="text-emerald-500"
                            />
                            Secure
                        </div>
                    </div>
                </div>
            </header>

            {/* CHAT AREA */}
            <main className="min-h-0 w-full min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain">
                <div className="mx-auto w-full max-w-4xl min-w-0 px-2 py-5 sm:px-6 sm:py-8">
                    <div className="mb-6 w-full text-center sm:mb-8">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 sm:h-14 sm:w-14">
                            <Sparkles size={22} />
                        </div>

                        <h2 className="mt-3 text-lg font-extrabold tracking-tight text-slate-950 sm:mt-4 sm:text-2xl">
                            How can we help?
                        </h2>

                        <p className="mx-auto mt-2 max-w-md px-2 text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
                            Tell us what's happening with your heating or
                            cooling system and we'll help you with the next
                            step.
                        </p>
                    </div>

                    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className="flex w-full min-w-0 flex-col gap-2"
                            >
                                <MessageBubble
                                    role={message.role}
                                    content={message.content}
                                />

                                {message.availability && (
                                    <div className="ml-10 max-w-md">
                                        <AvailabilityCard
                                            availability={message.availability}
                                            disabled={isTyping}
                                            onSelectSlot={(slot) => {
                                                const selectedDate =
                                                    formatSlotDate(
                                                        slot.startTime
                                                    );

                                                const selectedTime =
                                                    formatSlotTime(
                                                        slot.startTime
                                                    );

                                                handleSendMessage(
                                                    `I'd like to book the appointment on ${selectedDate} at ${selectedTime}.`
                                                );
                                            }}
                                        />
                                    </div>
                                )}

                                {message.appointment && (
                                    <div className="ml-10 max-w-md">
                                        <BookingConfirmation
                                            appointment={message.appointment}
                                            lead={message.lead}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}

                        {isTyping && <TypingIndicator />}

                        <div ref={messagesEndRef} />
                    </div>

                    {showQuickActions && !isTyping && (
                        <div className="mt-6 w-full min-w-0 sm:mt-8">
                            <div className="mb-3 flex items-center gap-2">
                                <MessageCircle
                                    size={14}
                                    className="text-sky-500"
                                />

                                <span className="text-xs font-bold text-slate-500">
                                    Quick start
                                </span>
                            </div>

                            <div className="grid w-full min-w-0 grid-cols-1 gap-2 sm:grid-cols-2">
                                {quickActions.map((action) => {
                                    const Icon = action.icon;

                                    return (
                                        <button
                                            key={action.label}
                                            type="button"
                                            onClick={() =>
                                                handleSendMessage(
                                                    action.message
                                                )
                                            }
                                            className="flex min-w-0 w-full items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-sky-200 hover:shadow-md"
                                        >
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                                                <Icon size={15} />
                                            </span>

                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate text-xs font-bold text-slate-800">
                                                    {action.label}
                                                </span>

                                                <span className="mt-0.5 block truncate text-[10px] text-slate-400">
                                                    Start with this request
                                                </span>
                                            </span>

                                            <ArrowRight
                                                size={14}
                                                className="shrink-0 text-slate-300"
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {conversationId && (
                        <p className="mt-6 text-center text-[9px] text-slate-300">
                            Conversation connected
                        </p>
                    )}
                </div>
            </main>

            {/* COMPOSER */}
            <footer
                className="w-full shrink-0 border-t border-slate-200 bg-white"
                style={{
                    paddingBottom:
                        "max(8px, env(safe-area-inset-bottom))",
                }}
            >
                <form
                    className="mx-auto w-full max-w-4xl min-w-0 px-2 pt-2 sm:px-6 sm:pt-4"
                    onSubmit={handleSubmit}
                >
                    <div className="flex w-full min-w-0 items-end gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1 focus-within:border-sky-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-50 sm:rounded-2xl sm:p-1.5">
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(event) =>
                                setInput(event.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            placeholder="Describe your HVAC issue..."
                            rows={1}
                            disabled={isTyping}
                            aria-label="Message CoolAir AI receptionist"
                            className="block min-h-10 min-w-0 flex-1 resize-none overflow-y-auto bg-transparent px-2.5 py-2 text-xs leading-5 text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-11 sm:px-3 sm:py-2.5 sm:text-sm sm:leading-6"
                        />

                        <button
                            type="submit"
                            disabled={isTyping || !input.trim()}
                            aria-label="Send message"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white transition hover:bg-sky-600 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 sm:h-11 sm:w-11 sm:rounded-xl"
                        >
                            <Send size={16} />
                        </button>
                    </div>

                    <p className="mt-1 px-1 text-center text-[9px] leading-4 text-slate-400 sm:mt-2 sm:text-[11px]">
                        AI receptionist • Secure service request • Enter to
                        send
                    </p>
                </form>
            </footer>
        </div>
    );
};

export default ChatWindow;
