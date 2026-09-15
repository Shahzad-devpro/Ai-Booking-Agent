import { Bot } from "lucide-react";

const TypingIndicator = () => {
    return (
        <div className="flex w-full justify-start">
            <div className="flex items-end gap-3">
                {/* AI Avatar */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                    <Bot size={18} />
                </div>

                {/* Typing Bubble */}
                <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TypingIndicator;